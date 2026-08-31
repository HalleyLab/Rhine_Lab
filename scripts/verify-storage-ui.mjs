import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, mobile, html, themeInit] = await Promise.all([
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-theme-init.js', import.meta.url), 'utf8')
]);

assert.match(app, /function coldStorageRackCapacity/);
assert.match(app, /targetLevel\.rackOrder\.length >= coldStorageRackCapacity\(targetLevel\)/);
assert.match(app, /els\.coldStorageOverview\.hidden = coldStorageOverviewHidden/);
assert.doesNotMatch(app, /每架 .*盒位/);
assert.match(mobile, /grid-template-columns: 18px max-content !important/);
assert.ok(html.indexOf('rhine-lab-theme-init.js') < html.indexOf('rhine-lab.css'));
assert.match(themeInit, /getHours\(\) < 6/);

console.log('Storage layout, mobile tools, and first-frame theme checks passed.');
