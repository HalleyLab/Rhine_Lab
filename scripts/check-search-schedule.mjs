import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const main = read('js/rhine-lab.js');
const biology = read('css/rhine-lab-biology.css');

assert.match(html, /id="untimedScheduleList"[^>]*hidden/);
assert.match(main, /field\('time', '开始时间（可选）', 'time', '09:00', false\)/);
assert.match(main, /function normalizeScheduleTimes/);
assert.match(main, /time: '', end: '', experimentId:/);
assert.match(main, /const timedTasks = dayTasks\.filter\(hasScheduleTime\)/);
assert.match(main, /function addActivity\(text\)/);
assert.doesNotMatch(main, /time:\s*'刚刚'/);
assert.match(main, /activity\.at \? formatHistoryTime\(activity\.at\) : activity\.time/);
assert.match(main, /function navigateToSearchResult/);
assert.match(main, /scrollIntoView\(\{ behavior: 'smooth', block: 'center'/);
assert.match(main, /state\.schedule\.forEach\(item => entries\.push\(\{ view: 'schedule', type: 'task'/);
assert.match(main, /task: \['#view-schedule \[data-task-id\]'/);
assert.ok((main.match(/data-task-id/g) || []).length >= 3);
assert.doesNotMatch(main.match(/const searchResult = event\.target\.closest[\s\S]*?return;\s*\}/)?.[0] || '', /openRecordDetail/);
assert.match(biology, /plant-rack-manager>\.compact-resource-toolbar\{border-bottom:1px solid var\(--line\)!important\}/);
assert.match(biology, /microbe-detail-hero,.plasmid-detail-hero,.virus-detail-hero/);

console.log('Search and untimed schedule check passed.');
