import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8');
assert.match(source, /data-result-type=/);
assert.match(source, /data-result-id=/);
assert.match(source, /navigateToSearchResult\(searchResult\)/);
assert.match(source, /function findSearchResultElement\(type, id\)/);
assert.match(source, /target\.scrollIntoView\(\{ behavior: 'smooth', block: 'center'/);
assert.match(source, /type === 'experiment'\) openExperimentDetail\(key\)/);
assert.match(source, /type === 'protocol'\) openProtocolDetail\(key\)/);
for (const type of ['mouse', 'plant', 'microbe', 'plasmid', 'virus', 'reagent', 'sample', 'cell', 'formulation', 'bioProject', 'bioDataset', 'bioPipeline', 'bioRun', 'result']) {
    assert.match(source, new RegExp("type: '" + type + "'"));
}
console.log('search navigation check passed');
