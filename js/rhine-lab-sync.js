(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};
    const ATTACHMENT_BUCKET = 'rhine-lab-attachments';
    const ui = {
        control: document.getElementById('syncControl'),
        label: document.getElementById('syncStatusLabel'),
        dialog: document.getElementById('syncDialog'),
        title: document.getElementById('syncDialogTitle'),
        description: document.getElementById('syncDialogDescription'),
        loginForm: document.getElementById('syncLoginForm'),
        email: document.getElementById('syncEmail'),
        account: document.getElementById('syncAccount'),
        accountEmail: document.getElementById('syncAccountEmail'),
        accountRole: document.getElementById('syncAccountRole'),
        message: document.getElementById('syncMessage'),
        signOut: document.getElementById('syncSignOut'),
        entrySaveStatus: document.getElementById('entrySaveStatus'),
        systemConnection: document.getElementById('systemConnectionLabel'),
        systemSync: document.getElementById('systemSyncLabel'),
        systemBadge: document.getElementById('systemSyncBadge')
    };

    let adapter = null;
    let supabase = null;
    let user = null;
    let membership = null;
    let currentScope = 'personal';
    let currentChannel = null;
    let pendingSave = null;
    let saveTimer = null;
    let applyingRemote = false;
    let started = false;

    function configured() {
        return /^https:\/\/.+\.supabase\.co\/?$/i.test(String(config.supabaseUrl || '')) && String(config.supabasePublishableKey || '').length > 20;
    }

    function setStatus(state, label, message) {
        if (ui.control) ui.control.dataset.syncState = state;
        if (ui.label) ui.label.textContent = label;
        if (ui.message && message) ui.message.textContent = message;
        if (ui.entrySaveStatus) {
            ui.entrySaveStatus.textContent = user ? '保存后自动同步到已登录设备' : '数据将先保存到本机缓存';
        }
        if (ui.systemConnection) ui.systemConnection.textContent = user ? (state === 'offline' ? '云端等待中' : '云端已连接') : '本地模式';
        if (ui.systemSync) {
            const compactStatus = state === 'synced' ? '所有设备数据一致' : state === 'readonly' ? 'LAB 共用数据只读' : state === 'offline' ? '修改将在联网后上传' : state === 'error' ? '本机数据安全，云端待重试' : '正在与云端通信';
            ui.systemSync.textContent = user ? compactStatus : '云同步未连接';
        }
        if (ui.systemBadge) ui.systemBadge.textContent = user ? (state === 'synced' || state === 'readonly' ? 'SYNC' : 'WAIT') : 'LOCAL';
    }

    function updateAccountUi() {
        const signedIn = Boolean(user);
        if (ui.loginForm) ui.loginForm.hidden = signedIn;
        if (ui.account) ui.account.hidden = !signedIn;
        if (ui.signOut) ui.signOut.hidden = !signedIn;
        if (ui.accountEmail) ui.accountEmail.textContent = signedIn ? (user.email || '已验证账户') : '—';
        if (ui.accountRole) {
            const role = membership && membership.role;
            ui.accountRole.textContent = role === 'owner' ? 'LAB 所有者' : role === 'manager' ? 'LAB 管理员' : role === 'member' ? 'LAB 成员 · 只读共用区' : '仅个人工作区';
        }
    }

    function roleCanWriteLab() {
        return Boolean(membership && (membership.role === 'owner' || membership.role === 'manager'));
    }

    function updateAccess() {
        const labReadOnly = currentScope === 'lab' && !roleCanWriteLab();
        if (adapter && adapter.setAccess) {
            adapter.setAccess({
                authenticated: Boolean(user),
                readOnly: labReadOnly,
                role: membership ? membership.role : '',
                labId: membership ? membership.lab_id : ''
            });
        }
        if (!user) {
            setStatus('local', '仅此设备', configured() ? '登录后即可在电脑与手机之间同步。' : '云同步尚未配置；页面仍可作为本地工作台使用。');
        } else if (currentScope === 'lab' && !membership) {
            setStatus('warning', '无 LAB 权限', '此账户尚未加入 LAB；个人工作区仍会正常同步。');
        } else if (labReadOnly) {
            setStatus('readonly', 'LAB 只读', '共用页面会实时同步，但只有 LAB 管理员可以修改。');
        } else {
            setStatus(navigator.onLine ? 'synced' : 'offline', navigator.onLine ? '已同步' : '等待网络', navigator.onLine ? '这台设备已连接云端，保存后会同步到其他已登录设备。' : '当前离线；修改已留在本机，恢复网络后会继续同步。');
        }
        updateAccountUi();
    }

    function workspaceKey(scope) {
        if (!user) return '';
        if (scope === 'lab') return membership ? 'lab:' + membership.lab_id : '';
        return 'user:' + user.id;
    }

    function dirtyStorageKey(scope) {
        return 'rhineLabSyncDirty:' + (scope === 'lab' ? 'lab' : 'personal');
    }

    async function importClient() {
        const library = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        return library.createClient(config.supabaseUrl.replace(/\/$/, ''), config.supabasePublishableKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
    }

    async function start(nextAdapter) {
        if (started) return;
        started = true;
        adapter = nextAdapter;
        currentScope = adapter && adapter.getScope ? adapter.getScope() : 'personal';
        bindUi();
        updateAccess();
        if (!configured()) return;

        setStatus('connecting', '正在连接', '正在连接 Rhine Lab 云端…');
        try {
            supabase = await importClient();
            supabase.auth.onAuthStateChange(function (_event, session) {
                window.setTimeout(function () { handleSession(session); }, 0);
            });
            const result = await supabase.auth.getSession();
            if (result.error) throw result.error;
            await handleSession(result.data.session);
        } catch (error) {
            setStatus('error', '连接失败', readableError(error, '无法连接云端，请检查配置或网络。'));
        }
    }

    async function handleSession(session) {
        user = session && session.user ? session.user : null;
        membership = null;
        await leaveChannel();
        if (!user) {
            updateAccess();
            return;
        }

        try {
            let query = supabase.from('lab_members').select('lab_id, role, created_at, labs(name)').eq('user_id', user.id).order('created_at', { ascending: true }).limit(1);
            if (config.labId) query = query.eq('lab_id', config.labId);
            const result = await query.maybeSingle();
            if (result.error) throw result.error;
            membership = result.data || null;
            updateAccess();
            await switchScope(currentScope);
        } catch (error) {
            updateAccountUi();
            setStatus('error', '权限检查失败', readableError(error, '无法读取 LAB 权限；请确认数据库脚本已执行。'));
        }
    }

    async function switchScope(scope) {
        currentScope = scope === 'lab' ? 'lab' : 'personal';
        updateAccess();
        await leaveChannel();
        if (!supabase || !user || (currentScope === 'lab' && !membership)) return;

        const key = workspaceKey(currentScope);
        if (!key) return;
        await subscribe(key);
        setStatus('connecting', '正在同步', '正在读取此工作区的最新数据…');

        try {
            if (localStorage.getItem(dirtyStorageKey(currentScope)) === '1' && (currentScope === 'personal' || roleCanWriteLab())) {
                pendingSave = { payload: adapter.getState(), scope: currentScope };
                await flush();
                if (pendingSave) return;
            }
            const result = await supabase.from('workspace_snapshots').select('payload, revision, updated_at').eq('workspace_key', key).maybeSingle();
            if (result.error) throw result.error;
            if (result.data && result.data.payload) {
                await applyRemote(result.data.payload, currentScope);
                updateAccess();
                return;
            }
            if (currentScope === 'personal' || (roleCanWriteLab() && config.autoInitializeLab)) {
                await persistNow(adapter.getState(), currentScope);
            } else {
                setStatus(roleCanWriteLab() ? 'synced' : 'readonly', roleCanWriteLab() ? 'LAB 待初始化' : 'LAB 只读', roleCanWriteLab() ? '共用空间尚无云端数据；首次保存将建立工作区。' : '共用空间尚无数据，请联系 LAB 管理员初始化。');
            }
        } catch (error) {
            setStatus('error', '同步失败', readableError(error, '读取云端数据失败，本机缓存未受影响。'));
        }
    }

    async function subscribe(key) {
        currentChannel = supabase.channel('workspace:' + key)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'workspace_snapshots',
                filter: 'workspace_key=eq.' + key
            }, function (event) {
                if (event.new && event.new.payload) applyRemote(event.new.payload, currentScope);
            })
            .subscribe();
    }

    async function leaveChannel() {
        if (!supabase || !currentChannel) return;
        const channel = currentChannel;
        currentChannel = null;
        await supabase.removeChannel(channel);
    }

    async function applyRemote(payload, scope) {
        if (!adapter || !adapter.applyState || scope !== currentScope) return;
        applyingRemote = true;
        try {
            adapter.applyState(await hydrateAttachmentUrls(payload), scope);
        } finally {
            applyingRemote = false;
        }
        setStatus(currentScope === 'lab' && !roleCanWriteLab() ? 'readonly' : 'synced', currentScope === 'lab' && !roleCanWriteLab() ? 'LAB 只读' : '已同步', '已收到云端最新数据。');
    }

    function queueState(payload, scope) {
        if (applyingRemote || !supabase || !user) return;
        const normalizedScope = scope === 'lab' ? 'lab' : 'personal';
        if (normalizedScope === 'lab' && !roleCanWriteLab()) return;
        pendingSave = { payload: payload, scope: normalizedScope };
        localStorage.setItem(dirtyStorageKey(normalizedScope), '1');
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(flush, 650);
        setStatus(navigator.onLine ? 'connecting' : 'offline', navigator.onLine ? '保存中' : '等待网络', navigator.onLine ? '正在把修改写入云端…' : '修改已留在本机，恢复网络后会自动重试。');
    }

    async function flush() {
        if (!pendingSave || !navigator.onLine || !supabase || !user) return;
        const next = pendingSave;
        pendingSave = null;
        try {
            await persistNow(next.payload, next.scope);
        } catch (error) {
            pendingSave = next;
            setStatus('error', '待重试', readableError(error, '云端保存失败；本机缓存仍然完整。'));
        }
    }

    async function persistNow(payload, scope) {
        const key = workspaceKey(scope);
        if (!key) return;
        const labScope = scope === 'lab';
        const record = {
            workspace_key: key,
            scope: scope,
            owner_id: labScope ? null : user.id,
            lab_id: labScope ? membership.lab_id : null,
            payload: await prepareAttachmentsForCloud(payload, scope),
            updated_by: user.id
        };
        const result = await supabase.from('workspace_snapshots').upsert(record, { onConflict: 'workspace_key' }).select('revision, updated_at').single();
        if (result.error) throw result.error;
        localStorage.removeItem(dirtyStorageKey(scope));
        setStatus(scope === 'lab' && !roleCanWriteLab() ? 'readonly' : 'synced', scope === 'lab' && !roleCanWriteLab() ? 'LAB 只读' : '已同步', '最新修改已同步到云端。');
    }

    async function prepareAttachmentsForCloud(payload, scope) {
        const copy = JSON.parse(JSON.stringify(payload));
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols'].forEach(function (collection) {
            (copy[collection] || []).forEach(function (item) {
                jobs.push(uploadAttachmentField(item, 'photoData', 'photoPath', scope));
            });
        });
        (copy.freezerBoxes || []).forEach(function (box) {
            jobs.push(uploadAttachmentField(box, 'lastScanPhoto', 'lastScanPhotoPath', scope));
        });
        await Promise.all(jobs);
        return copy;
    }

    async function uploadAttachmentField(record, dataField, pathField, scope) {
        const dataUrl = record && record[dataField];
        if (!dataUrl || !String(dataUrl).startsWith('data:image/')) {
            if (dataUrl && String(dataUrl).startsWith('http')) delete record[dataField];
            return;
        }
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
        const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
        const root = scope === 'lab' ? 'lab/' + membership.lab_id : 'user/' + user.id;
        const path = root + '/' + hash + '.' + extension;
        const upload = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
        if (upload.error) throw upload.error;
        record[pathField] = path;
        delete record[dataField];
    }

    async function hydrateAttachmentUrls(payload) {
        const copy = JSON.parse(JSON.stringify(payload));
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols'].forEach(function (collection) {
            (copy[collection] || []).forEach(function (item) {
                jobs.push(signAttachmentField(item, 'photoPath', 'photoData'));
            });
        });
        (copy.freezerBoxes || []).forEach(function (box) {
            jobs.push(signAttachmentField(box, 'lastScanPhotoPath', 'lastScanPhoto'));
        });
        await Promise.all(jobs);
        return copy;
    }

    async function signAttachmentField(record, pathField, dataField) {
        if (!record || !record[pathField]) return;
        const signed = await supabase.storage.from(ATTACHMENT_BUCKET).createSignedUrl(record[pathField], 60 * 60 * 8);
        if (!signed.error && signed.data) record[dataField] = signed.data.signedUrl;
    }

    function bindUi() {
        if (ui.control) ui.control.addEventListener('click', openDialog);
        document.addEventListener('click', function (event) {
            if (event.target.closest('[data-close-sync]') && ui.dialog && ui.dialog.open) ui.dialog.close();
        });
        if (ui.loginForm) {
            ui.loginForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                if (!configured() || !supabase) {
                    setStatus('local', '仅此设备', '请先在 js/rhine-lab-config.js 填入 Supabase Project URL 与 publishable key。');
                    return;
                }
                const email = String(ui.email.value || '').trim();
                if (!email) return;
                setStatus('connecting', '发送中', '正在发送安全登录链接…');
                const result = await supabase.auth.signInWithOtp({
                    email: email,
                    options: { emailRedirectTo: location.origin + location.pathname }
                });
                if (result.error) {
                    setStatus('error', '发送失败', readableError(result.error, '登录链接发送失败。'));
                    return;
                }
                setStatus('local', '检查邮箱', '登录链接已发送；请在此设备打开邮件完成登录。');
            });
        }
        if (ui.signOut) {
            ui.signOut.addEventListener('click', async function () {
                if (supabase) await supabase.auth.signOut();
                if (ui.dialog && ui.dialog.open) ui.dialog.close();
            });
        }
        window.addEventListener('online', function () {
            updateAccess();
            flush();
        });
        window.addEventListener('offline', updateAccess);
    }

    function openDialog() {
        updateAccountUi();
        if (!configured()) {
            ui.title.textContent = '当前仅保存在这台设备';
            ui.description.textContent = '填写云项目配置并登录后，电脑与手机会使用同一份数据。';
        } else if (user) {
            ui.title.textContent = '设备同步已连接';
            ui.description.textContent = '在其他设备打开同一网址并登录相同邮箱，即可继续工作。';
        } else {
            ui.title.textContent = '登录以启用设备同步';
            ui.description.textContent = '无需设置密码；系统会向邮箱发送一次性登录链接。';
        }
        if (ui.dialog && !ui.dialog.open) ui.dialog.showModal();
    }

    function readableError(error, fallback) {
        return error && error.message ? fallback + '（' + error.message + '）' : fallback;
    }

    window.RhineLabSync = {
        start: start,
        switchScope: switchScope,
        queueState: queueState,
        isConfigured: configured
    };
}());
