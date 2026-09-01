import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, bootstrap, css, mobile, html, themeInit, i18n, defaultVial] = await Promise.all([
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-bootstrap.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-theme-init.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8'),
  readFile(new URL('../images/reagent-vial-default.svg', import.meta.url), 'utf8')
]);

assert.match(app, /function coldStorageRackPosition/);
assert.match(app, /rackPositions: rackPositions/);
assert.match(app, /data-storage-device-slot/);
assert.match(app, /grid-row:' \+ position\.row \+ '\/span ' \+ layout\.rows/);
assert.match(app, /function bindColdStorageBoxGridDrag/);
assert.match(app, /function bindColdStorageReagentDrag/);
assert.match(app, /function reagentDoorDropAction/);
const reagentDropAction = new Function(app.match(/function reagentDoorDropAction\(source, target\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorDropAction;')();
const sameReagentStorageArea = new Function(app.match(/function sameReagentStorageArea\(position, target\) \{[\s\S]*?\n    \}/)[0] + '; return sameReagentStorageArea;')();
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value)));
const reagentDoorPosition = new Function('number', app.match(/function reagentDoorPosition\(reagent\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorPosition;')(clamp);
const reagentDropCoordinates = new Function('number', app.match(/function reagentDropCoordinates\(pointer, bounds\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDropCoordinates;')(clamp);
const bottleFunctions = new Function('esc', app.match(/function reagentBottleVisualHtml\(reagent\) \{[\s\S]*?\n    \}/)[0] + app.match(/function reagentBottleHtml\(reagent, className, attributes\) \{[\s\S]*?\n    \}/)[0] + '; return { visual: reagentBottleVisualHtml, button: reagentBottleHtml };')(String);
const emptyWorkspace = new Function(app.match(/function emptyWorkspaceState\(\) \{[\s\S]*?\n    \}/)[0] + '; return emptyWorkspaceState;')();
assert.equal(reagentDropAction({ area: 'door', unitId: 'A', shelf: 1 }, { area: 'door', unitId: 'B', shelf: 2, x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'device', unitId: 'B', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'box', unitId: 'B', boxId: 'BOX-1', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { pool: true }), 'none');
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 2 }), true);
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 3 }), false);
assert.equal(sameReagentStorageArea({ area: 'box', unitId: 'A', boxId: 'B1' }, { area: 'box', unitId: 'A', boxId: 'B1' }), true);
assert.equal(reagentDoorPosition({ doorStorage: { area: 'device', unitId: 'A', x: 4, y: 2 } }).y, 2);
assert.deepEqual(reagentDropCoordinates({ clientX: 0, clientY: 0 }, { left: 0, top: 0, width: 240, height: 460 }), { x: 5, y: 5 });
assert.match(bottleFunctions.visual({ bottleStyle: '试剂瓶', photoData: '' }), /reagent-vial-default\.svg/);
assert.match(bottleFunctions.visual({ bottleStyle: 'EP 管', photoData: 'photo' }), /bottle-style-photo has-photo/);
assert.match(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /data-reagent-name="DMEM"/);
assert.match(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /aria-label="DMEM"/);
assert.doesNotMatch(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /title=/);
assert.deepEqual(emptyWorkspace().coldStorageUnits, []);
assert.deepEqual(emptyWorkspace().freezerBoxes, []);
assert.match(app, /data-door-shelf/);
assert.match(app, /nextReagentStorageZ/);
assert.match(app, /position\.x \+ '%;top:' \+ position\.y/);
assert.match(app, /reagentBottleVisualHtml/);
assert.match(app, /reagent\.bottleStyle === 'EP 管' \? 'ep-tube'/);
assert.match(app, /const detail = reagent\.name;/);
assert.match(app, /ghostSource: handle \|\| row\.querySelector\('\.reagent-inventory-bottle'\)/);
assert.match(app, /images\/reagent-vial-default\.svg/);
assert.match(defaultVial, /viewBox="0 0 64 132"/);
assert.match(app, /data-reagent-device-area/);
assert.match(app, /data-reagent-box-area/);
assert.match(app, /if \(publicDemoMode\) return;/);
assert.match(app, /return publicDemoMode \|\| workspaceMode === 'lab'/);
assert.match(app, /reagent-inventory-bottle/);
assert.match(app, /#reagentTable \[data-reagent-catalog\]/);
assert.match(app, /addEventListener\('drop'[\s\S]*preparePhotoAttachment/);
assert.match(app, /preparePhotoAttachment\(input, droppedFile\)/);
assert.match(app, /drag\.ghost\.classList\.add\('housing-slot-drag-ghost'\)/);
assert.doesNotMatch(app, /drag\.ghost\.className = 'housing-slot-drag-ghost'/);
assert.doesNotMatch(app, /data-door-slot/);
assert.doesNotMatch(app, /doorSlots/);
assert.match(html, /id="coldStorageSideDoor"/);
assert.match(html, /<header><strong>侧门<\/strong><\/header>/);
assert.doesNotMatch(html, /试剂侧门|自由放置/);
assert.doesNotMatch(html, /coldStorageReagentTray|待放入试剂/);
assert.ok(html.indexOf('data-view="cells"') < html.indexOf('data-view="reagents"') && html.indexOf('data-view="reagents"') < html.indexOf('data-view="samples"'));
assert.match(css, /\.reagent-bottle-visual::after/);
assert.match(css, /\.photo-capture\.is-drop-target/);
assert.match(css, /\.reagent-bottle-visual\.has-photo/);
assert.match(css, /\.bottle-style-ep-tube/);
assert.match(css, /\.freezer-box-reagent-layer/);
assert.match(css, /#reagentFilters button/);
assert.match(css, /\.reagent-door-free-area/);
assert.match(css, /\.reagent-name-bubble/);
assert.match(app, /requestAnimationFrame\(flushReagentDrag\)/);
assert.match(app, /querySelector\(boxArea \? '\.freezer-box-reagent-layer' : '\.cold-storage-device-reagent-layer'\)/);
assert.match(mobile, /\.cold-storage-device\.has-reagent-door/);
assert.match(app, /other \? '交换冻存盒位置'/);
assert.match(app, /function openColdStorageDeviceDuringDrag/);
assert.match(app, /function bindHousingSlotDrag/);
assert.match(app, /function housingHitAt/);
assert.match(app, /function housingSlotTargetAt/);
assert.match(app, /document\.elementsFromPoint/);
assert.match(app, /housingSlotTargetAt\(event\.clientX, event\.clientY, drag\.kind\) \|\| drag\.target/);
assert.doesNotMatch(app, /drag\.slot\.releasePointerCapture/);
assert.match(app, /function coldStorageRackDropPlan/);
assert.match(app, /function coldStorageApplyRackDrop/);
assert.match(app, /coldStorageSchemaVersion = 2/);
assert.match(app, /deviceRows: 4, deviceColumns: 4, rackCount: 0, rows: 4, columns: 4/);
assert.match(app, /name: '货架#' \+ rack/);
assert.match(i18n, /\^货架#\(\\d\+\)\$/);
assert.match(i18n, /点击空位放置冻存盒/);
assert.match(i18n, /第 \(\\d\+\) 行第 \(\\d\+\) 位/);
assert.match(app, /inputmode="numeric"/);
assert.match(app, /els\.coldStorageOverview\.hidden = coldStorageOverviewHidden/);
assert.doesNotMatch(app, /每架 .*盒位/);
assert.match(app, /cold-storage-slot empty[^\n]+<strong>＋<\/strong>/);
assert.match(css, /rack-drop-preview/);
assert.match(css, /\.dark-theme \.global-search kbd/);
assert.match(css, /\.dark-theme \.animal-rack-position\.active/);
assert.match(css, /\.cold-storage-device-slot\.drop-target/);
assert.match(css, /body\.background-all-lives \.freezer-box-tab\.active small/);
assert.match(css, /\.record-detail-body,.experiment-detail-body,.freezer-scan-body/);
assert.match(css, /html\.native-app body\.dark-theme \.app-boot-screen/);
assert.match(mobile, /\.view > \.page-heading \+ \*/);
assert.match(mobile, /\.view\.active > \* \+ \*/);
assert.match(mobile, /touch-action: pan-x/);
assert.match(mobile, /grid-template-columns: 18px max-content !important/);
assert.match(mobile, /input,\s*\n\s*select,\s*\n\s*textarea \{\s*\n\s*font-size: 16px !important/);
assert.match(html, /id="editColdStorageRackButton"/);
assert.ok(html.indexOf('rhine-lab-theme-init.js') < html.indexOf('rhine-lab.css'));
assert.match(themeInit, /getHours\(\) < 6/);
assert.match(bootstrap, /'rhineLabWorkspaceV3', 'rhineLabWorkspaceV3:lab'/);
assert.match(bootstrap, /readLocal\('rhineLabWorkspaceV2' \+ suffix\)/);
assert.match(bootstrap, /writeLocal\(currentKey, previousValue\)/);
assert.match(app, /const emptyFirstRun = mode === 'lab' \|\| isInstalledAppRuntime\(\);/);
assert.match(app, /coldStorageUnits: \[\],\s*freezerBoxes: \[\]/);
assert.match(app, /Array\.isArray\(data\.coldStorageUnits\) \? data\.coldStorageUnits/);
assert.match(app, /if \(!activeUnit\) \{[\s\S]*尚未添加冻存设备/);

async function runBootstrap(initialValues) {
  const values = new Map(Object.entries(initialValues));
  const writes = [];
  const crypto = {
    prepareLocalStorage: async function () {},
    readLocal: function (key) { return values.has(key) ? values.get(key) : null; },
    writeLocal: async function (key, value) { writes.push([key, value]); values.set(key, value); }
  };
  const document = { body: { dataset: {}, appendChild: function () {} }, createElement: function () { return {}; } };
  const localStorage = { length: 0, key: function () { return null; } };
  new Function('window', 'document', 'localStorage', bootstrap)({ RHINE_LAB_CONFIG: {}, RhineLabCrypto: crypto }, document, localStorage);
  await new Promise(function (resolve) { setTimeout(resolve, 0); });
  return { values, writes };
}

const migratedStorage = await runBootstrap({ rhineLabWorkspaceV2: { marker: 'legacy' } });
assert.deepEqual(migratedStorage.values.get('rhineLabWorkspaceV3'), { marker: 'legacy' });
const preservedStorage = await runBootstrap({ rhineLabWorkspaceV2: { marker: 'legacy' }, rhineLabWorkspaceV3: { marker: 'current' } });
assert.deepEqual(preservedStorage.values.get('rhineLabWorkspaceV3'), { marker: 'current' });
assert.equal(preservedStorage.writes.length, 0);

console.log('Storage layout, mobile tools, and first-frame theme checks passed.');
