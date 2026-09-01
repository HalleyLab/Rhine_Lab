import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const css = read('css/rhine-lab-motion-icons.css');
const worker = read('sw.js');
const closeIcons = read('js/rhine-lab-close-icons.js');

const bioCss = read('css/rhine-lab-bioinformatics.css');
const main = read('js/rhine-lab.js');

assert.match(html, /rhine-lab-motion-icons\.css\?v=0\.3\.2/);
assert.match(worker, /rhine-lab-motion-icons\.css\?v=0\.3\.2/);
assert.match(worker, /rhine-lab-close-icons\.js\?v=0\.3\.2/);
assert.match(html, /id="searchTitle">搜索<\/h2>/);
assert.match(html, /data-close-search aria-label="关闭搜索"><\/button>/);
assert.match(css, /body:not\(\.dark-theme\) :is\(\.global-search, \.dialog-search\)/);
assert.match(css, /\.load-item header span\s*\{[^}]*font-size:\s*13px/s);
assert.match(css, /\.sidebar-foot \.system-status\s*\{[^}]*min-height:\s*58px/s);
assert.match(css, /\.search-dialog\s*\{\s*animation:\s*none\s*!important/s);
assert.match(css, /\.morph-close-icon[\s\S]*stroke:\s*currentColor/);
assert.doesNotMatch(css, /\.dialog-close[\s\S]*::before/);
assert.match(css, /button\[aria-label\^="关闭"\]:not\(\.search-backdrop\):not\(#utilityNavToggle\)/);
assert.match(closeIcons, /import \{ createMorph \} from '\.\/vendor\/morphicons\/dom\.js'/);
assert.match(closeIcons, /new MutationObserver/);
assert.match(closeIcons, /morph\.morphTo\(CLOSE_ACTIVE, 'snappy'\)/);
assert.doesNotMatch(html + main, />×<\/button>/);
assert.match(css, /\.inline-search\s*\{\s*display:\s*none\s*!important/s);
assert.match(css, /\.cell-search-toolbar\s*\{\s*display:\s*none\s*!important/s);
assert.match(bioCss, /bioinfo-toolbar-actions \.inline-search\{flex:0 1 min\(300px,40vw\)/);
assert.match(bioCss, /fill-opacity:\.72/);
assert.match(bioCss, /--bio-folder-front:color-mix/);
assert.match(bioCss, /bio-workflow-library-head\{padding-left:18px/);
assert.match(bioCss, /bio-file-breadcrumb\{padding-top:4px/);
assert.doesNotMatch(html + main, /照片只在当前设备中压缩保存|数据将先保存到本机缓存/);

console.log('Static icon check passed.');
