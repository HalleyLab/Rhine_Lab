import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css, assistant, worker] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-assistant.css', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-assistant.js', import.meta.url), 'utf8'),
    readFile(new URL('../sw.js', import.meta.url), 'utf8')
]);

assert.match(css, /width:\s*240px;\s*\n\s*height:\s*314px;/);
assert.match(assistant, /addEventListener\('pointermove', moveCharacter\)/);
assert.match(assistant, /rhineLabAssistantPosition/);
assert.match(assistant, /Research Assistant/);
assert.match(assistant, /Summarize today/);
assert.match(html, /rhine-lab-assistant\.css\?v=0\.2\.3c/);
assert.match(html, /rhine-lab-assistant\.js\?v=0\.2\.3e/);
assert.doesNotMatch(html, /id="assistantPrivacy"/);
assert.doesNotMatch(html, />细胞操作<\/button>/);
assert.doesNotMatch(html, /<label for="assistantInput">/);
assert.match(html, /id="assistantRole" data-i18n-skip/);
assert.match(worker, /rhine-lab-assistant\.css\?v=0\.2\.3c/);
assert.match(worker, /rhine-lab-assistant\.js\?v=0\.2\.3e/);

console.log('assistant UI check passed');
