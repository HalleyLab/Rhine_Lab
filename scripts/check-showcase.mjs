import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'));
const required = ['experiments', 'mice', 'plants', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'cellCultures', 'reagents', 'coldStorageUnits', 'freezerBoxes', 'samples', 'schedule', 'protocols'];
required.forEach((key) => assert.ok(Array.isArray(data[key]) && data[key].length, `${key} must contain showcase records`));

const ids = new Set(Object.values(data).flatMap((value) => Array.isArray(value) ? value.map((record) => record && record.id).filter(Boolean) : []));
data.results.forEach((record) => assert.ok(ids.has(record.experimentId), `Missing experiment ${record.experimentId}`));
data.bioDatasets.forEach((record) => assert.ok(ids.has(record.projectId), `Missing project ${record.projectId}`));
data.bioRuns.forEach((record) => {
  assert.ok(ids.has(record.projectId), `Missing project ${record.projectId}`);
  assert.ok(ids.has(record.datasetId), `Missing dataset ${record.datasetId}`);
  assert.ok(ids.has(record.pipelineId), `Missing pipeline ${record.pipelineId}`);
});
assert.ok(JSON.stringify(data).includes('GSE123013'));
assert.ok(!JSON.stringify(data).includes('展示'));
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
console.log('Public showcase data is valid.');
