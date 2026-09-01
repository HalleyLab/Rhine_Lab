import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

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
assert.match(worker, /rhine-lab-sync-v019\.js\?v=0\.3\.1/);
assert.match(worker, /rhine-lab-bootstrap\.js\?v=0\.3\.1/);
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

console.log('Local USB transfer mode check passed.');
