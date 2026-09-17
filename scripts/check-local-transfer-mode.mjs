import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { createHash, randomBytes, webcrypto } from 'node:crypto';
import { networkInterfaces } from 'node:os';
import dgram from 'node:dgram';
import https from 'node:https';
import { once } from 'node:events';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const sync = read('js/rhine-lab-sync-v019.js');
const main = read('js/rhine-lab.js');
const worker = read('sw.js');
const androidPlugin = read('android/app/src/main/java/com/halleylab/rhinelab/RhineUsbSyncPlugin.java');
const androidManifest = read('android/app/src/main/AndroidManifest.xml');
const require = createRequire(import.meta.url);
const usbBridge = require('../desktop/usb-sync.cjs');

assert.match(html, /id="portableSyncDialog"/);
assert.match(html, /id="workspaceModeToggle"/);
assert.match(html, /id="syncTransferTarget"/);
assert.match(html, /id="usbSyncPanel"/);
assert.match(html, />⇌</);
assert.doesNotMatch(html, /id="syncDialog"|id="syncLoginForm"|id="labWorkspaceSection"|AES‑256‑GCM|同步文件可导入个人工作区，也可合并到 LAB 共用界面|数据保存在本机/);
assert.doesNotMatch(html, /rhine-lab-cloudflare-client/);
assert.match(sync, /encryptPortable/);
assert.match(sync, /decryptPortable/);
assert.match(sync, /navigator\.share/);
assert.doesNotMatch(sync, /signInWithPassword|signInWithOtp|createLab|joinLab|lab_members/);
assert.match(main, /let workspaceMode = localStorage\.getItem\('rhineLabWorkspaceMode'\) === 'lab'/);
assert.doesNotMatch(main, /LAB 日程可见性/);
assert.match(worker, /rhine-lab-sync-v019\.js\?v=0\.3\.3/);
assert.match(worker, /rhine-lab-bootstrap\.js\?v=0\.3\.3/);
assert.match(html, /https:\/\/api\.github\.com/);
assert.match(html, /href="https:\/\/github\.com\/HalleyLab\/Rhine_Lab\/releases\/latest"/);
assert.match(main, /function resolveLatestDesktopDownload\(\)/);
assert.match(main, /-Windows-Setup\\\.exe\$\/i/);
assert.match(androidPlugin, /HttpsURLConnection/);
assert.match(androidPlugin, /fingerprint\.equals/);
assert.doesNotMatch(androidManifest, /usesCleartextTraffic="true"/);
assert.equal(usbBridge.isPrivateAddress('192.168.42.1'), true);
assert.equal(usbBridge.isPrivateAddress('8.8.8.8'), false);
assert.equal(usbBridge.requestSignature('11'.repeat(32), '1700000000000', '22'.repeat(16), Buffer.from('{}')).length, 64);

const sandbox = {
    window: { RhineLabCrypto: {} },
    document: { getElementById: () => null, addEventListener: () => {} },
    navigator: {}, URL, console, setTimeout
};
vm.runInNewContext(sync, sandbox);
const merged = sandbox.window.RhineLabSync.mergeLabWorkspace(
    { reagents: [{ id: 'R1', stock: 2 }], samples: [] },
    { reagents: [{ id: 'R1', stock: 4 }, { id: 'R2', stock: 1 }], samples: [{ id: 'S1' }] }
);
assert.deepEqual(JSON.parse(JSON.stringify(merged.reagents)), [{ id: 'R1', stock: 4 }, { id: 'R2', stock: 1 }]);
assert.deepEqual(JSON.parse(JSON.stringify(merged.samples)), [{ id: 'S1' }]);

const structures = { coldStorageUnits: [{ id: 'F1' }], microbeIncubators: [{ id: 'I1' }], microbeRacks: [{ id: 'M1' }] };
for (const [name, records] of Object.entries(structures)) assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.RhineLabSync.mergeLabWorkspace({}, structures)[name])), records);
assert.equal(sandbox.window.RhineLabSync.mergeLabWorkspace({}, { coldStorageSchemaVersion: 2 }).coldStorageSchemaVersion, 2);
assert.equal(sandbox.window.RhineLabSync.mergeLabWorkspace({ microbeHousingSchemaVersion: 1 }, { microbeHousingSchemaVersion: 0 }).microbeHousingSchemaVersion, 1);

