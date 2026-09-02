import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import assistantApi from '../cloudflare/src/index.js';

const [html, css, mobile, assistant, main, i18n, worker, appCss, config, sync, api, wrangler] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-assistant.css', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-assistant.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8'),
    readFile(new URL('../sw.js', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-config.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-sync-v019.js', import.meta.url), 'utf8'),
    readFile(new URL('../cloudflare/src/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../cloudflare/wrangler.toml', import.meta.url), 'utf8')
]);

assert.match(css, /width:\s*240px;\s*\n\s*height:\s*314px;/);
assert.match(assistant, /document\.addEventListener\('pointermove', moveCharacter, \{ passive: false, capture: true \}\)/);
assert.match(assistant, /toggle\.addEventListener\('pointerdown', beginCharacterDrag, \{ passive: false, capture: true \}\)/);
assert.match(assistant, /toggle\.addEventListener\('touchmove', blockCharacterTouchScroll, \{ passive: false, capture: true \}\)/);
assert.match(assistant, /function beginCharacterDrag[\s\S]*event\.preventDefault\(\);[\s\S]*event\.stopPropagation\(\);/);
assert.match(assistant, /event\.type === 'pointerup'[\s\S]*openDrawer\(\)/);
assert.match(assistant, /distance < 2/);
assert.match(assistant, /suppressOpen = false; \}, 450\)/);
assert.match(assistant, /rhineLabAssistantPosition/);
assert.match(assistant, /Research Assistant/);
assert.match(assistant, /const HOLD_DELAY = 180/);
assert.match(assistant, /holdTimer[\s\S]*setTimeout\(activateCharacterDrag, HOLD_DELAY\)/);
assert.match(assistant, /function blockCharacterTouchScroll[\s\S]*preventDefault\(\)[\s\S]*stopImmediatePropagation\(\)/);
assert.match(assistant, /setPointerCapture\(event\.pointerId\)/);
assert.doesNotMatch(assistant, /assistantInput'\)\.focus/);
assert.match(mobile, /touch-action:\s*none/);
assert.match(mobile, /height:\s*100dvh/);
assert.match(mobile, /assistant-compose textarea \{ font-size: 16px !important; \}/);
assert.match(css, /-webkit-touch-callout:\s*none/);
assert.match(assistant, /Summarize today/);
assert.match(assistant, /function renderDraftEditor/);
assert.match(assistant, /data-assistant-field/);
assert.match(assistant, /function assistantCollection/);
assert.match(assistant, /function findContextRecord/);
assert.match(html, /id="notificationToggle"[\s\S]*id="utilityNav"/);
assert.match(html, /class="utility-nav-toggle-icon"[\s\S]*M15 18 9 12l6-6/);
assert.doesNotMatch(html, /utilityNavMorphPath|rhine-lab-utility-icon/);
assert.match(html, /class="top-actions">[\s\S]*id="languageToggle"[\s\S]*id="notificationToggle"[\s\S]*id="utilityNavToggle"/);
assert.doesNotMatch(html, /id="utilityNav"[\s\S]*id="languageToggle"/);
assert.doesNotMatch(html, />工具<\/span>/);
assert.match(mobile, /#backgroundToggle,[\s\S]*#themeToggle \{[\s\S]*flex: 0 0 50px !important;/);
assert.match(mobile, /font-size:\s*13px !important;/);
assert.match(mobile, /utility-label \{[\s\S]*align-items:\s*center;[\s\S]*justify-content:\s*center;/);
assert.match(mobile, /span\.mobile-utility-control \{ display: inline-flex !important; \}/);
assert.doesNotMatch(mobile, /utility-item-icon,[\s\S]{0,160}position:\s*absolute/);
assert.match(html, /id="backgroundToggle"[\s\S]*utility-item-icon mobile-utility-control[\s\S]*utility-label mobile-utility-control">切换背景/);
assert.match(html, /id="themeToggle"[\s\S]*utility-theme-icon mobile-utility-control[^>]*>🌙<\/span><span class="utility-label mobile-utility-control">夜间模式/);
assert.match(mobile, /native-app \.utility-nav #desktopDownloadButton \{ display: none !important; \}/);
assert.match(mobile, /display:\s*flex;\s*\n\s*flex-direction:\s*column;/);
assert.match(main, /querySelector\('\.utility-label'\)/);
assert.match(html, /class="desktop-workspace-options desktop-utility-control"/);
assert.match(html, /class="background-toggle-glyph desktop-utility-control"/);
assert.match(html, /data-language-option="zh"/);
assert.match(html, /class="desktop-theme-glyph desktop-utility-control"[^>]*>◐<\/span>/);
assert.match(main, /function setUtilityNav\(open\)/);
assert.match(main, /'切换LAB' : '切换个人'/);
assert.match(i18n, /'数据同步': 'Data Sync'/);
assert.match(appCss, /utility-nav-toggle\[aria-expanded="true"\] \.utility-nav-toggle-icon \{\s*transform: rotate\(180deg\);/);
assert.doesNotMatch(appCss, /utility-nav-toggle-icon[\s\S]{0,300}rotate\([^)]*45deg/);
assert.match(html, /rhine-lab-assistant\.css\?v=0\.3\.2-ai2/);
assert.match(html, /rhine-lab-assistant\.js\?v=0\.3\.2-ai2/);
assert.doesNotMatch(html, /id="assistantPrivacy"/);
assert.doesNotMatch(html, />细胞操作<\/button>/);
assert.doesNotMatch(html, /<label for="assistantInput">/);
assert.match(html, /id="assistantRole" data-i18n-skip/);
assert.match(worker, /rhine-lab-assistant\.css\?v=0\.3\.2-ai2/);
assert.match(worker, /rhine-lab-mobile\.css\?v=0\.3\.2-r4/);
assert.match(worker, /rhine-lab-assistant\.js\?v=0\.3\.2-ai2/);
assert.doesNotMatch(worker, /rhine-lab-utility-icon/);
assert.match(assistant, /return english\(\) \? 'I am here\.' : '我在。'/);
assert.match(config, /assistantApiUrl: 'https:\/\/api\.rh1nelab\.com\/api\/assistant'/);
assert.match(sync, /assistantChat: assistantChat/);
assert.match(sync, /'x-rhine-device': assistantDeviceId\(\)/);
assert.match(sync, /return \{ content: String\(data\.content\), quota: data\.quota \|\| null \}/);
assert.match(api, /const ASSISTANT_MODEL = 'openai\/gpt-oss-20b'/);
assert.match(api, /env\.GROQ_API_KEY/);
assert.match(api, /https:\/\/api\.groq\.com\/openai\/v1\/chat\/completions/);
assert.match(api, /path === '\/api\/assistant'/);
assert.match(wrangler, /name = "ASSISTANT_RATE_LIMITER"[\s\S]*limit = 6[\s\S]*period = 60/);
assert.match(wrangler, /ASSISTANT_DAILY_LIMIT = "30"/);
assert.match(api, /function consumeAssistantDailyQuota/);
assert.match(api, /INSERT INTO assistant_device_usage/);
assert.match(api, /Only help users read, organize, draft, or automate records inside Rhine Lab/);
assert.doesNotMatch(sync, /context:/);
assert.doesNotMatch(config + sync, /(?:GROQ_API_KEY|gsk_[A-Za-z0-9])/);
assert.match(html, />存储位置<\/th>/);
assert.doesNotMatch(html, /先显示关联 Protocol 的单次用量|未完成的记录不会计入库存消耗/);
assert.doesNotMatch(html + main + appCss, /experimentUsageImpact/);
assert.doesNotMatch(main, /<h2>' \+ esc\(item\.title\) \+ '<\/h2><p>' \+ esc\(item\.description\)/);
assert.match(main, /experiment-inline-result pending[\s\S]*<h3>实验结果<\/h3>[\s\S]*<span class="status-chip">已填写<\/span>[\s\S]*button primary compact[\s\S]*data-edit-result[\s\S]*修改结果/);
assert.doesNotMatch(main + i18n, /已录入结果|result-preview-action/);
assert.match(main, /<small>主要结果<\/small>[\s\S]*<small>结论与解释<\/small>[\s\S]*<small>下一步<\/small>/);
assert.match(main, /<details class="result-date-accordion" open>/);
assert.doesNotMatch(main, /当前没有试剂用量，点击下方按钮添加/);
assert.match(main, /coldStorageUnits/);
assert.match(main, /function normalizeColdStorageLevels/);
assert.match(main, /function bindColdStorageBoxGridDrag/);
assert.match(main, /function bindColdStorageRackGridDrag/);
assert.match(main, /rackCount[\s\S]*rackOrder/);
assert.match(main, /storageRack/);
assert.match(main, /function coldStorageRackDropPlan/);
assert.match(main, /function coldStorageApplyRackDrop/);
assert.match(main, /function defaultColdStorageLevels/);
assert.match(main, /coldStorageSchemaVersion = 2/);
assert.match(main, /data-storage-unit/);
assert.match(main, /coldStorageRacksHtml\(activeUnit, shelf, level\)/);
assert.match(main, /activeDialogType === 'coldStorageRack'/);
assert.match(main, /field\('name', '货架名称'/);
assert.doesNotMatch(main + html, /data-cold-storage-layout|coldStorageRoomMap/);
assert.match(main, /activeDialogType === 'coldStorageLevel'/);
assert.match(main, /location: displayOr\(data\.location, '位置待设置'\)/);
assert.match(html, /id="coldStorageDevice"[\s\S]*id="coldStorageLevelTitle"[\s\S]*id="coldStorageMap"/);
assert.match(html, /id="coldStorageTabs"[\s\S]*data-add="coldStorage"[\s\S]*id="coldStorageDevice"/);
assert.doesNotMatch(main, /housing-layout-rack-delete[^>]*>×<\/button>/);
assert.doesNotMatch(main, /抽出 →|查看 →/);
assert.match(appCss, /experiment-inline-result\.pending \.button \{ border-radius: 10px 3px 10px 3px; \}/);
assert.match(main, /function firstAvailableColdStorageSlot/);
assert.match(appCss, /#bioresourceTable td:nth-child\(4\),[\s\S]*#bioresourceTable td:nth-child\(6\),/);
assert.doesNotMatch(appCss, /#bioresourceTable tr\[data-bioresource-type="microbe"\] td:nth-child\([46]\)/);
assert.match(appCss, /\.cold-storage-device\[data-device-kind="ln2"\]/);
assert.match(appCss, /\.cold-storage-map\.is-rack/);
assert.match(appCss, /\.cold-storage-racks\.vertical/);
assert.match(appCss, /\.cold-storage-rack-handle[\s\S]*touch-action:\s*none/);
assert.match(appCss, /html\[lang="en"\][\s\S]*\.story-quote cite \{\s*font-family: Arial, sans-serif !important;/);
assert.ok(appCss.lastIndexOf('font-family: Arial, sans-serif !important;') > appCss.lastIndexOf('font-family: SimHei, "黑体"'));
assert.match(appCss, /html\[lang="zh-CN"\] \.project-progress small,[\s\S]*\.compact-table tbody td:nth-child\(4\),[\s\S]*\.result-conclusion strong \{[\s\S]*font-family: SimHei/);

const savedFetch = globalThis.fetch;
const savedError = console.error;
const origin = 'https://rh1nelab.com';
const makeRequest = (message = 'Hello', requestOrigin = origin) => new Request('https://api.rh1nelab.com/api/assistant', {
    method: 'POST', headers: { origin: requestOrigin, 'content-type': 'application/json', 'x-rhine-device': 'test-device-12345678' },
    body: JSON.stringify({ message, locale: 'en-US', workspace: 'must not be forwarded' })
});
function quotaDb(initial = 0) {
    let used = initial;
    return { prepare(sql) { return { bind(...values) { return { async first() {
        if (sql.startsWith('INSERT INTO assistant_device_usage')) {
            if (used >= Number(values[3])) return null;
            used += 1; return { requests: used };
        }
        return { requests: used };
    } }; } }; } };
}
const apiEnv = { ALLOWED_ORIGINS: origin, GROQ_API_KEY: 'test-only', ASSISTANT_DAILY_LIMIT: '30', DB: quotaDb(), ASSISTANT_RATE_LIMITER: { limit: async () => ({ success: true }) } };
try {
    console.error = () => {};
    globalThis.fetch = async () => { throw new Error('Unexpected upstream request'); };
    for (const [env, message, expected] of [
        [{ ...apiEnv, GROQ_API_KEY: '' }, 'Hello', 503],
        [{ ...apiEnv, ASSISTANT_RATE_LIMITER: { limit: async () => ({ success: false }) } }, 'Hello', 429],
        [{ ...apiEnv, DB: quotaDb(30) }, 'Hello', 429],
        [apiEnv, '', 400], [apiEnv, 'a'.repeat(4001), 413]
    ]) {
        const response = await assistantApi.fetch(makeRequest(message), env);
        assert.equal(response.status, expected);
        assert.equal(response.headers.get('access-control-allow-origin'), origin);
        assert.equal(typeof (await response.json()).error, 'string');
    }
    assert.equal((await assistantApi.fetch(makeRequest('Hello', 'https://untrusted.example'), apiEnv)).status, 403);
    globalThis.fetch = async (url, options) => {
        assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
        const payload = JSON.parse(options.body);
        assert.equal(payload.model, 'openai/gpt-oss-20b');
        assert.deepEqual(payload.messages[1], { role: 'user', content: 'Hello' });
        assert.match(payload.messages[0].content, /perform external actions/);
        assert.ok(!options.body.includes('must not be forwarded'));
        return Response.json({ choices: [{ message: { content: 'I am here.' } }] });
    };
    const reply = await assistantApi.fetch(makeRequest(), apiEnv);
    assert.equal(reply.status, 200);
    const replyBody = await reply.json();
    assert.equal(replyBody.content, 'I am here.');
    assert.equal(replyBody.quota.limit, 30);
    assert.equal(replyBody.quota.remaining, 29);
    globalThis.fetch = async () => Response.json({ error: 'upstream limit' }, { status: 429 });
    assert.equal((await assistantApi.fetch(makeRequest(), apiEnv)).status, 429);
} finally {
    globalThis.fetch = savedFetch;
    console.error = savedError;
}
console.log('assistant UI and API checks passed');
