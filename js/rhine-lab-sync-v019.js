(function () {
    'use strict';

    const secure = window.RhineLabCrypto;
    const ui = {
        control: document.getElementById('syncControl'),
        label: document.getElementById('syncStatusLabel'),
        dialog: document.getElementById('portableSyncDialog'),
        password: document.getElementById('syncTransferPassword'),
        exportButton: document.getElementById('syncTransferExport'),
        chooseButton: document.getElementById('syncTransferChoose'),
        file: document.getElementById('syncTransferFile'),
        importButton: document.getElementById('syncTransferImport'),
        target: document.getElementById('syncTransferTarget'),
        fileName: document.getElementById('syncTransferFileName'),
        message: document.getElementById('syncTransferMessage'),
        usbPanel: document.getElementById('usbSyncPanel'),
        usbToggle: document.getElementById('usbSyncToggle'),
        usbStatus: document.getElementById('usbSyncStatus'),
        entrySaveStatus: document.getElementById('entrySaveStatus'),
        systemConnection: document.getElementById('systemConnectionLabel')
    };

    const USB_SETTINGS_KEY = 'rhineLabUsbSyncSettings';
    const USB_PROTOCOL = 'rhine-lab-local-sync-v1';
    const USB_SNAPSHOT_LIMIT = 28 * 1024 * 1024;
    const WORKSPACE_COLLECTIONS = ['experiments', 'results', 'mice', 'animalRooms', 'animalRacks', 'animalCages', 'plants', 'plantRooms', 'plantRacks', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'bioDatasets', 'bioPipelines', 'bioRuns', 'cellCultures', 'reagents', 'samples', 'freezerBoxes', 'schedule', 'protocols', 'formulations', 'activities', 'lineageLinks', 'plateLayouts'];
    let adapter = null;
    let selectedFile = null;
    let started = false;
    let usbSettings = null;
    let usbSnapshot = null;
    let usbSnapshotDirty = true;
    let usbBuildPromise = null;
    let usbExchangeTimer = null;
    let usbExchangeBusy = false;
    let usbRefreshTimer = null;

    function text(value) {
        return window.RhineLabI18n && window.RhineLabI18n.t ? window.RhineLabI18n.t(value) : value;
    }

    function setMessage(message, error) {
        if (!ui.message) return;
        ui.message.textContent = text(message);
        ui.message.dataset.state = error ? 'error' : 'ready';
    }

    function setLocalStatus() {
        if (ui.control) ui.control.dataset.syncState = 'local';
        if (ui.label) ui.label.textContent = text('数据同步');
        if (ui.entrySaveStatus) ui.entrySaveStatus.textContent = text('数据将先保存到本机缓存');
        if (ui.systemConnection) ui.systemConnection.textContent = text('本地模式');
    }

    function desktopBridge() {
        return window.RhineLabDesktop && typeof window.RhineLabDesktop.updateUsbSyncSnapshot === 'function' ? window.RhineLabDesktop : null;
    }

    function androidBridge() {
        const plugins = window.Capacitor && window.Capacitor.Plugins;
        return plugins && plugins.RhineUsbSync && typeof plugins.RhineUsbSync.exchange === 'function' ? plugins.RhineUsbSync : null;
    }

    function nativeSyncAvailable() {
        return Boolean(desktopBridge() || androidBridge());
    }

    function randomDeviceId() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return Array.from(crypto.getRandomValues(new Uint8Array(16)), function (value) { return value.toString(16).padStart(2, '0'); }).join('');
    }

    function bytesToHex(value) {
        return Array.from(new Uint8Array(value), function (item) { return item.toString(16).padStart(2, '0'); }).join('');
    }

    async function sha256(value) {
        return bytesToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
    }

    function setUsbStatus(message, error) {
        if (!ui.usbStatus) return;
        ui.usbStatus.textContent = text(message);
        ui.usbStatus.dataset.state = error ? 'error' : 'ready';
    }

    function renderUsbControls() {
        if (ui.usbPanel) ui.usbPanel.hidden = !nativeSyncAvailable();
        if (!ui.usbToggle) return;
        const enabled = Boolean(usbSettings && usbSettings.enabled);
        ui.usbToggle.textContent = text(enabled ? '关闭数据线同步' : '启用数据线同步');
        ui.usbToggle.classList.toggle('primary', enabled);
        ui.usbToggle.classList.toggle('ghost', !enabled);
        if (!enabled) setUsbStatus('未启用');
    }

    async function saveUsbSettings() {
        if (secure && secure.writeLocal) await secure.writeLocal(USB_SETTINGS_KEY, usbSettings);
    }

    function loadUsbSettings() {
        const stored = secure && secure.readLocal ? secure.readLocal(USB_SETTINGS_KEY) : null;
        usbSettings = stored && typeof stored === 'object' ? stored : { enabled: false, deviceId: randomDeviceId(), peers: {} };
        usbSettings.deviceId = usbSettings.deviceId || randomDeviceId();
        usbSettings.peers = usbSettings.peers && typeof usbSettings.peers === 'object' ? usbSettings.peers : {};
        usbSettings.target = usbSettings.target === 'lab' ? 'lab' : 'personal';
        if (ui.target) ui.target.value = usbSettings.target;
        if (typeof usbSettings.password !== 'string' || usbSettings.password.length < 10) usbSettings.enabled = false;
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

    async function prepareWorkspace() {
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

    function download(file) {
        const url = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    }

    async function exportWorkspace() {
        const password = String(ui.password && ui.password.value || '');
        if (password.length < 10) { setMessage('传输密码至少需要 10 个字符', true); return; }
        setMessage('正在生成同步文件…');
        const payload = await secure.encryptPortable({ workspace: await prepareWorkspace(), exportedAt: new Date().toISOString() }, password);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([JSON.stringify(payload)], 'Rhine-Lab-' + stamp + '.rhinelab', { type: 'application/vnd.rhinelab.encrypted+json' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'Rhine Lab', text: text('工作区同步文件') });
                setMessage('同步文件已交给系统分享。');
                return;
            } catch (error) {
                if (error && error.name === 'AbortError') { setMessage('已取消分享。'); return; }
            }
        }
        download(file);
        setMessage('');
    }

    function recordKey(record) {
        if (!record || typeof record !== 'object') return '';
        return String(record.id || record.catalog || record.experimentId || record.text || '');
    }

    function mergeRecords(current, incoming) {
        const output = JSON.parse(JSON.stringify(Array.isArray(current) ? current : []));
        const positions = new Map();
        output.forEach(function (record, index) {
            const key = recordKey(record);
            if (key) positions.set(key, index);
        });
        (Array.isArray(incoming) ? incoming : []).forEach(function (record) {
            const key = recordKey(record);
            if (key && positions.has(key)) output[positions.get(key)] = record;
            else {
                if (key) positions.set(key, output.length);
                output.push(record);
            }
        });
        return output;
    }

    function mergeLabWorkspace(current, incoming) {
        const output = JSON.parse(JSON.stringify(current || {}));
        WORKSPACE_COLLECTIONS.forEach(function (name) { output[name] = mergeRecords(output[name], incoming && incoming[name]); });
        output.exampleSeedVersion = Math.max(Number(output.exampleSeedVersion) || 0, Number(incoming && incoming.exampleSeedVersion) || 0);
        output.housingSchemaVersion = Math.max(Number(output.housingSchemaVersion) || 0, Number(incoming && incoming.housingSchemaVersion) || 0);
        return output;
    }

    function workspaceRecordCount(workspace) {
        return WORKSPACE_COLLECTIONS.reduce(function (total, name) { return total + (Array.isArray(workspace && workspace[name]) ? workspace[name].length : 0); }, 0);
    }

    function isUsbSnapshot(value) {
        return Boolean(value
            && value.protocol === USB_PROTOCOL
            && typeof value.deviceId === 'string'
            && value.deviceId.length >= 8
            && typeof value.hash === 'string'
            && /^[a-f0-9]{64}$/.test(value.hash)
            && typeof value.createdAt === 'string'
            && value.envelope
            && value.envelope.format === 'rhine-lab-transfer');
    }

    async function buildUsbSnapshot() {
        const workspace = await prepareWorkspace();
        const createdAt = new Date().toISOString();
        const hash = await sha256(JSON.stringify(workspace));
        const envelope = await secure.encryptPortable({ workspace: workspace, exportedAt: createdAt, sourceDeviceId: usbSettings.deviceId }, usbSettings.password);
        const snapshot = { protocol: USB_PROTOCOL, deviceId: usbSettings.deviceId, hash: hash, createdAt: createdAt, envelope: envelope };
        if (new Blob([JSON.stringify(snapshot)]).size > USB_SNAPSHOT_LIMIT) throw new Error('数据量过大，请使用同步文件');
        return snapshot;
    }

    async function refreshUsbSnapshot() {
        if (!usbSettings || !usbSettings.enabled) return null;
        if (!usbSnapshotDirty && usbSnapshot) return usbSnapshot;
        if (usbBuildPromise) return usbBuildPromise;
        usbBuildPromise = buildUsbSnapshot().then(async function (snapshot) {
            usbSnapshot = snapshot;
            usbSnapshotDirty = false;
            const desktop = desktopBridge();
            if (desktop) desktop.updateUsbSyncSnapshot({ authKey: await sha256('rhine-lab-usb-auth-v1\n' + usbSettings.password), snapshot: snapshot });
            return snapshot;
        }).finally(function () { usbBuildPromise = null; });
        return usbBuildPromise;
    }

    async function receiveUsbSnapshot(snapshot) {
        if (!usbSettings || !usbSettings.enabled || !isUsbSnapshot(snapshot) || snapshot.deviceId === usbSettings.deviceId) return;
        const previous = usbSettings.peers[snapshot.deviceId];
        if (previous && previous.createdAt >= snapshot.createdAt) return;
        const unpacked = await secure.decryptPortable(snapshot.envelope, usbSettings.password);
        if (!unpacked || unpacked.sourceDeviceId !== snapshot.deviceId || unpacked.exportedAt !== snapshot.createdAt || !unpacked.workspace) throw new Error('数据线同步验证失败');
        if (await sha256(JSON.stringify(unpacked.workspace)) !== snapshot.hash) throw new Error('数据线同步验证失败');
        const shared = adapter.buildSharedProjection ? adapter.buildSharedProjection(unpacked.workspace) : unpacked.workspace;
        const merged = mergeLabWorkspace(adapter.getLabState ? adapter.getLabState() : {}, shared);
        if (adapter.setLabState) await adapter.setLabState(merged);
        else adapter.applyState(merged, 'lab');
        let status = 'LAB 数据已同步';
        if (usbSettings.target === 'personal') {
            const localWorkspace = await prepareWorkspace();
            const localHash = await sha256(JSON.stringify(localWorkspace));
            const firstPairing = !previous || !previous.localHash || !previous.remoteHash;
            const canAcceptFirst = firstPairing && workspaceRecordCount(localWorkspace) === 0 && workspaceRecordCount(unpacked.workspace) > 0;
            const remoteOnlyChanged = !firstPairing && snapshot.hash !== previous.remoteHash && localHash === previous.localHash;
            if (snapshot.hash === localHash) {
                usbSettings.peers[snapshot.deviceId] = { localHash: localHash, remoteHash: snapshot.hash, createdAt: snapshot.createdAt };
                status = '个人数据已同步';
            } else if (canAcceptFirst || remoteOnlyChanged) {
                if (adapter.setPersonalState) await adapter.setPersonalState(unpacked.workspace);
                else adapter.applyState(unpacked.workspace, 'personal');
                usbSettings.peers[snapshot.deviceId] = { localHash: snapshot.hash, remoteHash: snapshot.hash, createdAt: snapshot.createdAt };
                usbSnapshotDirty = true;
                scheduleUsbSnapshot();
                status = '个人数据已同步';
            } else if (firstPairing) {
                usbSettings.peers[snapshot.deviceId] = { localHash: localHash, remoteHash: snapshot.hash, createdAt: snapshot.createdAt };
                status = '已建立同步基线；现有记录已合并到 LAB';
            } else if (snapshot.hash !== previous.remoteHash && localHash !== previous.localHash) {
                usbSettings.peers[snapshot.deviceId].createdAt = snapshot.createdAt;
                status = '两端都有修改，已合并到 LAB';
            }
        } else {
            usbSettings.peers[snapshot.deviceId] = { remoteHash: snapshot.hash, createdAt: snapshot.createdAt };
        }
        usbSettings.lastConnectedAt = new Date().toISOString();
        await saveUsbSettings();
        setUsbStatus(status);
        if (ui.label) ui.label.textContent = text('数据同步');
    }

    async function exchangeWithDesktop() {
        const android = androidBridge();
        if (!android || usbExchangeBusy || !usbSettings || !usbSettings.enabled) return;
        usbExchangeBusy = true;
        try {
            const snapshot = await refreshUsbSnapshot();
            const authKey = await sha256('rhine-lab-usb-auth-v1\n' + usbSettings.password);
            const result = await android.exchange({ authKey: authKey, snapshot: snapshot });
            if (result && result.snapshot) await receiveUsbSnapshot(result.snapshot);
            else setUsbStatus('已连接，等待电脑端数据');
        } catch (error) {
            setUsbStatus(error && /密码|验证/.test(error.message || '') ? '传输密码不一致' : '等待 USB 网络共享', Boolean(error && /密码|验证/.test(error.message || '')));
        } finally {
            usbExchangeBusy = false;
        }
    }

    async function startUsbSync() {
        if (usbExchangeTimer) window.clearInterval(usbExchangeTimer);
        usbSnapshotDirty = true;
        setUsbStatus('等待 USB 网络共享');
        await refreshUsbSnapshot();
        if (androidBridge()) {
            await exchangeWithDesktop();
            usbExchangeTimer = window.setInterval(exchangeWithDesktop, 7000);
        }
    }

    async function toggleUsbSync() {
        if (usbSettings && usbSettings.enabled) {
            usbSettings.enabled = false;
            delete usbSettings.password;
            await saveUsbSettings();
            if (usbExchangeTimer) window.clearInterval(usbExchangeTimer);
            usbExchangeTimer = null;
            usbSnapshot = null;
            const desktop = desktopBridge();
            if (desktop) desktop.updateUsbSyncSnapshot(null);
            renderUsbControls();
            setLocalStatus();
            return;
        }
        const password = String(ui.password && ui.password.value || '');
        if (password.length < 10) { setMessage('传输密码至少需要 10 个字符', true); return; }
        usbSettings = usbSettings || { deviceId: randomDeviceId(), peers: {} };
        usbSettings.enabled = true;
        usbSettings.password = password;
        usbSettings.target = ui.target && ui.target.value === 'lab' ? 'lab' : 'personal';
        usbSettings.peers = {};
        await saveUsbSettings();
        renderUsbControls();
        await startUsbSync();
    }

    function scheduleUsbSnapshot() {
        usbSnapshotDirty = true;
        if (!usbSettings || !usbSettings.enabled) return;
        if (usbRefreshTimer) window.clearTimeout(usbRefreshTimer);
        usbRefreshTimer = window.setTimeout(function () {
            refreshUsbSnapshot().catch(function (error) { setUsbStatus(error.message || '无法准备数据线同步', true); });
        }, 800);
    }

    async function configureNativeSync() {
        if (!nativeSyncAvailable()) return;
        loadUsbSettings();
        renderUsbControls();
        const desktop = desktopBridge();
        if (desktop && typeof desktop.onUsbSyncRemote === 'function') {
            desktop.onUsbSyncRemote(function (snapshot) {
                receiveUsbSnapshot(snapshot).catch(function (error) { setUsbStatus(error && error.message ? error.message : '数据线同步失败', true); });
            });
        }
        if (usbSettings.enabled) await startUsbSync();
    }

    function updateImportButton() {
        if (!ui.importButton) return;
        ui.importButton.textContent = text(ui.target && ui.target.value === 'lab' ? '合并到 LAB 共用界面' : '导入并替换');
    }

    function updateSyncTarget() {
        updateImportButton();
        if (!usbSettings || !usbSettings.enabled) return;
        usbSettings.target = ui.target && ui.target.value === 'lab' ? 'lab' : 'personal';
        usbSettings.peers = {};
        saveUsbSettings().catch(function () {});
    }

    async function importWorkspace() {
        const password = String(ui.password && ui.password.value || '');
        if (password.length < 10) { setMessage('传输密码至少需要 10 个字符', true); return; }
        if (!selectedFile) { setMessage('请先选择 .rhinelab 同步文件。', true); return; }
        if (selectedFile.size > 200 * 1024 * 1024) { setMessage('同步文件超过 200 MB，无法在当前设备导入。', true); return; }
        setMessage('正在解密并验证同步文件…');
        let unpacked;
        try {
            unpacked = await secure.decryptPortable(JSON.parse(await selectedFile.text()), password);
        } catch (_error) {
            throw new Error('同步文件或传输密码不正确');
        }
        if (!unpacked || !unpacked.workspace || typeof unpacked.workspace !== 'object') throw new Error('同步文件缺少工作区数据');
        const target = ui.target && ui.target.value === 'lab' ? 'lab' : 'personal';
        if (target === 'lab') {
            if (!window.confirm(text('导入内容会合并到本机 LAB 共用界面。确定继续吗？'))) { setMessage('已取消导入。'); return; }
            const shared = adapter.buildSharedProjection ? adapter.buildSharedProjection(unpacked.workspace) : unpacked.workspace;
            const merged = mergeLabWorkspace(adapter.getLabState ? adapter.getLabState() : {}, shared);
            if (adapter.setLabState) await adapter.setLabState(merged);
            else adapter.applyState(merged, 'lab');
            if (adapter.selectScope) adapter.selectScope('lab');
            setMessage('已合并到 LAB 共用界面。');
        } else {
            if (!window.confirm(text('导入会替换当前设备的个人工作区。确定继续吗？'))) { setMessage('已取消导入。'); return; }
            if (adapter.setPersonalState) await adapter.setPersonalState(unpacked.workspace);
            else adapter.applyState(unpacked.workspace, 'personal');
            if (adapter.selectScope) adapter.selectScope('personal');
            setMessage('导入完成。');
        }
        selectedFile = null;
        if (ui.file) ui.file.value = '';
        if (ui.fileName) ui.fileName.textContent = text('尚未选择文件');
        if (ui.importButton) ui.importButton.disabled = true;
    }

    function openDialog() {
        if (ui.dialog && !ui.dialog.open) ui.dialog.showModal();
    }

    function bindUi() {
        if (ui.control) ui.control.addEventListener('click', openDialog);
        document.addEventListener('click', function (event) {
            if (event.target.closest('[data-close-portable-sync]') && ui.dialog && ui.dialog.open) ui.dialog.close();
        });
        if (ui.exportButton) ui.exportButton.addEventListener('click', function () {
            exportWorkspace().catch(function (error) { setMessage(error && error.message ? error.message : '无法导出同步文件。', true); });
        });
        if (ui.chooseButton) ui.chooseButton.addEventListener('click', function () { if (ui.file) ui.file.click(); });
        if (ui.target) ui.target.addEventListener('change', updateSyncTarget);
        if (ui.file) ui.file.addEventListener('change', function () {
            selectedFile = ui.file.files && ui.file.files[0] ? ui.file.files[0] : null;
            if (ui.fileName) ui.fileName.textContent = selectedFile ? selectedFile.name : text('尚未选择文件');
            if (ui.importButton) ui.importButton.disabled = !selectedFile;
            if (selectedFile) setMessage('同步文件已选择；输入传输密码后导入。');
        });
        if (ui.importButton) ui.importButton.addEventListener('click', function () {
            importWorkspace().catch(function (error) { setMessage(error && error.message ? error.message : '无法导入同步文件，请检查文件和密码。', true); });
        });
        if (ui.usbToggle) ui.usbToggle.addEventListener('click', function () {
            toggleUsbSync().catch(function (error) { setUsbStatus(error && error.message ? error.message : '无法启用数据线同步', true); });
        });
        window.addEventListener('rhine:languagechange', setLocalStatus);
        window.addEventListener('rhine:languagechange', updateImportButton);
        updateImportButton();
    }

    function start(nextAdapter) {
        adapter = nextAdapter;
        if (started) return;
        started = true;
        bindUi();
        if (adapter && adapter.setAccess) adapter.setAccess({ authenticated: true, readOnly: false, role: '', labId: '' });
        setLocalStatus();
        configureNativeSync().catch(function (error) { setUsbStatus(error && error.message ? error.message : '无法启用数据线同步', true); });
    }

    window.RhineLabSync = {
        start: start,
        switchScope: function () { return Promise.resolve(); },
        queueState: function (_state, scope) { if (scope === 'personal') scheduleUsbSnapshot(); },
        isConfigured: function () { return Boolean(usbSettings && usbSettings.enabled); },
        mergeLabWorkspace: mergeLabWorkspace
    };
}());
