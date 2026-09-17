(function () {
    'use strict';

    const secure = window.RhineLabCrypto;
    const config = window.RHINE_LAB_CONFIG || {};
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
        bluetoothToggle: document.getElementById('bluetoothSyncToggle'),
        transportLabel: document.getElementById('localSyncTransportLabel'),
        addressField: document.getElementById('localSyncAddressField'),
        address: document.getElementById('localSyncAddress'),
        desktopAddresses: document.getElementById('localSyncDesktopAddresses'),
        addressRefresh: document.getElementById('localSyncAddressRefresh'),
        unsupported: document.getElementById('localSyncUnsupported'),
        usbStatus: document.getElementById('usbSyncStatus'),
        entrySaveStatus: document.getElementById('entrySaveStatus'),
        systemConnection: document.getElementById('systemConnectionLabel')
    };

    const USB_SETTINGS_KEY = 'rhineLabUsbSyncSettings';
    const USB_PROTOCOL = 'rhine-lab-local-sync-v1';
    const USB_SNAPSHOT_LIMIT = 28 * 1024 * 1024;
    const WORKSPACE_COLLECTIONS = ['experiments', 'results', 'mice', 'animalRooms', 'animalRacks', 'animalCages', 'plants', 'plantRooms', 'plantRacks', 'microbes', 'microbeIncubators', 'microbeRacks', 'plasmids', 'viruses', 'bioProjects', 'bioDatasets', 'bioPipelines', 'bioRuns', 'cellCultures', 'reagents', 'samples', 'freezerBoxes', 'coldStorageUnits', 'schedule', 'protocols', 'formulations', 'activities', 'lineageLinks', 'plateLayouts'];
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
    let syncGeneration = 0;
    let snapshotVersion = 0;
    let lastSyncStatus = '未启用';

    function text(value) {
        return window.RhineLabI18n && window.RhineLabI18n.t ? window.RhineLabI18n.t(value) : value;
    }

    function assistantDeviceId() {
        const key = 'rhineLabAssistantDeviceV1';
        let value = localStorage.getItem(key);
        if (!value) {
            value = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
            localStorage.setItem(key, value);
        }
        return value;
    }

    async function assistantChat(message, locale) {
        const endpoint = String(config.assistantApiUrl || '').trim();
        const content = String(message || '').trim();
        if (!endpoint) throw new Error('AI service is not configured.');
        if (!content) throw new Error('Message is required.');
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-rhine-device': assistantDeviceId() },
            body: JSON.stringify({ message: content, locale: String(locale || 'zh-CN') })
        });
        const data = await response.json().catch(function () { return {}; });
        if (!response.ok) {
            const error = new Error(data.error || 'AI service is unavailable.');
            error.status = response.status; error.quota = data.quota || null; throw error;
        }
        if (!data.content) throw new Error('AI service returned an empty response.');
        return { content: String(data.content), quota: data.quota || null };
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

    function mobileBridge() {
        const plugins = window.Capacitor && window.Capacitor.Plugins;
        const bridge = plugins && (plugins.RhineLocalSync || plugins.RhineUsbSync);
        return bridge && typeof bridge.exchange === 'function' ? bridge : null;
    }

    function nativeSyncAvailable() {
        return Boolean(desktopBridge() || mobileBridge());
    }

    function isPrivateIpv4(value) {
        const parts = String(value || '').split('.');
        if (parts.length !== 4 || parts.some(function (part) { return !/^(?:0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255; })) return false;
        return Number(parts[0]) === 10 || Number(parts[0]) === 192 && Number(parts[1]) === 168
            || Number(parts[0]) === 169 && Number(parts[1]) === 254
            || Number(parts[0]) === 172 && Number(parts[1]) >= 16 && Number(parts[1]) <= 31;
    }

    function waitingStatus() {
        return usbSettings && usbSettings.transport === 'bluetooth' ? '等待蓝牙 PAN 连接' : '等待 USB 网络共享';
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
        lastSyncStatus = message;
        if (!ui.usbStatus) return;
        ui.usbStatus.textContent = text(message);
        ui.usbStatus.dataset.state = error ? 'error' : 'ready';
    }

    function renderUsbControls() {
        const available = nativeSyncAvailable();
        if (ui.usbPanel) ui.usbPanel.hidden = !available;
        if (ui.unsupported) ui.unsupported.hidden = available;
        if (ui.addressField) ui.addressField.hidden = Boolean(desktopBridge());
        if (ui.addressRefresh) ui.addressRefresh.hidden = !desktopBridge();
        const enabled = Boolean(usbSettings && usbSettings.enabled);
        const bluetooth = enabled && usbSettings.transport === 'bluetooth';
        if (ui.transportLabel) ui.transportLabel.textContent = text(bluetooth ? '蓝牙网络共享（PAN）' : 'USB / 蓝牙同步');
        [[ui.usbToggle, enabled && !bluetooth, '关闭数据线同步', '启用数据线同步'],
            [ui.bluetoothToggle, bluetooth, '关闭蓝牙同步', '启用蓝牙同步']].forEach(function (item) {
            if (!item[0]) return;
            item[0].textContent = text(item[item[1] ? 2 : 3]);
            item[0].classList.toggle('primary', Boolean(item[1]));
            item[0].classList.toggle('ghost', !item[1]);
            item[0].setAttribute('aria-pressed', String(Boolean(item[1])));
        });
        if (!enabled) setUsbStatus('未启用');
        else setUsbStatus(lastSyncStatus, ui.usbStatus && ui.usbStatus.dataset.state === 'error');
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
        usbSettings.transport = usbSettings.transport === 'bluetooth' ? 'bluetooth' : 'usb';
        usbSettings.host = isPrivateIpv4(usbSettings.host) ? usbSettings.host : '';
        if (ui.address) ui.address.value = usbSettings.host;
        if (ui.target) ui.target.value = usbSettings.target;
        if (typeof usbSettings.password !== 'string' || usbSettings.password.length < 10) usbSettings.enabled = false;
        const plugins = window.Capacitor && window.Capacitor.Plugins;
        if (mobileBridge() && (usbSettings.transport === 'bluetooth' || plugins.RhineLocalSync) && !usbSettings.host) usbSettings.enabled = false;
    }

    function blobToDataUrl(blob) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () {
                if (typeof reader.result === 'string' && reader.result.startsWith('data:')) resolve(reader.result);
                else reject(new Error('无法读取附件'));
            };
            reader.onerror = function () { reject(reader.error || new Error('无法读取附件')); };
            reader.onabort = reader.onerror;
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
            const error = new Error('照片或附件无法读取，已停止同步；请重新上传后重试。');
            error.code = 'ATTACHMENT_UNAVAILABLE';
            throw error;
        }
    }

    async function prepareWorkspace() {
        const source = adapter.getPersonalState ? adapter.getPersonalState() : adapter.getState();
        const copy = JSON.parse(JSON.stringify(source || {}));
        delete copy.security;
        const jobs = [];
        ['experiments', 'reagents', 'samples', 'protocols', 'cellCultures'].forEach(function (name) {
            (copy[name] || []).forEach(function (item) { jobs.push(materializeAttachment(item, 'photoData')); });
        });
        (copy.cellCultures || []).forEach(function (culture) {
            (culture.history || []).forEach(function (item) { jobs.push(materializeAttachment(item, 'photoData')); });
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
        ['exampleSeedVersion', 'housingSchemaVersion', 'microbeHousingSchemaVersion', 'coldStorageSchemaVersion'].forEach(function (name) {
            output[name] = Math.max(Number(output[name]) || 0, Number(incoming && incoming[name]) || 0);
        });
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
        const password = usbSettings.password;
        const workspace = await prepareWorkspace();
        const createdAt = new Date().toISOString();
        const hash = await sha256(JSON.stringify(workspace));
        const envelope = await secure.encryptPortable({ workspace: workspace, exportedAt: createdAt, sourceDeviceId: usbSettings.deviceId }, password);
        const snapshot = { protocol: USB_PROTOCOL, deviceId: usbSettings.deviceId, hash: hash, createdAt: createdAt, envelope: envelope };
        if (new Blob([JSON.stringify(snapshot)]).size > USB_SNAPSHOT_LIMIT) throw new Error('数据量过大，请使用同步文件');
        return snapshot;
    }

    async function refreshUsbSnapshot() {
        if (!usbSettings || !usbSettings.enabled) return null;
        if (!usbSnapshotDirty && usbSnapshot) return usbSnapshot;
        if (usbBuildPromise) return usbBuildPromise;
        const generation = syncGeneration;
        const version = snapshotVersion;
        let built = false;
        usbBuildPromise = buildUsbSnapshot().then(async function (snapshot) {
            if (!usbSettings.enabled || generation !== syncGeneration) return null;
            built = true;
            usbSnapshot = snapshot;
            usbSnapshotDirty = version !== snapshotVersion;
            const desktop = desktopBridge();
            if (desktop) {
                const authKey = await sha256('rhine-lab-usb-auth-v1\n' + usbSettings.password);
                if (!usbSettings.enabled || generation !== syncGeneration) return null;
                desktop.updateUsbSyncSnapshot({ authKey: authKey, snapshot: snapshot });
            }
            return snapshot;
        }).catch(function (error) {
            if (generation === syncGeneration) {
                built = false;
                usbSnapshot = null;
                usbSnapshotDirty = true;
                const desktop = desktopBridge();
                if (desktop) desktop.updateUsbSyncSnapshot(null);
            }
            throw error;
        }).finally(function () {
            usbBuildPromise = null;
            if (usbSettings.enabled && (generation !== syncGeneration || built && usbSnapshotDirty)) scheduleUsbSnapshot();
        });
        return usbBuildPromise;
    }

    async function receiveUsbSnapshot(snapshot) {
        if (!usbSettings || !usbSettings.enabled || !isUsbSnapshot(snapshot) || snapshot.deviceId === usbSettings.deviceId) return;
        const previous = usbSettings.peers[snapshot.deviceId];
        if (previous && previous.createdAt >= snapshot.createdAt) return;
        const generation = syncGeneration;
        const unpacked = await secure.decryptPortable(snapshot.envelope, usbSettings.password);
        if (!unpacked || unpacked.sourceDeviceId !== snapshot.deviceId || unpacked.exportedAt !== snapshot.createdAt || !unpacked.workspace) throw new Error('本地同步验证失败');
        if (await sha256(JSON.stringify(unpacked.workspace)) !== snapshot.hash) throw new Error('本地同步验证失败');
        if (!usbSettings.enabled || generation !== syncGeneration) return;
        const target = usbSettings.target;
        const localWorkspace = target === 'personal' ? await prepareWorkspace() : null;
        const localHash = localWorkspace ? await sha256(JSON.stringify(localWorkspace)) : '';
        if (!usbSettings.enabled || generation !== syncGeneration || target !== usbSettings.target) return;
        const shared = adapter.buildSharedProjection ? adapter.buildSharedProjection(unpacked.workspace) : unpacked.workspace;
        const merged = mergeLabWorkspace(adapter.getLabState ? adapter.getLabState() : {}, shared);
        if (adapter.setLabState) await adapter.setLabState(merged);
        else adapter.applyState(merged, 'lab');
        let status = 'LAB 数据已同步';
        if (target === 'personal') {
            const firstPairing = !previous || !previous.localHash || !previous.remoteHash;
            const sharedBaseline = !firstPairing && previous.localHash === previous.remoteHash;
            const canAcceptFirst = firstPairing && workspaceRecordCount(localWorkspace) === 0 && workspaceRecordCount(unpacked.workspace) > 0;
            const remoteOnlyChanged = sharedBaseline && snapshot.hash !== previous.remoteHash && localHash === previous.localHash;
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
            } else if (!sharedBaseline || snapshot.hash !== previous.remoteHash && localHash !== previous.localHash) {
                usbSettings.peers[snapshot.deviceId].createdAt = snapshot.createdAt;
                status = sharedBaseline ? '两端都有修改，已合并到 LAB' : '两端数据不同，已合并到 LAB；个人工作区未覆盖';
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
        const mobile = mobileBridge();
        if (!mobile || usbExchangeBusy || !usbSettings || !usbSettings.enabled) return;
        usbExchangeBusy = true;
        const generation = syncGeneration;
        try {
            const snapshot = await refreshUsbSnapshot();
            if (!snapshot || !usbSettings.enabled || generation !== syncGeneration) return;
            const authKey = await sha256('rhine-lab-usb-auth-v1\n' + usbSettings.password);
            const result = await mobile.exchange({ authKey: authKey, snapshot: snapshot, host: usbSettings.host || '' });
            if (!usbSettings.enabled || generation !== syncGeneration) return;
            if (result && result.snapshot) await receiveUsbSnapshot(result.snapshot);
            else setUsbStatus('已连接，等待电脑端数据');
        } catch (error) {
            if (usbSettings.enabled && generation === syncGeneration) {
                if (error && error.code === 'ATTACHMENT_UNAVAILABLE') setUsbStatus(error.message, true);
                else setUsbStatus(error && /密码|验证|decrypt|OperationError/i.test((error.message || '') + error.name) ? '传输密码不一致' : waitingStatus(), Boolean(error && /密码|验证|decrypt|OperationError/i.test((error.message || '') + error.name)));
            }
        } finally {
            usbExchangeBusy = false;
        }
    }

    async function startUsbSync() {
        if (usbExchangeTimer) window.clearInterval(usbExchangeTimer);
        const generation = ++syncGeneration;
        snapshotVersion += 1;
        usbSnapshotDirty = true;
        setUsbStatus(waitingStatus());
        await refreshUsbSnapshot();
        if (mobileBridge() && usbSettings.enabled && generation === syncGeneration) {
            await exchangeWithDesktop();
            if (usbSettings.enabled && generation === syncGeneration) usbExchangeTimer = window.setInterval(exchangeWithDesktop, 7000);
        }
    }

    async function toggleUsbSync(transport) {
        if (usbSettings && usbSettings.enabled && usbSettings.transport === transport) {
            syncGeneration += 1;
            usbSettings.enabled = false;
            delete usbSettings.password;
            await saveUsbSettings();
            if (usbExchangeTimer) window.clearInterval(usbExchangeTimer);
            usbExchangeTimer = null;
            usbSnapshot = null;
            if (usbRefreshTimer) window.clearTimeout(usbRefreshTimer);
            const desktop = desktopBridge();
            if (desktop) desktop.updateUsbSyncSnapshot(null);
            renderUsbControls();
            setLocalStatus();
            return;
        }
        const password = String(ui.password && ui.password.value || usbSettings && usbSettings.password || '');
        if (password.length < 10) { setMessage('传输密码至少需要 10 个字符', true); return; }
        const host = String(ui.address && ui.address.value || '').trim();
        const plugins = window.Capacitor && window.Capacitor.Plugins;
        if (mobileBridge() && ((transport === 'bluetooth' || plugins.RhineLocalSync) && !host || host && !isPrivateIpv4(host))) {
            setMessage('请输入电脑端显示的蓝牙网络 IPv4 地址', true);
            return;
        }
        usbSettings = usbSettings || { deviceId: randomDeviceId(), peers: {} };
        if (usbSettings.password !== password) usbSettings.peers = {};
        usbSettings.enabled = true;
        usbSettings.password = password;
        usbSettings.transport = transport;
        usbSettings.host = host;
        usbSettings.target = ui.target && ui.target.value === 'lab' ? 'lab' : 'personal';
        await saveUsbSettings();
        setMessage('');
        renderUsbControls();
        await startUsbSync();
    }

    function scheduleUsbSnapshot() {
        snapshotVersion += 1;
        usbSnapshotDirty = true;
        if (!usbSettings || !usbSettings.enabled) return;
        if (usbRefreshTimer) window.clearTimeout(usbRefreshTimer);
        usbRefreshTimer = window.setTimeout(function () {
            refreshUsbSnapshot().catch(function (error) { setUsbStatus(error.message || '无法准备数据线同步', true); });
        }, 800);
    }

    async function configureNativeSync() {
        renderUsbControls();
        if (!nativeSyncAvailable()) return;
        if (secure && secure.prepareLocalStorage) await secure.prepareLocalStorage([USB_SETTINGS_KEY]);
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

    async function showDesktopAddresses() {
        const desktop = desktopBridge();
        if (!desktop || !desktop.getLocalSyncAddresses || !ui.desktopAddresses) return;
        const addresses = await desktop.getLocalSyncAddresses();
        ui.desktopAddresses.textContent = addresses.map(function (item) { return item.name + ': ' + item.address; }).join('\n') || text('未找到本地网络地址，请先连接蓝牙 PAN');
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
        showDesktopAddresses().catch(function () { setUsbStatus('无法读取电脑网络地址', true); });
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
            toggleUsbSync('usb').catch(function (error) { setUsbStatus(error && error.message ? error.message : '无法启用数据线同步', true); });
        });
        if (ui.bluetoothToggle) ui.bluetoothToggle.addEventListener('click', function () {
            toggleUsbSync('bluetooth').catch(function (error) { setUsbStatus(error && error.message ? error.message : '无法启用蓝牙同步', true); });
        });
        if (ui.addressRefresh) ui.addressRefresh.addEventListener('click', function () { showDesktopAddresses().catch(function () { setUsbStatus('无法读取电脑网络地址', true); }); });
        if (ui.address) ui.address.addEventListener('change', function () {
            const host = ui.address.value.trim();
            if (host && !isPrivateIpv4(host)) { setMessage('请输入电脑端显示的蓝牙网络 IPv4 地址', true); return; }
            if (usbSettings && usbSettings.enabled) {
                const plugins = window.Capacitor && window.Capacitor.Plugins;
                if (!host && (usbSettings.transport === 'bluetooth' || plugins && plugins.RhineLocalSync)) { setMessage('请输入电脑端显示的蓝牙网络 IPv4 地址', true); return; }
                usbSettings.host = host;
                saveUsbSettings().then(startUsbSync).catch(function (error) { setUsbStatus(error.message, true); });
            }
        });
        window.addEventListener('rhine:languagechange', renderUsbControls);
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
        assistantChat: assistantChat,
        mergeLabWorkspace: mergeLabWorkspace
    };
}());
