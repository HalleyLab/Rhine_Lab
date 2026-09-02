import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [dataText, app, mobileCss, html] = await Promise.all([
  readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8')
]);
const data = JSON.parse(dataText);
const required = ['experiments', 'mice', 'plants', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'cellCultures', 'reagents', 'coldStorageUnits', 'freezerBoxes', 'samples', 'schedule', 'protocols'];
required.forEach((key) => assert.ok(Array.isArray(data[key]) && data[key].length, `${key} must contain showcase records`));
const minimums = { experiments: 8, mice: 7, plants: 5, cellCultures: 5, reagents: 10, freezerBoxes: 4, samples: 12, schedule: 9, protocols: 6 };
Object.entries(minimums).forEach(([key, count]) => assert.ok(data[key].length >= count, `${key} must contain at least ${count} records`));
assert.equal(data.exampleSeedVersion, 8);

const ids = new Set(Object.values(data).flatMap((value) => Array.isArray(value) ? value.map((record) => record && record.id).filter(Boolean) : []));
data.results.forEach((record) => assert.ok(ids.has(record.experimentId), `Missing experiment ${record.experimentId}`));
data.bioDatasets.forEach((record) => assert.ok(ids.has(record.projectId), `Missing project ${record.projectId}`));
data.bioRuns.forEach((record) => {
  assert.ok(ids.has(record.projectId), `Missing project ${record.projectId}`);
  assert.ok(ids.has(record.datasetId), `Missing dataset ${record.datasetId}`);
  assert.ok(ids.has(record.pipelineId), `Missing pipeline ${record.pipelineId}`);
});
assert.ok(JSON.stringify(data).includes('GSE123013'));
assert.ok(JSON.stringify(data).includes('GSE123818'));
assert.ok(JSON.stringify(data).includes('ATCC CRL-3216'));
assert.ok(JSON.stringify(data).includes('Addgene #12260'));
assert.ok(!JSON.stringify(data).includes('展示'));
data.schedule.forEach((item) => {
  if (item.experimentId) assert.ok(ids.has(item.experimentId), `Missing scheduled experiment ${item.experimentId}`);
  if (item.protocolId) assert.ok(ids.has(item.protocolId), `Missing scheduled protocol ${item.protocolId}`);
});
data.lineageLinks.forEach((link) => {
  assert.ok(ids.has(link.sourceId), `Missing lineage source ${link.sourceId}`);
  assert.ok(ids.has(link.targetId), `Missing lineage target ${link.targetId}`);
});
data.coldStorageUnits.forEach((unit) => {
  assert.ok(unit.location, `Missing physical location for ${unit.id}`);
  assert.ok(['横向', '竖向'].includes(unit.orientation), `Invalid orientation for ${unit.id}`);
  assert.ok(Number.isFinite(unit.layoutX) && Number.isFinite(unit.layoutY), `Missing layout coordinates for ${unit.id}`);
  assert.equal(unit.levels.length, unit.shelves, `Level count mismatch for ${unit.id}`);
  unit.levels.forEach((level) => {
    assert.ok(['direct', 'rack'].includes(level.mode), `Invalid level mode for ${unit.id}`);
    assert.ok(level.rows >= 1 && level.columns >= 1, `Invalid level dimensions for ${unit.id}`);
  });
});
data.freezerBoxes.forEach((box) => {
  const unit = data.coldStorageUnits.find((item) => item.id === box.storageUnitId);
  assert.ok(unit, `Missing cold-storage unit ${box.storageUnitId}`);
  assert.ok(box.shelf >= 1 && box.shelf <= Math.max(1, unit.shelves));
  const level = unit.levels[box.shelf - 1];
  assert.ok(box.storageRow >= 1 && box.storageRow <= level.rows);
  assert.ok(box.storageColumn >= 1 && box.storageColumn <= level.columns);
  assert.ok(box.storageLocation.includes(unit.location));
});
assert.match(html, /id="publicDemoBanner"/);
assert.match(html, /href="\?app=1#dashboard"/);
assert.match(app, /function isBrowserAppRuntime\(\)/);
assert.match(app, /isInstalledAppRuntime\(\) \|\| isBrowserAppRuntime\(\)/);
assert.match(app, /if \(isPublicDemoRuntime\(\)\) return normalizeStateShape\(clone\(defaults\)\)/);
assert.match(app, /if \(first && !window\.matchMedia/);
assert.match(mobileCss, /\.entry-dialog[\s\S]*?width: 100% !important/);
assert.match(mobileCss, /\.entry-dialog[\s\S]*?font-size: 16px !important/);
console.log('Public showcase data is valid.');
