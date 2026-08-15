(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};
    const secure = window.RhineLabCrypto;
    const ATTACHMENT_BUCKET = 'rhine-lab-attachments';
    const NATIVE_AUTH_REDIRECT = 'rhinelab://auth/callback';
    const PENDING_INVITE_KEY = 'rhineLabPendingInvite';
    const COLLECTIONS = ['experiments', 'results', 'mice', 'animalRacks', 'animalCages', 'cellCultures', 'reagents', 'samples', 'freezerBoxes', 'schedule', 'protocols', 'activities'];
    const ui = Object.fromEntries([
        ['control', 'syncControl'], ['label', 'syncStatusLabel'], ['dialog', 'syncDialog'], ['title', 'syncDialogTitle'], ['description', 'syncDialogDescription'],
        ['loginForm', 'syncLoginForm'], ['email', 'syncEmail'], ['otpForm', 'syncOtpForm'], ['otp', 'syncOtp'], ['account', 'syncAccount'],
        ['accountEmail', 'syncAccountEmail'], ['accountRole', 'syncAccountRole'], ['vaultForm', 'syncVaultForm'], ['vaultPassword', 'syncVaultPassword'],
        ['vaultState', 'syncVaultState'], ['labCreate', 'labCreateSection'], ['labCreateForm', 'labCreateForm'], ['labName', 'labName'],
        ['labInvite', 'labInviteSection'], ['labInviteForm', 'labInviteForm'], ['inviteEmail', 'labInviteEmail'], ['inviteResult', 'labInviteResult'],
        ['copyInvite', 'copyLabInvite'], ['emailInvite', 'emailLabInvite'], ['memberDirectory', 'labMemberDirectory'], ['memberList', 'labMemberList'],
        ['memberCount', 'labMemberCount'], ['refreshMembers', 'refreshLabMembers'], ['message', 'syncMessage'], ['signOut', 'syncSignOut'],
        ['entrySaveStatus', 'entrySaveStatus'], ['systemConnection', 'systemConnectionLabel'], ['systemSync', 'systemSyncLabel'], ['systemBadge', 'systemSyncBadge']
    ].map(function (entry) { return [entry[0], document.getElementById(entry[1])]; }));

    let adapter = null;
    let supabase = null;
    let user = null;
    let membership = null;
    let currentScope = 'personal';
    let currentChannel = null;
    let pendingSave = null;
    let saveTimer = 0;
    let applyingRemote = false;
    let started = false;
    let loginEmail = '';
    let loadedMemberDirectoryFor = '';
    let generatedInviteUrl = '';
    let generatedInviteEmail = '';
    let pendingInvite = parseInvite(location.hash);

    function configured() {
        return /^https:\/\/.+\.supabase\.co\/?$/i.test(String(config.supabaseUrl || '')) && String(config.supabasePublishableKey || '').length > 20;
    }

    function parseInvite(hash) {
        const match = String(hash || '').match(/^#lab-invite=([a-f0-9]{64})\.([A-Za-z0-9_-]{40,50})$/i);
        return match ? { token: match[1], key: match[2] } : null;
    }

    function vaultUnlocked() {
        return Boolean(user && secure && secure.accountUnlocked(user.id));
    }

    function roleLabel(role) {
        return role === 'owner' ? 'LAB 创建者' : role === 'member' || role === 'manager' ? 'LAB 成员 · 共用区只读' : '仅个人工作区';
    }

    function setStatus(state, label, message) {
        if (ui.control) ui.control.dataset.syncState = state;
        if (ui.label) ui.label.textContent = label;
        if (ui.message && message) ui.message.textContent = message;
        if (ui.entrySaveStatus) ui.entrySaveStatus.textContent = user && vaultUnlocked() ? '保存后将加密同步到已登录设备' : '数据使用设备密钥加密保存在本机';
        if (ui.systemConnection) ui.systemConnection.textContent = user ? (state === 'offline' ? '云端等待中' : '加密云端已连接') : '加密本地模式';
        if (ui.systemSync) ui.systemSync.textContent = user ? (state === 'synced' || state === 'readonly' ? '端到端加密数据已同步' : state === 'offline' ? '修改将在联网后加密上传' : '正在处理加密同步') : '云同步未连接';
        if (ui.systemBadge) ui.systemBadge.textContent = user ? (state === 'synced' || state === 'readonly' ? 'E2EE' : 'WAIT') : 'LOCAL';
    }

    function updateAccountUi() {
        const signedIn = Boolean(user);
        const unlocked = vaultUnlocked();
        if (ui.loginForm) ui.loginForm.hidden = signedIn;
        if (ui.otpForm) ui.otpForm.hidden = signedIn || !loginEmail;
        if (ui.account) ui.account.hidden = !signedIn;
        if (ui.signOut) ui.signOut.hidden = !signedIn;
        if (ui.accountEmail) ui.accountEmail.textContent = signedIn ? (user.email || '已验证账户') : '—';
        if (ui.accountRole) ui.accountRole.textContent = roleLabel(membership && membership.role);
        if (ui.vaultForm) ui.vaultForm.hidden = !signedIn || unlocked;
        if (ui.vaultState) ui.vaultState.textContent = unlocked ? 'AES‑256‑GCM 已解锁；数据密码仅保留在本次会话内。' : '输入至少 10 位数据密码。首次使用即创建保险库；其他设备需输入同一密码。';
        if (ui.labCreate) ui.labCreate.hidden = !signedIn || !unlocked || Boolean(membership) || Boolean(pendingInvite);
        if (ui.labInvite) ui.labInvite.hidden = !(signedIn && unlocked && membership && membership.role === 'owner');
        const canViewDirectory = signedIn && unlocked && membership && membership.role === 'owner';
        if (ui.memberDirectory) ui.memberDirectory.hidden = !canViewDirectory;
        if (!canViewDirectory) loadedMemberDirectoryFor = '';
    }

    function updateAccess() {
        if (adapter && adapter.setAccess) adapter.setAccess({ authenticated: Boolean(user), readOnly: currentScope === 'lab', role: membership ? membership.role : '', labId: membership ? membership.lab_id : '' });
        if (!user) setStatus('local', '登录 / 同步', configured() ? '登录后可启用端到端加密的跨设备同步。' : '云同步未配置；本机缓存仍使用设备密钥加密。');
        else if (!vaultUnlocked()) setStatus('locked', '保险库已锁定', '登录身份已验证；输入数据密码后才能读取或同步云端内容。');
        else if (currentScope === 'lab' && !membership) setStatus('warning', '尚未加入 LAB', pendingInvite ? '解锁后将验证邀请并加入 LAB。' : '可创建一个 LAB，或通过创建者发送的邀请链接加入。');
        else if (currentScope === 'lab') setStatus('readonly', 'LAB 只读', '共用页面由成员个人工作区的共享投影组成，任何账户都不能直接修改。');
        else setStatus(navigator.onLine ? 'synced' : 'offline', navigator.onLine ? '已加密同步' : '等待网络', navigator.onLine ? '个人数据以 AES‑256‑GCM 加密后同步。' : '修改已加密保存在本机，联网后继续同步。');
        updateAccountUi();
    }

    function workspaceKey() { return user ? 'user:' + user.id : ''; }
    function dirtyStorageKey() { return 'rhineLabSyncDirty:personal'; }
    function isNativeApp() { return Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }
    function isDesktopApp() { return Boolean(window.RhineLabDesktop && window.RhineLabDesktop.onAuthCallback); }
    function authRedirectUrl() { return isNativeApp() || isDesktopApp() ? NATIVE_AUTH_REDIRECT : new URL('.', location.href).href; }

    function authParameters(url) {
        const parsed = new URL(url);
        const values = new URLSearchParams(parsed.search.slice(1));
        new URLSearchParams(parsed.hash.slice(1)).forEach(function (value, key) { if (!values.has(key)) values.set(key, value); });
        return values;
    }

    async function acceptNativeAuthUrl(url) {
        if (!supabase || !url || !String(url).startsWith(NATIVE_AUTH_REDIRECT)) return;
        const values = authParameters(url);
        if (values.get('error_description')) throw new Error(values.get('error_description'));
        if (values.get('code')) {
            const result = await supabase.auth.exchangeCodeForSession(values.get('code'));
            if (result.error) throw result.error;
        }
    }

    async function bindNativeAuthCallback() {
        if (isDesktopApp()) window.RhineLabDesktop.onAuthCallback(function (url) { acceptNativeAuthUrl(url).catch(function (error) { setStatus('error', '登录失败', readableError(error, '无法完成桌面应用登录。')); }); });
        if (!isNativeApp() || !window.Capacitor.Plugins || !window.Capacitor.Plugins.App) return;
        const app = window.Capacitor.Plugins.App;
        await app.addListener('appUrlOpen', function (event) { acceptNativeAuthUrl(event && event.url).catch(function (error) { setStatus('error', '登录失败', readableError(error, '无法完成移动端登录。')); }); });
        const launch = await app.getLaunchUrl();
        if (launch && launch.url) await acceptNativeAuthUrl(launch.url);
    }

    function importClient() {
        if (!window.supabase || !window.supabase.createClient) throw new Error('本地 Supabase 客户端未载入');
        return window.supabase.createClient(config.supabaseUrl.replace(/\/$/, ''), config.supabasePublishableKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce', storageKey: 'rhine-lab-auth-v019', storage: secure.encryptedAuthStorage('rhineLabSecureAuth:') }
        });
    }

    async function start(nextAdapter) {
        if (started) return;
        started = true;
        adapter = nextAdapter;
        currentScope = adapter && adapter.getScope ? adapter.getScope() : 'personal';
        const inviteFromUrl = parseInvite(location.hash);
        pendingInvite = inviteFromUrl || secure.readLocal(PENDING_INVITE_KEY);
        if (inviteFromUrl) await secure.writeLocal(PENDING_INVITE_KEY, inviteFromUrl);
        bindUi();
        updateAccess();
        if (!configured()) return;
        setStatus('connecting', '正在连接', '正在建立加密同步通道…');
        try {
            supabase = importClient();
            supabase.auth.onAuthStateChange(function (_event, session) { window.setTimeout(function () { handleSession(session); }, 0); });
            await bindNativeAuthCallback();
            const result = await supabase.auth.getSession();
            if (result.error) throw result.error;
            await handleSession(result.data.session);
        } catch (error) {
            setStatus('error', '连接失败', readableError(error, '无法连接云端。'));
        }
    }

    async function loadMembership() {
        membership = null;
        if (!user) return;
        const result = await supabase.from('lab_members').select('lab_id, role, created_at, labs(name)').eq('user_id', user.id).order('created_at', { ascending: true }).limit(1).maybeSingle();
        if (result.error) throw result.error;
        membership = result.data || null;
    }

    async function handleSession(session) {
        user = session && session.user ? session.user : null;
        membership = null;
        loadedMemberDirectoryFor = '';
        generatedInviteUrl = '';
        secure.lockAccount();
        await leaveChannel();
        if (!user) {
            updateAccess();
            return;
        }
        try {
            await loadMembership();
            updateAccess();
            if (ui.dialog && !ui.dialog.open) ui.dialog.showModal();
        } catch (error) {
            setStatus('error', '权限检查失败', readableError(error, '无法读取 LAB 权限；请执行 003_secure_lab_sharing.sql。'));
        }
    }

    async function unlockVault(passphrase) {
        await secure.unlockAccount(user.id, passphrase);
        try {
            const requestedScope = currentScope;
            const personal = await loadPersonalForUnlock();
            if (membership && membership.role === 'owner' && !(personal.security && personal.security.labKeys && personal.security.labKeys[membership.lab_id])) {
                personal.security = personal.security || { labKeys: {} };
                personal.security.labKeys = personal.security.labKeys || {};
                personal.security.labKeys[membership.lab_id] = await secure.generateLabKey();
                if (adapter.setPersonalState) adapter.setPersonalState(personal);
                await persistPersonal(personal);
            }
            await acceptPendingInvite();
            await switchScope(requestedScope);
            updateAccess();
            await loadLabMembers(true);
        } catch (error) {
            secure.lockAccount();
            updateAccess();
            throw error;
        }
    }

    async function loadPersonalForUnlock() {
        const local = adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState();
        const dirty = localStorage.getItem(dirtyStorageKey()) === '1';
        const result = await supabase.from('workspace_snapshots').select('payload, revision, updated_at').eq('workspace_key', workspaceKey()).maybeSingle();
        if (result.error) throw result.error;
        if (result.data && result.data.payload) {
            const legacyPlaintext = !secure.isEnvelope(result.data.payload, 'account-workspace');
            const payload = await secure.decryptCloud(result.data.payload);
            if (dirty) {
                await persistPersonal(local);
                return local;
            }
            const hydrated = await hydrateAttachmentUrls(payload);
            if (adapter.setPersonalState) adapter.setPersonalState(hydrated);
            if (legacyPlaintext) await persistPersonal(payload);
            return hydrated;
        }
        await persistPersonal(local);
        return local;
    }

    async function switchScope(scope) {
        currentScope = scope === 'lab' ? 'lab' : 'personal';
        updateAccess();
        await leaveChannel();
        if (!supabase || !user || !vaultUnlocked()) return;
        if (currentScope === 'lab') {
            if (!membership) return;
            await loadLabWorkspace();
            return;
        }
        await subscribePersonal();
        setStatus('connecting', '正在同步', '正在解密个人工作区…');
        try {
            if (localStorage.getItem(dirtyStorageKey()) === '1') await persistPersonal(adapter.getState());
            const result = await supabase.from('workspace_snapshots').select('payload, revision, updated_at').eq('workspace_key', workspaceKey()).maybeSingle();
            if (result.error) throw result.error;
            if (result.data && result.data.payload) {
                const legacyPlaintext = !secure.isEnvelope(result.data.payload, 'account-workspace');
                const payload = await secure.decryptCloud(result.data.payload);
                await applyRemote(await hydrateAttachmentUrls(payload), 'personal');
                if (legacyPlaintext) await persistPersonal(payload);
            } else {
                await persistPersonal(adapter.getState());
            }
        } catch (error) {
            throw new Error(readableError(error, '云端数据无法解密。请确认其他设备使用相同的数据密码。'));
        }
    }

    async function subscribePersonal() {
        currentChannel = supabase.channel('workspace:' + workspaceKey()).on('postgres_changes', { event: '*', schema: 'public', table: 'workspace_snapshots', filter: 'workspace_key=eq.' + workspaceKey() }, function (event) {
            if (!event.new || !event.new.payload || currentScope !== 'personal') return;
            secure.decryptCloud(event.new.payload).then(hydrateAttachmentUrls).then(function (payload) { return applyRemote(payload, 'personal'); }).catch(function () { setStatus('error', '解密失败', '收到的云端数据无法使用当前数据密码解密。'); });
        }).subscribe();
    }

    async function subscribeLab() {
        currentChannel = supabase.channel('lab-publications:' + membership.lab_id).on('postgres_changes', { event: '*', schema: 'public', table: 'lab_member_publications', filter: 'lab_id=eq.' + membership.lab_id }, function () {
            if (currentScope === 'lab') loadLabWorkspace();
        }).subscribe();
    }

    async function leaveChannel() {
        if (!supabase || !currentChannel) return;
        const channel = currentChannel;
        currentChannel = null;
        await supabase.removeChannel(channel);
    }

    async function loadLabWorkspace() {
        const labKey = adapter.getLabKey && adapter.getLabKey(membership.lab_id);
        if (!labKey) {
            setStatus('locked', '缺少 LAB 密钥', '请重新打开创建者发送的邀请链接；链接中的密钥不会保存在服务器。');
            return;
        }
        if (!currentChannel) await subscribeLab();
        const result = await supabase.from('lab_member_publications').select('user_id, encrypted_payload, updated_at').eq('lab_id', membership.lab_id);
        if (result.error) throw result.error;
        const publications = [];
        for (const row of result.data || []) {
            publications.push({ userId: row.user_id, payload: await secure.decryptLab(row.encrypted_payload, labKey, membership.lab_id), updatedAt: row.updated_at });
        }
        await applyRemote(mergePublications(publications), 'lab');
        setStatus('readonly', 'LAB 只读', publications.length ? '已解密 ' + publications.length + ' 位成员主动共享的数据。' : 'LAB 已创建，成员保存个人记录后会显示在这里。');
    }

    function mergePublications(publications) {
        const merged = Object.fromEntries(COLLECTIONS.map(function (key) { return [key, []]; }));
        const keyFor = function (collection, item) {
            if (collection === 'reagents') return item.catalog || item.name;
            if (collection === 'activities') return item.text + '|' + item.time;
            return item.id || item.name || JSON.stringify(item);
        };
        COLLECTIONS.forEach(function (collection) {
            const seen = new Set();
            publications.forEach(function (publication) {
                (publication.payload[collection] || []).forEach(function (record) {
                    const key = keyFor(collection, record);
                    if (seen.has(key)) return;
                    seen.add(key);
                    merged[collection].push(record);
                });
            });
        });
        merged.schedule.sort(function (a, b) { return String(a.date + a.time).localeCompare(String(b.date + b.time)); });
        merged.exampleSeedVersion = 999;
        merged.auditLog = [];
        merged.security = { labKeys: {} };
        return merged;
    }

    async function applyRemote(payload, scope) {
        if (!adapter || !adapter.applyState || scope !== currentScope) return;
        applyingRemote = true;
        try { adapter.applyState(payload, scope); } finally { applyingRemote = false; }
        updateAccess();
    }

    function queueState(payload, scope) {
        if (applyingRemote || !supabase || !user || !vaultUnlocked() || scope === 'lab') return;
        pendingSave = JSON.parse(JSON.stringify(payload));
        localStorage.setItem(dirtyStorageKey(), '1');
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(flush, 650);
        setStatus(navigator.onLine ? 'connecting' : 'offline', navigator.onLine ? '加密保存中' : '等待网络', navigator.onLine ? '正在加密个人快照与附件…' : '修改已使用设备密钥保存在本机。');
    }

    async function flush() {
        if (!pendingSave || !navigator.onLine || !supabase || !user || !vaultUnlocked()) return;
        const payload = pendingSave;
        pendingSave = null;
        try { await persistPersonal(payload); } catch (error) { pendingSave = payload; setStatus('error', '待重试', readableError(error, '加密上传失败，本机数据未受影响。')); }
    }

    async function persistPersonal(payload) {
        const prepared = await prepareAttachmentsForCloud(payload);
        const record = { workspace_key: workspaceKey(), scope: 'personal', owner_id: user.id, lab_id: null, payload: await secure.encryptCloud(prepared), updated_by: user.id };
        const result = await supabase.from('workspace_snapshots').upsert(record, { onConflict: 'workspace_key' }).select('revision, updated_at').single();
        if (result.error) throw result.error;
        localStorage.removeItem(dirtyStorageKey());
        await publishSharedProjection();
        setStatus('synced', '已加密同步', '个人快照和附件已加密上传。');
    }

    async function publishSharedProjection() {
        if (!membership || !adapter.buildSharedProjection) return;
        const labKey = adapter.getLabKey && adapter.getLabKey(membership.lab_id);
        if (!labKey) return;
        const encrypted = await secure.encryptLab(adapter.buildSharedProjection(), labKey, membership.lab_id);
        const result = await supabase.from('lab_member_publications').upsert({ lab_id: membership.lab_id, user_id: user.id, encrypted_payload: encrypted }, { onConflict: 'lab_id,user_id' });
        if (result.error) throw result.error;
    }

    async function prepareAttachmentsForCloud(payload) {
        const copy = JSON.parse(JSON.stringify(payload));
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols'].forEach(function (name) { (copy[name] || []).forEach(function (item) { jobs.push(uploadAttachmentField(item, 'photoData', 'photoPath', 'photoEncryption')); }); });
        (copy.freezerBoxes || []).forEach(function (item) { jobs.push(uploadAttachmentField(item, 'lastScanPhoto', 'lastScanPhotoPath', 'lastScanPhotoEncryption')); });
        (copy.results || []).forEach(function (result) { (result.attachments || []).forEach(function (item) { jobs.push(uploadAttachmentField(item, 'data', 'path', 'encryption')); }); });
        await Promise.all(jobs);
        return copy;
    }

    async function uploadAttachmentField(record, dataField, pathField, encryptionField) {
        const dataUrl = record && record[dataField];
        if (!dataUrl || !String(dataUrl).startsWith('data:')) { if (dataUrl && /^(?:https?|blob):/.test(dataUrl)) delete record[dataField]; return; }
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const bytes = await blob.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hash = Array.from(new Uint8Array(digest), function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
        const encrypted = await secure.encryptBinary(bytes);
        const path = 'user/' + user.id + '/encrypted/' + hash + '.bin';
        const upload = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, new Blob([encrypted.bytes], { type: 'application/octet-stream' }), { upsert: true, contentType: 'application/octet-stream' });
        if (upload.error) throw upload.error;
        record[pathField] = path;
        record[encryptionField] = { v: 1, alg: 'A256GCM', iv: encrypted.iv, type: blob.type || record.type || 'application/octet-stream' };
        delete record[dataField];
    }

    async function hydrateAttachmentUrls(payload) {
        const copy = JSON.parse(JSON.stringify(payload));
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols'].forEach(function (name) { (copy[name] || []).forEach(function (item) { jobs.push(hydrateAttachment(item, 'photoPath', 'photoData', 'photoEncryption')); }); });
        (copy.freezerBoxes || []).forEach(function (item) { jobs.push(hydrateAttachment(item, 'lastScanPhotoPath', 'lastScanPhoto', 'lastScanPhotoEncryption')); });
        (copy.results || []).forEach(function (result) { (result.attachments || []).forEach(function (item) { jobs.push(hydrateAttachment(item, 'path', 'data', 'encryption')); }); });
        await Promise.all(jobs);
        return copy;
    }

    async function hydrateAttachment(record, pathField, dataField, encryptionField) {
        if (!record || !record[pathField]) return;
        const signed = await supabase.storage.from(ATTACHMENT_BUCKET).createSignedUrl(record[pathField], 15 * 60);
        if (signed.error || !signed.data) return;
        const metadata = record[encryptionField];
        if (!metadata || !metadata.iv) { record[dataField] = signed.data.signedUrl; return; }
        const response = await fetch(signed.data.signedUrl);
        const plaintext = await secure.decryptBinary(await response.arrayBuffer(), metadata.iv);
        record[dataField] = URL.createObjectURL(new Blob([plaintext], { type: metadata.type || 'application/octet-stream' }));
    }

    async function createLab(name) {
        const result = await supabase.rpc('create_lab_with_owner', { lab_name: name || 'Rhine Lab' });
        if (result.error) throw result.error;
        const labId = typeof result.data === 'string' ? result.data : result.data && result.data.lab_id;
        const labKey = await secure.generateLabKey();
        adapter.setLabKey(labId, labKey);
        await loadMembership();
        await persistPersonal(adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState());
        updateAccess();
        await loadLabMembers(true);
    }

    async function createInvite(email) {
        const result = await supabase.rpc('create_lab_invite', { target_lab_id: membership.lab_id, target_email: email });
        if (result.error) throw result.error;
        const token = typeof result.data === 'string' ? result.data : result.data && result.data.token;
        const labKey = adapter.getLabKey(membership.lab_id);
        if (!token || !labKey) throw new Error('邀请链接生成失败');
        generatedInviteEmail = email;
        generatedInviteUrl = location.href.split('#')[0] + '#lab-invite=' + token + '.' + labKey;
        if (ui.inviteResult) { ui.inviteResult.hidden = false; ui.inviteResult.querySelector('code').textContent = generatedInviteUrl; }
        if (ui.copyInvite) ui.copyInvite.disabled = false;
        if (ui.emailInvite) ui.emailInvite.disabled = false;
    }

    async function acceptPendingInvite() {
        if (!pendingInvite || membership) return;
        const result = await supabase.rpc('accept_lab_invite', { raw_token: pendingInvite.token });
        if (result.error) throw result.error;
        const labId = typeof result.data === 'string' ? result.data : result.data && result.data.lab_id;
        adapter.setLabKey(labId, pendingInvite.key);
        secure.removeLocal(PENDING_INVITE_KEY);
        pendingInvite = null;
        history.replaceState(null, '', location.pathname + location.search + '#dashboard');
        await loadMembership();
    }

    async function loadLabMembers(force) {
        if (!supabase || !membership || membership.role !== 'owner' || !vaultUnlocked() || !ui.memberList) return;
        if (!force && loadedMemberDirectoryFor === membership.lab_id) return;
        const result = await supabase.rpc('list_lab_member_emails', { target_lab_id: membership.lab_id });
        if (result.error) throw result.error;
        loadedMemberDirectoryFor = membership.lab_id;
        ui.memberList.replaceChildren();
        if (ui.memberCount) ui.memberCount.textContent = String((result.data || []).length);
        (result.data || []).forEach(function (member) {
            const row = document.createElement('article'); row.className = 'lab-member-item';
            const email = document.createElement('strong'); email.textContent = member.email || '—';
            const role = document.createElement('span'); role.textContent = roleLabel(member.role);
            const joined = document.createElement('time'); joined.textContent = member.created_at ? new Date(member.created_at).toLocaleDateString() : '—';
            row.append(email, role, joined); ui.memberList.appendChild(row);
        });
        if (!(result.data || []).length) ui.memberList.textContent = '尚未绑定任何邮箱。';
    }

    function bindUi() {
        if (ui.control) ui.control.addEventListener('click', openDialog);
        document.addEventListener('click', function (event) { if (event.target.closest('[data-close-sync]') && ui.dialog && ui.dialog.open) ui.dialog.close(); });
        if (ui.loginForm) ui.loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = String(ui.email.value || '').trim();
            if (!supabase || !email) return;
            setStatus('connecting', '发送中', '正在发送 PKCE 安全登录链接…');
            const result = await supabase.auth.signInWithOtp({ email: email, options: { emailRedirectTo: authRedirectUrl() } });
            if (result.error) { setStatus('error', '发送失败', readableError(result.error, '登录链接发送失败。')); return; }
            loginEmail = email; updateAccountUi(); setStatus('local', '检查邮箱', '请在发起登录的设备打开邮件，或输入邮件中的 6 位验证码。');
        });
        if (ui.otpForm) ui.otpForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const token = String(ui.otp.value || '').replace(/\s+/g, '');
            const result = await supabase.auth.verifyOtp({ email: loginEmail || ui.email.value.trim(), token: token, type: 'email' });
            if (result.error) setStatus('error', '验证失败', readableError(result.error, '验证码无效或已过期。'));
        });
        if (ui.vaultForm) ui.vaultForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const passphrase = String(ui.vaultPassword.value || '');
            setStatus('connecting', '正在解锁', '正在派生本次会话的加密密钥…');
            try { await unlockVault(passphrase); ui.vaultPassword.value = ''; updateAccountUi(); } catch (error) { setStatus('error', '解锁失败', error.message || '数据密码不正确。'); }
        });
        if (ui.labCreateForm) ui.labCreateForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            try { await createLab(String(ui.labName.value || '').trim()); setStatus('synced', 'LAB 已创建', '现在可以通过邮箱邀请链接添加成员。'); } catch (error) { setStatus('error', '创建失败', readableError(error, '无法创建 LAB。')); }
        });
        if (ui.labInviteForm) ui.labInviteForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            try { await createInvite(String(ui.inviteEmail.value || '').trim()); setStatus('synced', '邀请已生成', '请通过创建者邮箱发送此链接；链接包含 LAB 解密密钥。'); } catch (error) { setStatus('error', '邀请失败', readableError(error, '无法生成邀请。')); }
        });
        if (ui.copyInvite) ui.copyInvite.addEventListener('click', async function () { if (generatedInviteUrl) await navigator.clipboard.writeText(generatedInviteUrl); });
        if (ui.emailInvite) ui.emailInvite.addEventListener('click', function () {
            if (!generatedInviteUrl) return;
            location.href = 'mailto:' + encodeURIComponent(generatedInviteEmail) + '?subject=' + encodeURIComponent('Rhine Lab 邀请') + '&body=' + encodeURIComponent('请使用此链接登录并加入 LAB：\n\n' + generatedInviteUrl + '\n\n请勿转发此链接。');
        });
        if (ui.refreshMembers) ui.refreshMembers.addEventListener('click', function () { loadLabMembers(true).catch(function (error) { setStatus('error', '读取失败', error.message); }); });
        if (ui.signOut) ui.signOut.addEventListener('click', async function () { secure.lockAccount(); await supabase.auth.signOut(); if (ui.dialog && ui.dialog.open) ui.dialog.close(); });
        window.addEventListener('online', function () { updateAccess(); flush(); });
        window.addEventListener('offline', updateAccess);
    }

    function openDialog() {
        updateAccountUi();
        if (!configured()) { ui.title.textContent = '当前使用设备加密存储'; ui.description.textContent = '配置云项目并登录后，可启用端到端加密的跨设备同步。'; }
        else if (user && vaultUnlocked()) { ui.title.textContent = '加密同步已连接'; ui.description.textContent = '云端只保存密文；其他设备需登录并输入相同数据密码。'; }
        else if (user) { ui.title.textContent = '解锁数据保险库'; ui.description.textContent = '身份登录与数据解密分离，服务器不会收到数据密码。'; }
        else { ui.title.textContent = '登录以启用加密同步'; ui.description.textContent = '登录采用 PKCE；登录后还需输入独立的数据密码。'; }
        if (ui.dialog && !ui.dialog.open) ui.dialog.showModal();
    }

    function readableError(error, fallback) { return error && error.message ? fallback + '（' + error.message + '）' : fallback; }

    window.RhineLabSync = { start: start, switchScope: switchScope, queueState: queueState, isConfigured: configured };
}());
