import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../js/rhine-lab-layout.js', import.meta.url), 'utf8');
const context = { window: {}, document: { getElementById: () => null } };
vm.runInNewContext(source, context);
const model = context.window.RhineLabLayoutModel;
const plain = value => JSON.parse(JSON.stringify(value));
const scene = { width: 1200, height: 800 };
assert.deepEqual(plain(model.fitBox({ x: -10, y: 999, width: 160, height: 100 }, scene)), { x: 0, y: 700, width: 160, height: 100 });
assert.deepEqual(plain(model.drawBox({ x: 310, y: 210 }, { x: 50, y: 20 }, scene)), { x: 50, y: 20, width: 260, height: 190 });
assert.deepEqual(plain(model.fitBox({ x: 100, y: 90, width: Infinity, height: -10 }, scene)), { x: 100, y: 90, width: 160, height: 24 });
const normalized = plain(model.normalizePlans([{ id: 'FLOOR-1', name: 'First floor', width: 1200, height: 800, items: [{ id: 'ROOM-1', kind: 'room', name: 'Cell room', shape: 'ellipse', function: 'cell', interiorWidth: 800, interiorHeight: 600, items: [{ id: 'FZ-1', kind: 'device', deviceType: 'freezer', link: 'cold:FZ-1', width: 120, height: 200, x: 990, y: 990 }] }, { id: 'CORRIDOR-1', kind: 'corridor', x: 50, y: 500, width: 900, height: 80 }] }]));
assert.equal(normalized[0].items[0].shape, 'ellipse');
assert.equal(normalized[0].items[0].function, 'cell');
assert.equal(normalized[0].items[0].items[0].x, 680);
assert.equal(normalized[0].items[0].items[0].y, 400);
assert.equal(normalized[0].items[0].items[0].link, 'cold:FZ-1');
assert.deepEqual(plain(model.normalizePlans(normalized)), normalized);
assert.equal(model.normalizePlans([null, 'bad', { items: [null, { id: 'x' }, { id: 'x' }] }])[0].items.length, 2);
assert.deepEqual(plain(model.normalizePlans(undefined)), []);
for (const shape of model.shapeTypes) {
    const shapes = plain(model.normalizePlans([{ items: [{ kind: 'room', shape, points: [[0, 0], [1, 0], [.75, 1], [0, .6]], items: [{ kind: 'device', shape, deviceType: 'freezer' }] }] }]));
    assert.equal(shapes[0].items[0].shape, shape);
    assert.equal(shapes[0].items[0].items[0].shape, shape);
    assert.deepEqual(plain(model.normalizePlans(shapes)), shapes);
    const box = model.contentBox({ shape, points: model.shapePoints(shape), width: 260, height: 190 });
    assert.ok(box.width > 0 && box.height > 0, shape + ' must have label space');
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 260 && box.y + box.height <= 190);
}
assert.deepEqual(plain(model.polygonBox([{ x: 40, y: 20 }, { x: 240, y: 20 }, { x: 240, y: 120 }, { x: 100, y: 120 }, { x: 100, y: 220 }, { x: 40, y: 220 }], scene)), { x: 40, y: 20, width: 200, height: 200, points: [[0, 0], [1, 0], [1, .5], [.3, .5], [.3, 1], [0, 1]] });
assert.equal(model.polygonBox([{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }], scene), null);
assert.equal(model.polygonBox([{ x: 10, y: 10 }], scene), null);
assert.deepEqual(plain(model.shapePoints('custom', [[-5, -4], [2, 0], [1, 2]])), [[0, 0], [1, 0], [1, 1]]);
assert.deepEqual(plain(model.shapePoints('custom', [['bad', 0], [1, 1]])), [[0, 0], [1, 0], [1, 1], [0, 1]]);
assert.doesNotMatch(source, /class="lab-layout-hint"/);

const [app, sync, html, sw] = await Promise.all(['../js/rhine-lab.js', '../js/rhine-lab-sync-v019.js', '../index.html', '../sw.js'].map(file => readFile(new URL(file, import.meta.url), 'utf8')));
assert.match(app, /labFloorPlans: window\.RhineLabLayoutModel\.normalizePlans/);
assert.match(app, /labFloorPlans: \[\]/);
assert.match(sync, /WORKSPACE_COLLECTIONS = .*'labFloorPlans'/);
assert.match(html, /data-view="lab-layout"/);
assert.deepEqual(Array.from(html.matchAll(/class="nav-item[^\"]*"[^>]*data-view="([^"]+)"/g), match => match[1]).slice(0, 2), ['dashboard', 'lab-layout']);
assert.match(sw, /rhine-lab-layout\.js/);
const bridgeSource = app.slice(app.indexOf('    window.RhineLabLayoutBridge = {'), app.indexOf('    window.RhineLabBioBridge = {'));
const policy = {
    window: { RhineLabLayoutModel: model }, state: { labFloorPlans: normalized }, workspaceReadOnly: false, publicDemoMode: false,
    workspaceMode: 'personal', saved: 0, clone: plain, anonymousContributor: () => 'LOCAL-NODE', saveState: () => policy.saved++
};
vm.runInNewContext(bridgeSource, policy);
assert.equal(policy.window.RhineLabLayoutBridge.savePlans(normalized, false), true);
assert.equal(policy.saved, 1);
policy.workspaceReadOnly = true;
assert.equal(policy.window.RhineLabLayoutBridge.savePlans([], false), false);
assert.equal(policy.state.labFloorPlans.length, 1);
policy.publicDemoMode = true;
const rearranged = plain(policy.state.labFloorPlans);
rearranged[0].name = 'Forbidden rename';
rearranged[0].items[0].name = 'Forbidden room rename';
rearranged[0].items[0].width = 350;
rearranged[0].items[0].x = 240;
rearranged[0].items[0].items[0].x = 100;
assert.equal(policy.window.RhineLabLayoutBridge.savePlans(rearranged, true), true);
assert.equal(policy.state.labFloorPlans[0].name, 'First floor');
assert.equal(policy.state.labFloorPlans[0].items[0].name, 'Cell room');
assert.equal(policy.state.labFloorPlans[0].items[0].width, normalized[0].items[0].width);
assert.equal(policy.state.labFloorPlans[0].items[0].x, 240);
assert.equal(policy.state.labFloorPlans[0].items[0].items[0].x, 100);
policy.window.RHINE_LAB_STORAGE_LOCKED = true;
assert.equal(policy.window.RhineLabLayoutBridge.savePlans(rearranged, true), false);
console.log('Lab layout shapes, custom outlines, label space, navigation, nested room data, sync and read-only checks passed.');
