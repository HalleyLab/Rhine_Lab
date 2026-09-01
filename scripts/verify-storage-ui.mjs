import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, css, mobile, html, themeInit, i18n] = await Promise.all([
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-theme-init.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8')
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
assert.equal(reagentDropAction({ area: 'door', unitId: 'A', shelf: 1 }, { area: 'door', unitId: 'B', shelf: 2, x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'device', unitId: 'B', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'box', unitId: 'B', boxId: 'BOX-1', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { pool: true }), 'none');
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 2 }), true);
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 3 }), false);
assert.equal(sameReagentStorageArea({ area: 'box', unitId: 'A', boxId: 'B1' }, { area: 'box', unitId: 'A', boxId: 'B1' }), true);
assert.match(app, /data-door-shelf/);
assert.match(app, /nextReagentStorageZ/);
assert.match(app, /position\.x \+ '%;top:' \+ position\.y/);
assert.match(app, /reagentBottleVisualHtml/);
assert.match(app, /reagent\.bottleStyle === 'EP 管' \? 'ep-tube'/);
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

console.log('Storage layout, mobile tools, and first-frame theme checks passed.');
