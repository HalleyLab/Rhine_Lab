import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'));
const required = ['experiments', 'mice', 'plants', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'cellCultures', 'reagents', 'samples', 'schedule', 'protocols'];
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
assert.ok(data.reagents.every((record) => String(record.lot).startsWith('DEMO-')));
console.log('Public showcase data is valid.');
