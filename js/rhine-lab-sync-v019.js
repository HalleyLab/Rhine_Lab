(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};
    const secure = window.RhineLabCrypto;
    const ATTACHMENT_BUCKET = 'rhine-lab-attachments';
    const NATIVE_AUTH_REDIRECT = 'rhinelab://auth/callback';
    const COLLECTIONS = ['experiments', 'results', 'mice', 'animalRooms', 'animalRacks', 'animalCages', 'plants', 'plantRooms', 'plantRacks', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'bioDatasets', 'bioPipelines', 'bioRuns', 'cellCultures', 'reagents', 'samples', 'freezerBoxes', 'schedule', 'protocols', 'activities', 'lineageLinks', 'plateLayouts'];
    const ui = Object.fromEntries([
        ['control', 'syncControl'], ['label', 'syncStatusLabel'], ['dialog', 'syncDialog'], ['title', 'syncDialogTitle'], ['description', 'syncDialogDescription'],
        ['transferControl', 'localTransferControl'], ['transferDialog', 'portableSyncDialog'],
        ['authModes', 'syncAuthModes'], ['loginForm', 'syncLoginForm'], ['email', 'syncEmail'], ['password', 'syncPassword'],
        ['codeLoginForm', 'syncCodeLoginForm'], ['codeEmail', 'syncCodeEmail'], ['codeSend', 'syncCodeSend'], ['codeOtpForm', 'syncCodeOtpForm'], ['codeOtp', 'syncCodeOtp'],
        ['registrationForm', 'syncRegistrationForm'], ['registrationEmail', 'syncRegistrationEmail'], ['registrationPassword', 'syncRegistrationPassword'], ['registrationStart', 'syncRegistrationStart'],
        ['otpForm', 'syncOtpForm'], ['otp', 'syncOtp'], ['account', 'syncAccount'], ['accountEmail', 'syncAccountEmail'],
        ['transferPassword', 'syncTransferPassword'], ['transferExport', 'syncTransferExport'], ['transferChoose', 'syncTransferChoose'],
        ['transferFile', 'syncTransferFile'], ['transferImport', 'syncTransferImport'], ['transferFileName', 'syncTransferFileName'],
        ['transferMessage', 'syncTransferMessage'],
        ['labWorkspace', 'labWorkspaceSection'], ['membershipList', 'labMembershipList'], ['membershipCount', 'labMembershipCount'],
        ['showLabCreate', 'showLabCreate'], ['showLabJoin', 'showLabJoin'],
        ['labCreateForm', 'labCreateForm'], ['labName', 'labName'], ['labCreatePassword', 'labCreatePassword'],
        ['labJoinForm', 'labJoinForm'], ['labJoinName', 'labJoinName'], ['labJoinPassword', 'labJoinPassword'],
        ['memberDirectory', 'labMemberDirectory'], ['memberList', 'labMemberList'],
        ['memberCount', 'labMemberCount'], ['refreshMembers', 'refreshLabMembers'], ['message', 'syncMessage'], ['signOut', 'syncSignOut'],
        ['entrySaveStatus', 'entrySaveStatus'], ['systemConnection', 'systemConnectionLabel'], ['systemSync', 'systemSyncLabel'], ['systemBadge', 'systemSyncBadge']
    ].map(function (entry) { return [entry[0], document.getElementById(entry[1])]; }));

    let adapter = null;
    let supabase = null;
    let user = null;
    let memberships = [];
    let membership = null;
    let currentScope = 'personal';
    let currentChannel = null;
    let pendingSave = null;
    let saveTimer = 0;
    let applyingRemote = false;
    let started = false;
    let loginEmail = '';
    let codeLoginEmail = '';
    let registrationEmail = '';
    let registrationPassword = '';
    let authMode = 'password';
    let loadedMemberDirectoryFor = '';
    let selectedTransferFile = null;
    let returnToAccountAfterTransfer = false;

    function configured() {
        return /^https:\/\//i.test(String(config.cloudflareApiUrl || ''));
    }

    function vaultUnlocked() {
        return Boolean(user && secure && secure.accountUnlocked(user.id));
    }

    function roleLabel(role) {
        return role === 'owner' ? 'LAB 创建者' : role === 'member' || role === 'manager' ? 'LAB 成员 · 共用区只读' : '仅个人工作区';
    }

    function labName(item) {
        return item && item.labs && item.labs.name ? item.labs.name : 'Rhine Lab';
    }

    function renderMemberships() {
        if (ui.membershipCount) ui.membershipCount.textContent = String(memberships.length);
        if (!ui.membershipList) return;
        ui.membershipList.replaceChildren();
        if (!memberships.length) {
            const empty = document.createElement('p');
            empty.textContent = '尚未加入 LAB。';
            ui.membershipList.appendChild(empty);
            return;
        }
        const none = document.createElement('button');
        none.type = 'button';
        none.className = 'lab-membership-button no-lab' + (!membership ? ' active' : '');
        none.dataset.clearLab = 'true';
        none.setAttribute('aria-pressed', String(!membership));
        const noneName = document.createElement('strong'); noneName.textContent = '不选择 LAB';
        const noneHint = document.createElement('span'); noneHint.textContent = '仅使用个人工作区';
        none.append(noneName, noneHint);
        ui.membershipList.appendChild(none);
        memberships.forEach(function (item) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'lab-membership-button' + (membership && membership.lab_id === item.lab_id ? ' active' : '');
            button.dataset.labId = item.lab_id;
            button.setAttribute('aria-pressed', String(Boolean(membership && membership.lab_id === item.lab_id)));
            const name = document.createElement('strong'); name.textContent = labName(item);
            const role = document.createElement('span'); role.textContent = roleLabel(item.role);
            button.append(name, role);
            ui.membershipList.appendChild(button);
        });
    }

    function showAuthMode(mode) {
        authMode = mode === 'code' || mode === 'register' ? mode : 'password';
        if (ui.authModes) ui.authModes.querySelectorAll('[data-auth-mode]').forEach(function (button) {
            button.setAttribute('aria-selected', String(button.dataset.authMode === authMode));
        });
        updateAccountUi();
    }

    function showLabForm(mode) {
        const createMode = mode === 'create';
        const joinMode = mode === 'join';
        if (ui.labCreateForm) ui.labCreateForm.hidden = !createMode;
        if (ui.labJoinForm) ui.labJoinForm.hidden = !joinMode;
        if (ui.showLabCreate) ui.showLabCreate.setAttribute('aria-selected', String(createMode));
        if (ui.showLabJoin) ui.showLabJoin.setAttribute('aria-selected', String(joinMode));
    }

    async function selectLab(labId) {
        const next = memberships.find(function (item) { return item.lab_id === labId; }) || null;
        if (!next) return;
        if (membership && membership.lab_id === next.lab_id) {
            await clearLabSelection();
            return;
        }
        const changed = !membership || membership.lab_id !== next.lab_id;
        membership = next;
        loadedMemberDirectoryFor = '';
        renderMemberships();
        updateAccess();
        if (changed && currentScope === 'lab' && vaultUnlocked()) {
            await leaveChannel();
            await loadLabWorkspace();
        }
        await loadLabMembers(true);
    }

    async function clearLabSelection() {
        const changed = Boolean(membership);
        membership = null;
        loadedMemberDirectoryFor = '';
        renderMemberships();
        updateAccess();
        if (changed && currentScope === 'lab' && vaultUnlocked()) {
            await leaveChannel();
            await applyRemote(mergePublications([]), 'lab');
        }
    }

    function setStatus(state, label, message) {
        if (ui.control) ui.control.dataset.syncState = state;
        if (ui.label) ui.label.textContent = label;
        if (ui.message) ui.message.textContent = message || '';
        if (ui.entrySaveStatus) ui.entrySaveStatus.textContent = user && vaultUnlocked() ? '保存后将加密同步到已登录设备' : '数据使用设备密钥加密保存在本机';
        if (ui.systemConnection) ui.systemConnection.textContent = user ? (state === 'offline' ? '云端等待中' : '云端已连接') : '本地模式';
        if (ui.systemSync) ui.systemSync.textContent = user ? (state === 'synced' || state === 'readonly' ? '数据已同步' : state === 'offline' ? '修改将在联网后加密上传' : '正在处理加密同步') : '云同步未连接';
        if (ui.systemBadge) ui.systemBadge.textContent = user ? (state === 'synced' || state === 'readonly' ? 'SYNC' : 'WAIT') : 'LOCAL';
    }

    function updateAccountUi() {
        const signedIn = Boolean(user);
        const unlocked = vaultUnlocked();
        const showSignedOutAuth = !signedIn;
        const needsPasswordUnlock = signedIn && !unlocked;
        if (ui.authModes) ui.authModes.hidden = !showSignedOutAuth;
        if (ui.loginForm) ui.loginForm.hidden = !(needsPasswordUnlock || (showSignedOutAuth && authMode === 'password'));
        if (ui.codeLoginForm) ui.codeLoginForm.hidden = !(showSignedOutAuth && authMode === 'code' && !codeLoginEmail);
        if (ui.codeOtpForm) ui.codeOtpForm.hidden = !(showSignedOutAuth && authMode === 'code' && Boolean(codeLoginEmail));
        if (ui.registrationForm) ui.registrationForm.hidden = !(showSignedOutAuth && authMode === 'register' && !registrationEmail);
        if (ui.otpForm) ui.otpForm.hidden = !(showSignedOutAuth && authMode === 'register' && Boolean(registrationEmail));
        if (ui.account) ui.account.hidden = !signedIn;
        if (ui.signOut) ui.signOut.hidden = !signedIn;
        if (ui.accountEmail) ui.accountEmail.textContent = signedIn ? (user.email || '已验证账户') : '—';
        if (signedIn && ui.email && !ui.email.value) ui.email.value = user.email || '';
        if (ui.labWorkspace) ui.labWorkspace.hidden = !(signedIn && unlocked);
        const canViewDirectory = signedIn && unlocked && Boolean(membership);
        if (ui.memberDirectory) ui.memberDirectory.hidden = !canViewDirectory;
        if (!canViewDirectory) loadedMemberDirectoryFor = '';
        if (ui.title) {
            ui.title.textContent = !configured()
                ? '当前使用设备加密存储'
                : signedIn && unlocked
                    ? '同步已连接'
                    : signedIn
                        ? '账户登录'
                        : '登录以同步';
        }
        if (ui.description) {
            const description = !configured()
                ? '配置云项目并登录后，可启用端到端加密的跨设备同步。'
                : signedIn && !unlocked
                    ? '输入账户密码以读取并同步数据。'
                    : '';
            ui.description.textContent = description;
            ui.description.hidden = !description;
        }
        renderMemberships();
    }

    function updateAccess() {
        if (adapter && adapter.setAccess) adapter.setAccess({ authenticated: Boolean(user), readOnly: currentScope === 'lab', role: membership ? membership.role : '', labId: membership ? membership.lab_id : '' });
        if (!user) setStatus('local', '登录 / 同步', configured() ? '' : '云同步未配置；本机缓存仍使用设备密钥加密。');
        else if (!vaultUnlocked()) setStatus('locked', '账户数据已锁定', '请输入账户密码以读取并同步数据。');
        else if (currentScope === 'lab' && !membership) setStatus('warning', '未选择 LAB', '请在同步面板中选择一个 LAB。');
        else if (currentScope === 'lab') setStatus('readonly', 'LAB 只读', '共用页面由成员个人工作区的共享投影组成，任何账户都不能直接修改。');
        else setStatus(navigator.onLine ? 'synced' : 'offline', navigator.onLine ? '已同步' : '等待网络', navigator.onLine ? '' : '修改已加密保存在本机，联网后继续同步。');
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
        if (!url) return;
        if (!supabase || !String(url).startsWith(NATIVE_AUTH_REDIRECT)) return;
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
        if (!window.RhineLabCloudflare || !window.RhineLabCloudflare.createClient) throw new Error('Cloudflare 同步客户端未载入');
        return window.RhineLabCloudflare.createClient(
            config.cloudflareApiUrl.replace(/\/$/, ''),
            secure.encryptedAuthStorage('rhineLabSecureAuth:'),
            String(config.cloudflareFallbackApiUrl || '').replace(/\/$/, '')
        );
    }

    async function start(nextAdapter) {
        if (started) return;
        started = true;
        adapter = nextAdapter;
        currentScope = adapter && adapter.getScope ? adapter.getScope() : 'personal';
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

    async function loadMemberships(preferredLabId) {
        memberships = [];
        membership = null;
        if (!user) return;
        const result = await supabase.from('lab_members').select('lab_id, role, created_at, labs(name)').eq('user_id', user.id).order('created_at', { ascending: true });
        if (result.error) throw result.error;
        memberships = result.data || [];
        membership = preferredLabId
            ? memberships.find(function (item) { return item.lab_id === preferredLabId; }) || null
            : null;
        renderMemberships();
    }

    async function handleSession(session, passphrase) {
        const nextUser = session && session.user ? session.user : null;
        const previousUserId = user && user.id ? user.id : '';
        const nextUserId = nextUser && nextUser.id ? nextUser.id : '';
        const accountChanged = previousUserId !== nextUserId;
        user = nextUser;
        memberships = [];
        membership = null;
        loadedMemberDirectoryFor = '';
        if (accountChanged) {
            secure.lockAccount();
            await leaveChannel();
        }
        if (!user) {
            updateAccess();
            return;
        }
        try {
            await loadMemberships();
            const wasUnlocked = vaultUnlocked();
            if (!wasUnlocked && passphrase) {
                await secure.unlockAccount(user.id, passphrase);
                await secure.rememberAccount(user.id);
            } else if (!wasUnlocked) {
                await secure.restoreAccount(user.id);
            }
            if (vaultUnlocked() && (!wasUnlocked || accountChanged)) await activateVault();
            else updateAccess();
            if (!vaultUnlocked() && ui.dialog && !ui.dialog.open) ui.dialog.showModal();
        } catch (error) {
            setStatus('error', '账户数据无法解锁', readableError(error, '请确认账户密码与首次创建本账户时使用的密码一致。'));
        }
    }

    async function unlockVault(passphrase) {
        await secure.unlockAccount(user.id, passphrase);
        await activateVault();
        await secure.rememberAccount(user.id);
        return true;
    }

    async function activateVault() {
        try {
            const requestedScope = currentScope;
            await loadPersonalForUnlock();
            await switchScope(requestedScope);
            updateAccess();
            try {
                await loadLabMembers(true);
            } catch (directoryError) {
                setStatus('warning', '成员目录暂不可用', readableError(directoryError, '暂时无法读取 LAB 绑定邮箱。'));
            }
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
        const blankWebWorkspace = adapter.isPublicShowcase && adapter.isPublicShowcase() && adapter.getEmptyState;
        const initial = blankWebWorkspace ? adapter.getEmptyState() : local;
        if (adapter.setPersonalState) adapter.setPersonalState(initial);
        await persistPersonal(initial);
        return initial;
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
            setStatus('locked', '缺少 LAB 密钥', '请使用 LAB 名称和密码重新加入。');
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
        setStatus('synced', '已同步', '个人快照和附件已加密上传。');
    }

    async function publishSharedProjection() {
        if (!memberships.length || !adapter.buildSharedProjection) return;
        const projection = adapter.buildSharedProjection();
        for (const item of memberships) {
            const labKey = adapter.getLabKey && adapter.getLabKey(item.lab_id);
            if (!labKey) continue;
            const encrypted = await secure.encryptLab(projection, labKey, item.lab_id);
            const result = await supabase.from('lab_member_publications').upsert({ lab_id: item.lab_id, user_id: user.id, encrypted_payload: encrypted }, { onConflict: 'lab_id,user_id' });
            if (result.error) throw result.error;
        }
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

    async function createLab(name, password) {
        const result = await supabase.rpc('create_lab_with_owner', { lab_name: name || 'Rhine Lab', lab_password: password });
        if (result.error) throw result.error;
        const labId = typeof result.data === 'string' ? result.data : result.data && result.data.lab_id;
        const labKey = await secure.generateLabKey();
        const envelope = await secure.wrapLabKey(labId, password, labKey);
        const configuredLab = await supabase.rpc('set_lab_key_envelope', { target_lab_id: labId, lab_password: password, lab_key_envelope: envelope });
        if (configuredLab.error) throw configuredLab.error;
        const effectiveLabKey = configuredLab.data ? await secure.unwrapLabKey(labId, password, configuredLab.data) : labKey;
        adapter.setLabKey(labId, effectiveLabKey);
        await loadMemberships(labId);
        await persistPersonal(adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState());
        updateAccess();
        await loadLabMembers(true);
    }

    async function joinLab(name, password) {
        const result = await supabase.rpc('join_lab_with_password', { lab_name: name, lab_password: password });
        if (result.error) throw result.error;
        const row = Array.isArray(result.data) ? result.data[0] : result.data;
        const labId = row && row.lab_id;
        if (!labId) throw new Error('服务器未返回 LAB ID');
        const labKey = await secure.unwrapLabKey(labId, password, row.key_envelope);
        adapter.setLabKey(labId, labKey);
        await loadMemberships(labId);
        await persistPersonal(adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState());
        updateAccess();
        await loadLabMembers(true);
    }

    async function loadLabMembers(force) {
        if (!supabase || !membership || !vaultUnlocked() || !ui.memberList) return;
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

    function transferText(value) {
        return window.RhineLabI18n && window.RhineLabI18n.t ? window.RhineLabI18n.t(value) : value;
    }

    function setTransferMessage(message, error) {
        if (!ui.transferMessage) return;
        ui.transferMessage.textContent = transferText(message);
        ui.transferMessage.dataset.state = error ? 'error' : 'ready';
    }

    function blobToDataUrl(blob) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () { resolve(String(reader.result || '')); };
            reader.onerror = function () { reject(reader.error || new Error('无法读取附件')); };
            reader.readAsDataURL(blob);
        });
    }

    async function materializeAttachment(record, field) {
        const value = record && record[field];
        if (!value || !/^(?:blob:|https?:)/i.test(String(value))) return;
        try {
            const response = await fetch(value);
            if (!response.ok) throw new Error('附件读取失败');
            record[field] = await blobToDataUrl(await response.blob());
        } catch (_error) {
            delete record[field];
        }
    }

    async function preparePortableWorkspace() {
        const source = adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState();
        const copy = JSON.parse(JSON.stringify(source || {}));
        delete copy.security;
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols'].forEach(function (name) {
            (copy[name] || []).forEach(function (item) { jobs.push(materializeAttachment(item, 'photoData')); });
        });
        (copy.freezerBoxes || []).forEach(function (item) { jobs.push(materializeAttachment(item, 'lastScanPhoto')); });
        (copy.results || []).forEach(function (result) {
            (result.attachments || []).forEach(function (item) { jobs.push(materializeAttachment(item, 'data')); });
        });
        await Promise.all(jobs);
        return copy;
    }

    function downloadTransferFile(file) {
        const url = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    }

    async function exportPortableWorkspace() {
        const password = String(ui.transferPassword && ui.transferPassword.value || '');
        if (password.length < 10) { setTransferMessage('传输密码至少需要 10 个字符', true); return; }
        setTransferMessage('正在生成加密同步文件…');
        const workspace = await preparePortableWorkspace();
        const payload = await secure.encryptPortable({ workspace: workspace, exportedAt: new Date().toISOString() }, password);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([JSON.stringify(payload)], 'Rhine-Lab-' + stamp + '.rhinelab', { type: 'application/vnd.rhinelab.encrypted+json' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'Rhine Lab', text: transferText('加密工作区同步文件') });
                setTransferMessage('加密同步文件已交给系统分享。');
                return;
            } catch (error) {
                if (error && error.name === 'AbortError') { setTransferMessage('已取消分享。'); return; }
            }
        }
        downloadTransferFile(file);
        setTransferMessage('加密同步文件已下载，可用数据线或其他方式传到另一台设备。');
    }

    async function importPortableWorkspace() {
        const password = String(ui.transferPassword && ui.transferPassword.value || '');
        if (password.length < 10) { setTransferMessage('传输密码至少需要 10 个字符', true); return; }
        if (!selectedTransferFile) { setTransferMessage('请先选择 .rhinelab 同步文件。', true); return; }
        if (selectedTransferFile.size > 200 * 1024 * 1024) { setTransferMessage('同步文件超过 200 MB，无法在当前设备导入。', true); return; }
        setTransferMessage('正在解密并验证同步文件…');
        let unpacked;
        try {
            const packed = JSON.parse(await selectedTransferFile.text());
            unpacked = await secure.decryptPortable(packed, password);
        } catch (_error) {
            throw new Error('同步文件或传输密码不正确');
        }
        if (!unpacked || !unpacked.workspace || typeof unpacked.workspace !== 'object') throw new Error('同步文件缺少工作区数据');
        if (!window.confirm(transferText('导入会替换当前设备的个人工作区。确定继续吗？'))) {
            setTransferMessage('已取消导入。');
            return;
        }
        if (adapter.setPersonalState) adapter.setPersonalState(unpacked.workspace);
        else adapter.applyState(unpacked.workspace, 'personal');
        queueState(unpacked.workspace, 'personal');
        setTransferMessage('导入完成；个人工作区已在本机加密保存。');
        selectedTransferFile = null;
        if (ui.transferFile) ui.transferFile.value = '';
        if (ui.transferFileName) ui.transferFileName.textContent = transferText('尚未选择文件');
        if (ui.transferImport) ui.transferImport.disabled = true;
    }
    function bindUi() {
        if (ui.control) ui.control.addEventListener('click', openDialog);
        if (ui.transferControl) ui.transferControl.addEventListener('click', function () {
            returnToAccountAfterTransfer = Boolean(ui.dialog && ui.dialog.open);
            if (returnToAccountAfterTransfer) ui.dialog.close();
            window.setTimeout(function () {
                if (ui.transferDialog && !ui.transferDialog.open) ui.transferDialog.showModal();
            }, 0);
        });
        if (ui.transferDialog) ui.transferDialog.addEventListener('close', function () {
            if (!returnToAccountAfterTransfer) return;
            returnToAccountAfterTransfer = false;
            window.setTimeout(openDialog, 0);
        });
        document.addEventListener('click', function (event) {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            if (target.closest('[data-close-sync]') && ui.dialog && ui.dialog.open) ui.dialog.close();
            if (target.closest('[data-close-portable-sync]') && ui.transferDialog && ui.transferDialog.open) ui.transferDialog.close();
        });
        if (ui.transferExport) ui.transferExport.addEventListener('click', function () {
            exportPortableWorkspace().catch(function (error) { setTransferMessage(error && error.message ? error.message : '无法导出同步文件。', true); });
        });
        if (ui.transferChoose) ui.transferChoose.addEventListener('click', function () {
            if (ui.transferFile) ui.transferFile.click();
        });
        if (ui.transferFile) ui.transferFile.addEventListener('change', function () {
            selectedTransferFile = ui.transferFile.files && ui.transferFile.files[0] ? ui.transferFile.files[0] : null;
            if (ui.transferFileName) ui.transferFileName.textContent = selectedTransferFile ? selectedTransferFile.name : transferText('尚未选择文件');
            if (ui.transferImport) ui.transferImport.disabled = !selectedTransferFile;
            if (selectedTransferFile) setTransferMessage('同步文件已选择；输入传输密码后导入。');
        });
        if (ui.transferImport) ui.transferImport.addEventListener('click', function () {
            importPortableWorkspace().catch(function (error) {
                setTransferMessage(error && error.message ? error.message : '无法导入同步文件，请检查文件和密码。', true);
            });
        });
        if (ui.authModes) ui.authModes.addEventListener('click', function (event) {
            const button = event.target.closest('[data-auth-mode]');
            if (!button) return;
            loginEmail = '';
            codeLoginEmail = '';
            registrationEmail = '';
            registrationPassword = '';
            showAuthMode(button.dataset.authMode);
        });
        if (ui.loginForm) ui.loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = String(ui.email.value || '').trim();
            const password = String(ui.password.value || '');
            if (!supabase || !email || password.length < 10) return;
            setStatus('connecting', '正在登录', '正在验证邮箱和账户密码…');
            const result = await supabase.auth.signInWithPassword({ email: email, password: password });
            if (result.error) { setStatus('error', '登录失败', readableError(result.error, '邮箱或密码不正确。')); return; }
            loginEmail = '';
            await handleSession(result.data.session, password);
            ui.password.value = '';
        });
        if (ui.codeLoginForm) ui.codeLoginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = String(ui.codeEmail.value || '').trim();
            if (!ui.codeLoginForm.reportValidity() || !supabase || !email) return;
            const submit = event.submitter || ui.codeSend;
            if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
            try {
                setStatus('connecting', '发送中', '正在发送验证码…');
                const result = await supabase.auth.signInWithOtp({ email: email, options: { shouldCreateUser: false } });
                if (result.error) { setStatus('error', '发送失败', readableError(result.error, '验证码发送失败。')); return; }
                codeLoginEmail = email;
                updateAccountUi();
                setStatus('local', '输入验证码', '验证码已发送至邮箱。');
            } catch (error) {
                setStatus('error', '发送失败', readableError(error, '验证码发送失败。'));
            } finally {
                if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
            }
        });
        if (ui.codeOtpForm) ui.codeOtpForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const token = String(ui.codeOtp.value || '').replace(/\s+/g, '');
            const result = await supabase.auth.verifyOtp({ email: codeLoginEmail, token: token, type: 'email' });
            if (result.error) { setStatus('error', '验证失败', readableError(result.error, '验证码无效或已过期。')); return; }
            codeLoginEmail = '';
            ui.codeOtp.value = '';
            await handleSession(result.data.session);
        });
        if (ui.registrationForm) ui.registrationForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = String(ui.registrationEmail.value || '').trim();
            const password = String(ui.registrationPassword.value || '');
            if (!ui.registrationForm.reportValidity() || !supabase || !email || password.length < 10) return;
            setStatus('connecting', '发送中', '正在发送验证码…');
            const result = await supabase.auth.signUp({ email: email, password: password });
            if (result.error) { setStatus('error', '发送失败', readableError(result.error, '验证码发送失败。')); return; }
            if (result.data && result.data.user && Array.isArray(result.data.user.identities) && !result.data.user.identities.length) {
                setStatus('error', '账号已存在', '该邮箱已注册，请使用密码或验证码登录。');
                return;
            }
            registrationEmail = email;
            registrationPassword = password;
            updateAccountUi();
            setStatus('local', '输入验证码', '验证码已发送；验证后将创建账户。');
        });
        if (ui.otpForm) ui.otpForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const token = String(ui.otp.value || '').replace(/\s+/g, '');
            const result = await supabase.auth.verifyOtp({ email: registrationEmail, token: token, type: 'signup' });
            if (result.error) { setStatus('error', '验证失败', readableError(result.error, '验证码无效或已过期。')); return; }
            await handleSession(result.data.session, registrationPassword);
            registrationEmail = '';
            registrationPassword = '';
            ui.otp.value = '';
            ui.registrationPassword.value = '';
            ui.password.value = '';
        });
        if (ui.showLabCreate) ui.showLabCreate.addEventListener('click', function () { showLabForm(ui.labCreateForm && !ui.labCreateForm.hidden ? '' : 'create'); });
        if (ui.showLabJoin) ui.showLabJoin.addEventListener('click', function () { showLabForm(ui.labJoinForm && !ui.labJoinForm.hidden ? '' : 'join'); });
        if (ui.membershipList) ui.membershipList.addEventListener('click', function (event) {
            if (event.target.closest('[data-clear-lab]')) {
                clearLabSelection().catch(function (error) { setStatus('error', '取消失败', readableError(error, '无法取消 LAB 选择。')); });
                return;
            }
            const button = event.target.closest('[data-lab-id]');
            if (button) selectLab(button.dataset.labId).catch(function (error) { setStatus('error', '切换失败', readableError(error, '无法切换 LAB。')); });
        });
        if (ui.labCreateForm) ui.labCreateForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            try {
                await createLab(String(ui.labName.value || '').trim(), String(ui.labCreatePassword.value || ''));
                ui.labCreatePassword.value = '';
                setStatus('synced', 'LAB 已创建', '当前已选择新创建的 LAB。');
            } catch (error) { setStatus('error', '创建失败', readableError(error, '无法创建 LAB。')); }
        });
        if (ui.labJoinForm) ui.labJoinForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            try {
                await joinLab(String(ui.labJoinName.value || '').trim(), String(ui.labJoinPassword.value || ''));
                ui.labJoinPassword.value = '';
                showLabForm('');
                setStatus('synced', '已加入 LAB', '当前 LAB 已切换，共用界面保持只读。');
            } catch (error) {
                setStatus('error', '加入失败', readableError(error, 'LAB 名称或密码不正确。'));
            }
        });
        if (ui.refreshMembers) ui.refreshMembers.addEventListener('click', function () { loadLabMembers(true).catch(function (error) { setStatus('error', '读取失败', error.message); }); });
        if (ui.signOut) ui.signOut.addEventListener('click', async function () {
            const signedOutUserId = user && user.id;
            await secure.forgetAccount(signedOutUserId);
            loginEmail = '';
            codeLoginEmail = '';
            registrationEmail = '';
            registrationPassword = '';
            await supabase.auth.signOut();
            if (ui.dialog && ui.dialog.open) ui.dialog.close();
        });
        window.addEventListener('online', function () { updateAccess(); flush(); });
        window.addEventListener('offline', updateAccess);
    }

    function openDialog() {
        updateAccountUi();
        if (ui.dialog && !ui.dialog.open) ui.dialog.showModal();
    }

    function readableError(error, fallback) {
        const translate = window.RhineLabI18n && window.RhineLabI18n.t ? window.RhineLabI18n.t : function (value) { return value; };
        const message = translate(fallback);
        if (!error || !error.message) return message;
        return message + ' (' + translate(error.message) + ')';
    }

    window.RhineLabSync = { start: start, switchScope: switchScope, queueState: queueState, isConfigured: configured };
}());
