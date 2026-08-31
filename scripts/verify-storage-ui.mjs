import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, css, mobile, html, themeInit] = await Promise.all([
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-theme-init.js', import.meta.url), 'utf8')
]);

assert.match(app, /function coldStorageRackPosition/);
assert.match(app, /rackPositions: rackPositions/);
assert.match(app, /data-storage-device-slot/);
assert.match(app, /grid-row:' \+ position\.row \+ '\/span ' \+ layout\.rows/);
assert.match(app, /function bindColdStorageBoxGridDrag/);
assert.match(app, /other \? '交换冻存盒位置'/);
assert.match(app, /function openColdStorageDeviceDuringDrag/);
assert.match(app, /function bindHousingSlotDrag/);
assert.match(app, /function coldStorageRackDropPlan/);
assert.match(app, /function coldStorageApplyRackDrop/);
assert.match(app, /coldStorageSchemaVersion = 2/);
assert.match(app, /deviceRows: 4, deviceColumns: 4, rackCount: 0, rows: 4, columns: 4/);
assert.match(app, /name: '货架#' \+ rack/);
assert.match(app, /inputmode="numeric"/);
assert.match(app, /els\.coldStorageOverview\.hidden = coldStorageOverviewHidden/);
assert.doesNotMatch(app, /每架 .*盒位/);
assert.match(app, /cold-storage-slot empty[^\n]+<strong>＋<\/strong>/);
assert.match(css, /rack-drop-preview/);
assert.match(css, /\.dark-theme \.global-search kbd/);
assert.match(css, /html\.native-app body\.dark-theme \.app-boot-screen/);
assert.match(mobile, /\.view > \.page-heading \+ \*/);
assert.match(mobile, /grid-template-columns: 18px max-content !important/);
assert.match(html, /id="editColdStorageRackButton"/);
assert.ok(html.indexOf('rhine-lab-theme-init.js') < html.indexOf('rhine-lab.css'));
assert.match(themeInit, /getHours\(\) < 6/);

console.log('Storage layout, mobile tools, and first-frame theme checks passed.');