// Drive the real UI handler and portable encryption, with only native I/O substituted.
function app(platform = 'android', settings = null) {
    const elements = new Map();
    const element = id => {
        if (!elements.has(id)) elements.set(id, { value: '', textContent: '', hidden: false, dataset: {}, handlers: {}, classList: { toggle() {} }, setAttribute() {}, addEventListener(name, handler) { this.handlers[name] = handler; } });
        return elements.get(id);
    };
    const timers = new Map();
    const calls = [];
    const updates = [];
    let stored = settings, loaded = false, personal = {}, lab = {}, remote = null, pending = null, listener, poll;
    const context = {
        window: { crypto: webcrypto, addEventListener() {}, setTimeout(fn) { const id = {}; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); }, setInterval(fn) { poll = fn; const id = {}; timers.set(id, fn); return id; }, clearInterval(id) { timers.delete(id); } },
        document: { getElementById: element, addEventListener() {} },
        navigator: {}, crypto: webcrypto, TextEncoder, TextDecoder, Uint8Array, Blob, btoa, atob, URL, console
    };
    vm.runInNewContext(read('js/rhine-lab-crypto.js'), context);
    const encryption = context.window.RhineLabCrypto;
    context.window.RhineLabCrypto = { ...encryption,
        async prepareLocalStorage(keys) { assert.deepEqual(Array.from(keys), ['rhineLabUsbSyncSettings']); loaded = true; },
        readLocal() { assert.equal(loaded, true, 'Settings must be decrypted before reading'); return stored; },
        async writeLocal(_key, value) { stored = structuredClone(value); }
    };
    const bridge = { async exchange(value) { calls.push(value); return pending ? pending : { snapshot: remote }; } };
    if (platform === 'desktop') context.window.RhineLabDesktop = { updateUsbSyncSnapshot(value) { updates.push(value); }, onUsbSyncRemote(fn) { listener = fn; } };
    else if (platform !== 'web') context.window.Capacitor = { Plugins: platform === 'ios' ? { RhineLocalSync: bridge } : { RhineUsbSync: bridge } };
    vm.runInNewContext(sync, context);
    context.window.RhineLabSync.start({ getPersonalState: () => personal, getLabState: () => lab,
        async setPersonalState(value) { personal = value; }, async setLabState(value) { lab = value; } });
    return { element, calls, updates, timers, encryption, api: context.window.RhineLabSync,
        get stored() { return stored; }, get personal() { return personal; }, get lab() { return lab; },
        set personal(value) { personal = value; }, set remote(value) { remote = value; }, set pending(value) { pending = value; },
        set fetch(value) { context.fetch = value; }, set fileReader(value) { context.FileReader = value; },
        receive(value) { listener(value); }, async poll() { assert.equal(typeof poll, 'function'); await poll(); } };
}
const flush = async () => { await new Promise(resolve => setImmediate(resolve)); };
const wait = async condition => { for (let attempts = 0; !condition(); attempts++) { assert.ok(attempts < 600, 'Sync action did not finish'); await new Promise(resolve => setTimeout(resolve, 10)); } };
const password = 'Bluetooth-test-password';
const phone = app();
await flush();
assert.equal(phone.element('usbSyncPanel').hidden, false);
phone.element('syncTransferPassword').value = password;
phone.element('bluetoothSyncToggle').handlers.click();
await flush();
assert.match(phone.element('syncTransferMessage').textContent, /IPv4/);
assert.equal(phone.api.isConfigured(), false);
for (const invalid of ['8.8.8.8', '192.168.1.999', '10.0.0.1/example', 'localhost', '192.168..1', '010.0.0.1', '192.168.044.2']) {
    phone.element('localSyncAddress').value = invalid;
    phone.element('bluetoothSyncToggle').handlers.click();
    await flush();
    assert.equal(phone.api.isConfigured(), false);
}
phone.element('localSyncAddress').value = '192.168.44.2';
phone.element('bluetoothSyncToggle').handlers.click();
await wait(() => phone.calls.length === 1 && phone.timers.size === 1);
assert.equal(phone.stored.transport, 'bluetooth');
assert.equal(phone.calls[0].host, '192.168.44.2');
const snapshot = phone.calls[0].snapshot;
const unpacked = await phone.encryption.decryptPortable(snapshot.envelope, password);
assert.deepEqual(JSON.parse(JSON.stringify(unpacked.workspace)), {});
assert.ok(!JSON.stringify(snapshot).includes(password));
assert.equal(phone.calls[0].authKey, createHash('sha256').update('rhine-lab-usb-auth-v1\n' + password).digest('hex'));
await assert.rejects(phone.encryption.decryptPortable(snapshot.envelope, 'incorrect password'));
phone.element('bluetoothSyncToggle').handlers.click();
await wait(() => phone.timers.size === 0);
assert.equal(phone.stored.enabled, false);
assert.equal(phone.stored.password, undefined);

