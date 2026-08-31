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
assert.equal(new Function(app.match(/function reagentDoorDropAction\(source, target\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorDropAction;')()({ unitId: 'A', shelf: 1 }, { unitId: 'B', shelf: 2, x: 40, y: 60 }), 'move');
assert.equal(new Function(app.match(/function reagentDoorDropAction\(source, target\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorDropAction;')()({ unitId: 'A', shelf: 1 }, { pool: true }), 'remove');
assert.match(app, /data-door-shelf/);
assert.match(app, /nextReagentDoorZ/);
assert.match(app, /position\.x \+ '%;top:' \+ position\.y/);
assert.match(app, /reagentBottleVisualHtml/);
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
assert.ok(html.indexOf('data-view="cells"') < html.indexOf('data-view="reagents"') && html.indexOf('data-view="reagents"') < html.indexOf('data-view="samples"'));
assert.match(css, /\.reagent-bottle-visual::after/);
assert.match(css, /\.photo-capture\.is-drop-target/);
assert.match(css, /\.reagent-bottle-visual\.has-photo/);
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
assert.match(mobile, /grid-template-columns: 18px max-content !important/);
assert.match(mobile, /input,\s*\n\s*select,\s*\n\s*textarea \{\s*\n\s*font-size: 16px !important/);
assert.match(html, /id="editColdStorageRackButton"/);
assert.ok(html.indexOf('rhine-lab-theme-init.js') < html.indexOf('rhine-lab.css'));
assert.match(themeInit, /getHours\(\) < 6/);

console.log('Storage layout, mobile tools, and first-frame theme checks passed.');
