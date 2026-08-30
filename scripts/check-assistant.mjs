import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css, mobile, assistant, main, i18n, worker, utilityIcon] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-assistant.css', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-assistant.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8'),
    readFile(new URL('../sw.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-utility-icon.js', import.meta.url), 'utf8')
]);

assert.match(css, /width:\s*240px;\s*\n\s*height:\s*314px;/);
assert.match(assistant, /addEventListener\('pointermove', moveCharacter\)/);
assert.match(assistant, /rhineLabAssistantPosition/);
assert.match(assistant, /Research Assistant/);
assert.match(assistant, /holdTimer[\s\S]*180/);
assert.doesNotMatch(assistant, /assistantInput'\)\.focus/);
assert.match(mobile, /touch-action:\s*pan-y/);
assert.match(mobile, /height:\s*100dvh/);
assert.match(mobile, /assistant-compose textarea \{ font-size: 16px !important; \}/);
assert.match(css, /-webkit-touch-callout:\s*none/);
assert.match(assistant, /Summarize today/);
assert.match(html, /id="notificationToggle"[\s\S]*id="utilityNav"/);
assert.match(html, /id="utilityNavMorphPath"/);
assert.doesNotMatch(html, />工具<\/span>/);
assert.match(mobile, /desktop-download-button \{ display: none !important; \}/);
assert.match(mobile, /grid-auto-rows:\s*50px/);
assert.match(main, /querySelector\('\.utility-label'\)/);
assert.match(main, /function setUtilityNav\(open\)/);
assert.match(main, /'切换LAB' : '切换个人'/);
assert.match(i18n, /'数据同步': 'Data Sync'/);
assert.match(utilityIcon, /createMorph\(path, iconForState\(\), \{ reducedMotion: 'user' \}\)/);
assert.match(html, /rhine-lab-assistant\.css\?v=0\.2\.4e/);
assert.match(html, /rhine-lab-assistant\.js\?v=0\.2\.4f/);
assert.doesNotMatch(html, /id="assistantPrivacy"/);
assert.doesNotMatch(html, />细胞操作<\/button>/);
assert.doesNotMatch(html, /<label for="assistantInput">/);
assert.match(html, /id="assistantRole" data-i18n-skip/);
assert.match(worker, /rhine-lab-assistant\.css\?v=0\.2\.4e/);
assert.match(worker, /rhine-lab-assistant\.js\?v=0\.2\.4f/);
assert.match(worker, /rhine-lab-utility-icon\.js\?v=0\.2\.4a/);

console.log('assistant UI check passed');