const desktop = app('desktop');
await flush();
desktop.personal = { reagents: [{ id: 'R1', name: 'Test reagent' }], ...structures };
desktop.element('syncTransferPassword').value = password;
desktop.element('bluetoothSyncToggle').handlers.click();
await wait(() => desktop.updates.length === 1);
const android = app('android', { ...phone.stored, enabled: true, password });
android.remote = desktop.updates[0].snapshot;
await wait(() => android.personal.reagents?.length === 1);
assert.equal(android.personal.coldStorageUnits[0].id, 'F1');
assert.equal(android.personal.microbeRacks[0].id, 'M1');
assert.equal(android.stored.transport, 'bluetooth');

const iphone = app('ios');
await flush();
iphone.element('syncTransferPassword').value = password;
iphone.element('localSyncAddress').value = '172.20.10.2';
iphone.remote = desktop.updates[0].snapshot;
iphone.element('bluetoothSyncToggle').handlers.click();
await wait(() => iphone.personal.reagents?.length === 1);
assert.equal(iphone.calls[0].host, '172.20.10.2');

const conflict = app('android');
await flush();
conflict.personal = { reagents: [{ id: 'LOCAL', stock: 5 }] };
conflict.remote = desktop.updates[0].snapshot;
conflict.element('syncTransferPassword').value = password;
conflict.element('localSyncAddress').value = '192.168.44.2';
conflict.element('bluetoothSyncToggle').handlers.click();
await wait(() => conflict.stored.peers && Object.keys(conflict.stored.peers).length === 1);
assert.equal(conflict.personal.reagents[0].id, 'LOCAL', 'Pairing must not overwrite nonempty personal workspaces');
assert.equal(conflict.lab.reagents[0].id, 'R1');

const unequalBaseline = structuredClone(conflict.stored);
const changedWorkspace = { reagents: [{ id: 'R1', name: 'Test reagent', stock: 20 }], ...structures };
const changedAt = new Date(Date.parse(desktop.updates[0].snapshot.createdAt) + 2000).toISOString();
const changedSnapshot = { ...desktop.updates[0].snapshot, createdAt: changedAt,
    hash: createHash('sha256').update(JSON.stringify(changedWorkspace)).digest('hex'),
    envelope: await desktop.encryption.encryptPortable({ workspace: changedWorkspace, exportedAt: changedAt,
        sourceDeviceId: desktop.updates[0].snapshot.deviceId }, password) };
conflict.remote = changedSnapshot;
await conflict.poll();
assert.equal(conflict.personal.reagents[0].id, 'LOCAL', 'An unequal pairing baseline must never authorize a later personal overwrite');
assert.equal(conflict.lab.reagents[0].stock, 20);
assert.match(conflict.element('usbSyncStatus').textContent, /个人工作区未覆盖/);

const restoredConflict = app('android', unequalBaseline);
restoredConflict.personal = { reagents: [{ id: 'LOCAL', stock: 5 }] };
restoredConflict.remote = changedSnapshot;
await wait(() => restoredConflict.lab.reagents?.[0].stock === 20 && restoredConflict.timers.size === 1);
assert.equal(restoredConflict.personal.reagents[0].id, 'LOCAL', 'Legacy unequal baselines must remain safe after restarting');

iphone.remote = changedSnapshot;
await iphone.poll();
assert.equal(iphone.personal.reagents[0].stock, 20, 'A shared baseline must still accept a one-sided remote update');

const attachmentError = /照片或附件无法读取/;
const photoWorkspace = { reagents: [{ id: 'PHOTO', photoData: 'blob:expired-photo' }] };
desktop.personal = photoWorkspace;
desktop.fetch = async () => { throw new Error('Attachment no longer accessible'); };
desktop.api.queueState(null, 'personal');
Array.from(desktop.timers.values()).at(-1)();
await wait(() => desktop.element('usbSyncStatus').dataset.state === 'error');
assert.match(desktop.element('usbSyncStatus').textContent, attachmentError);
assert.equal(desktop.updates.at(-1), null, 'A failed rebuild must withdraw the old published snapshot');
assert.equal(desktop.personal.reagents[0].photoData, 'blob:expired-photo');

