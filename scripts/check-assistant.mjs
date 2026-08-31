import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css, mobile, assistant, main, i18n, worker, appCss] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-assistant.css', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-assistant.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
    readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8'),
    readFile(new URL('../sw.js', import.meta.url), 'utf8'),
    readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8')
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
assert.match(html, /rhine-lab-assistant\.css\?v=0\.2\.6a/);
assert.match(html, /rhine-lab-assistant\.js\?v=0\.2\.6a/);
assert.doesNotMatch(html, /id="assistantPrivacy"/);
assert.doesNotMatch(html, />细胞操作<\/button>/);
assert.doesNotMatch(html, /<label for="assistantInput">/);
assert.match(html, /id="assistantRole" data-i18n-skip/);
assert.match(worker, /rhine-lab-assistant\.css\?v=0\.2\.6a/);
assert.match(worker, /rhine-lab-mobile\.css\?v=0\.2\.6g/);
assert.match(worker, /rhine-lab-assistant\.js\?v=0\.2\.6a/);
assert.doesNotMatch(worker, /rhine-lab-utility-icon/);
assert.match(assistant, /return english\(\) \? 'I am here\.' : '我在。'/);
assert.match(html, />存储位置<\/th>/);
assert.doesNotMatch(html, /先显示关联 Protocol 的单次用量|未完成的记录不会计入库存消耗/);
assert.doesNotMatch(html + main + appCss, /experimentUsageImpact/);
assert.doesNotMatch(main, /<h2>' \+ esc\(item\.title\) \+ '<\/h2><p>' \+ esc\(item\.description\)/);
assert.match(main, /experiment-inline-result pending[\s\S]*<h3>实验结果<\/h3>[\s\S]*<span class="status-chip">已填写<\/span>[\s\S]*result-preview-action[\s\S]*已录入结果[\s\S]*修改结果/);
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

console.log('assistant UI check passed');