desktop.element('usbSyncStatus').textContent = '';
desktop.receive(iphone.calls.at(-1).snapshot);
await wait(() => attachmentError.test(desktop.element('usbSyncStatus').textContent));
assert.deepEqual(desktop.lab, {}, 'An unreadable personal attachment must abort before any LAB mutation');
assert.equal(desktop.personal.reagents[0].id, 'PHOTO');
assert.equal(desktop.stored.lastConnectedAt, undefined);

desktop.element('syncTransferExport').handlers.click();
await wait(() => desktop.element('syncTransferMessage').dataset.state === 'error');
assert.match(desktop.element('syncTransferMessage').textContent, attachmentError, 'File export must report the same attachment failure');

const callsBeforeFailure = iphone.calls.length;
iphone.personal = photoWorkspace;
iphone.fetch = async () => ({ ok: false });
iphone.api.queueState(null, 'personal');
await iphone.poll();
assert.equal(iphone.calls.length, callsBeforeFailure, 'Mobile must not transmit a snapshot with a missing attachment');
assert.equal(iphone.element('usbSyncStatus').dataset.state, 'error');
assert.match(iphone.element('usbSyncStatus').textContent, attachmentError);

desktop.fetch = async () => ({ ok: true, blob: async () => new Blob(['photo'], { type: 'image/png' }) });
desktop.fileReader = class { readAsDataURL() { this.error = new Error('Read failed'); this.onerror(); } };
const publicationsBeforeReadFailure = desktop.updates.length;
desktop.api.queueState(null, 'personal');
Array.from(desktop.timers.values()).at(-1)();
await wait(() => desktop.updates.length > publicationsBeforeReadFailure);
assert.equal(desktop.updates.at(-1), null, 'FileReader failures must also abort publication');
desktop.fileReader = class { readAsDataURL() { this.result = 'data:image/png;base64,cGhvdG8='; this.onload(); } };
desktop.personal = { ...photoWorkspace, cellCultures: [{ id: 'CELL', photoData: 'blob:cell-photo', history: [{ photoData: 'blob:log-photo' }] }],
    results: [{ id: 'RESULT', attachments: [{ data: 'blob:result-file' }] }], freezerBoxes: [{ id: 'BOX', lastScanPhoto: 'blob:scan-photo' }] };
desktop.api.queueState(null, 'personal');
Array.from(desktop.timers.values()).at(-1)();
await wait(() => desktop.updates.at(-1)?.snapshot);
const recovered = await desktop.encryption.decryptPortable(desktop.updates.at(-1).snapshot.envelope, password);
for (const value of [recovered.workspace.reagents[0].photoData, recovered.workspace.cellCultures[0].photoData,
    recovered.workspace.cellCultures[0].history[0].photoData, recovered.workspace.results[0].attachments[0].data,
    recovered.workspace.freezerBoxes[0].lastScanPhoto]) assert.equal(value, 'data:image/png;base64,cGhvdG8=');
assert.equal(desktop.personal.reagents[0].photoData, 'blob:expired-photo', 'Preparing a snapshot must not mutate local attachments');

const cancelled = app('android');
await flush();
let finish;
cancelled.pending = new Promise(resolve => { finish = resolve; });
cancelled.element('syncTransferPassword').value = password;
cancelled.element('localSyncAddress').value = '192.168.44.2';
cancelled.element('bluetoothSyncToggle').handlers.click();
await wait(() => cancelled.calls.length === 1);
cancelled.element('bluetoothSyncToggle').handlers.click();
await flush();
finish({ snapshot: desktop.updates[0].snapshot });
await flush();
assert.deepEqual(cancelled.personal, {});
assert.equal(cancelled.timers.size, 0, 'Disabling during an exchange must not restart polling');

const browser = app('web');
assert.equal(browser.element('usbSyncPanel').hidden, true);
assert.equal(browser.element('localSyncUnsupported').hidden, false);
assert.match(read('ios/App/App/RhineLocalSync.swift'), /HMAC<SHA256>\.isValidAuthenticationCode/);
assert.match(read('ios/App/App/RhineLocalSync.swift'), /hash == fingerprint/);
assert.match(read('ios/App/App/Info.plist'), /NSLocalNetworkUsageDescription/);

// Bluetooth can take longer than 30 seconds, without relaxing clock skew or replay checks.
const internals = { module: { exports: {} }, require, Buffer, console };
vm.runInNewContext(read('desktop/usb-sync.cjs') + '\nmodule.exports.validRequest = validRequest;', internals);
const now = Date.now(), oldTimestamp = String(now - 120000), nonce = '33'.repeat(16), key = '11'.repeat(32), body = Buffer.from('{}');
const headers = { 'x-rhine-timestamp': oldTimestamp, 'x-rhine-nonce': nonce, 'x-rhine-auth': usbBridge.requestSignature(key, oldTimestamp, nonce, body) };
const nonces = new Map();
assert.equal(internals.module.exports.validRequest({ headers }, body, key, nonces, Number(oldTimestamp)), true);
assert.equal(internals.module.exports.validRequest({ headers }, body, key, nonces, Number(oldTimestamp)), false);
assert.equal(internals.module.exports.validRequest({ headers }, body, key, new Map(), now), false);

// Optional real Windows TLS + UDP unicast transport smoke check. No Bluetooth hardware is simulated.
if (process.argv.includes('--native')) {
    const address = Object.values(networkInterfaces()).flat().find(item => item.family === 'IPv4' && !item.internal && usbBridge.isPrivateAddress(item.address))?.address;
    assert.ok(address, 'A private network interface is required');
    const received = [], errors = [];
    const native = usbBridge.createUsbSyncBridge({ getLocal: () => desktop.updates[0], onRemote: value => received.push(value), onError: error => errors.push(error) });
    const client = dgram.createSocket('udp4');
    try {
        await native.start();
        client.bind(0, address);
        await once(client, 'listening');
        const timestamp = String(Date.now()), discoveryNonce = randomBytes(16).toString('hex'), authKey = desktop.updates[0].authKey;
        const discovery = { protocol: usbBridge.PROTOCOL, timestamp, nonce: discoveryNonce, signature: usbBridge.messageSignature(authKey, 'DISCOVER\n' + timestamp + '\n' + discoveryNonce) };
        const deadline = setTimeout(() => client.emit('error', new Error('Discovery timed out')), 5000);
        const replyPromise = once(client, 'message');
        client.send(Buffer.from(JSON.stringify(discovery)), 32124, address);
        const [replyBytes] = await replyPromise.finally(() => clearTimeout(deadline));
        const reply = JSON.parse(replyBytes);
        assert.equal(reply.signature, usbBridge.messageSignature(authKey, 'REPLY\n' + timestamp + '\n' + discoveryNonce + '\n' + reply.port + '\n' + reply.fingerprint));
        const raw = Buffer.from(JSON.stringify({ protocol: usbBridge.PROTOCOL, snapshot }));
        const sentAt = String(Date.now()), requestNonce = randomBytes(16).toString('hex');
        const send = signature => new Promise((resolve, reject) => {
            const request = https.request({ hostname: address, port: reply.port, localAddress: address, path: '/exchange', method: 'POST', rejectUnauthorized: false, agent: false,
                headers: { 'content-type': 'application/json', 'content-length': raw.length, 'x-rhine-timestamp': sentAt, 'x-rhine-nonce': requestNonce, 'x-rhine-auth': signature } }, response => {
                let value = ''; response.on('data', chunk => { value += chunk; }); response.on('end', () => resolve({ status: response.statusCode, value }));
            });
            request.on('socket', socket => socket.once('secureConnect', () => {
                if (createHash('sha256').update(socket.getPeerCertificate().raw).digest('hex') !== reply.fingerprint) socket.destroy(new Error('Certificate fingerprint mismatch'));
            }));
            request.on('error', reject); request.end(raw);
        });
        assert.equal((await send('00'.repeat(32))).status, 401);
        const signature = usbBridge.requestSignature(authKey, sentAt, requestNonce, raw);
        const response = await send(signature);
        assert.equal(response.status, 200);
        assert.deepEqual(JSON.parse(response.value).snapshot, JSON.parse(JSON.stringify(desktop.updates[0].snapshot)));
        assert.equal((await send(signature)).status, 401);
        assert.equal(received.length, 1);
        assert.equal(errors.length, 0);
        console.log('Native signed UDP unicast / pinned TLS exchange passed.');
    } finally { client.close(); native.stop(); }
}

console.log('Local USB / Bluetooth PAN transfer checks passed.');
