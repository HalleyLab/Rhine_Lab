import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const source = await read('js/rhine-lab-navigation.js');
const shortcutContext = { window:{ dispatchEvent(){} }, CustomEvent:class{}, localStorage:{ getItem(){return null;},setItem(){} } };
vm.runInNewContext(await read('js/rhine-lab-shortcuts.js'),shortcutContext);
const shortcuts = shortcutContext.window.RhineLabShortcuts;
const actionCommands = { n:'create',e:'edit',x:'delete',s:'save',v:'view',a:'other',g:'navigation' };
const handlers = {}, calls = [], frames = new Map();
let frameId = 0, blocked = false, typing = false, editing = false, control = false, settings = false, dialog = null;
const target = { closest(selector) {
    if (selector === 'editable') return typing;
    if (selector === 'editor') return editing;
    if (selector === 'dialog[open]') return dialog;
    if (selector === '#shortcutSettingsDialog') return settings;
    return control;
} };
const create = { click: () => calls.push('new') };
const buttons = Array.from({ length:10 }, (_, index) => ({ classList:{ contains:() => index === 0 }, click:() => calls.push(index), style:{ values:{}, setProperty(key,value) { this.values[key] = value; }, removeProperty(key) { delete this.values[key]; } } }));
const context = {
    document:{ addEventListener:(type, handler) => handlers[type] = handler, querySelectorAll:() => [create], querySelector:() => dialog },
    nav:{ addEventListener:(type, handler) => handlers[type] = handler },
    buttons, shortcuts, actionCommands, toggle:{ click:() => calls.push('toggle') }, overlay:() => blocked,
    window:{ dispatchEvent:event => calls.push(event.type) },CustomEvent:class{constructor(type){this.type=type;}},shortcutMode:false,
    editable:'editable', editor:'editor', visible:element => !!element && !element.disabled,
    clearHints:() => calls.push('clear'), showHints:() => calls.push('hints'), selectedAction:null,
    selectAction:(key, step = 0) => calls.push([key,step]),
    activateNumber:key => { calls.push('tab' + key); return true; },
    dock:true, motion:{ matches:false }, dockFrame:0, dockPointer:null, dockCenters:buttons.map((_,index) => index * 52),
    requestAnimationFrame:callback => { frames.set(++frameId,callback); return frameId; }, cancelAnimationFrame:id => frames.delete(id)
};
context.setShortcutMode = active => { context.shortcutMode = active; calls.push('clear'); if(active)calls.push('hints'); };
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf("    document.addEventListener('keydown'"), source.indexOf("    document.getElementById('keyboardShortcutHelp').addEventListener")), context);
const key = (value, options = {}) => {
    const event = { key:value, target, preventDefault() { this.prevented = this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...options };
    handlers.keydown(event);
    return event;
};
key('ArrowRight'); assert.deepEqual(calls.splice(0), ['clear',1]);
key('a'); assert.deepEqual(calls.splice(0), ['clear',9]);
for (const name of ['typing','editing','blocked','control']) {
    typing = name === 'typing'; editing = name === 'editing'; blocked = name === 'blocked'; control = name === 'control';
    key('ArrowRight'); assert.deepEqual(calls, [], name);
}
typing = editing = blocked = control = false;
key('d', { isComposing:true }); key('a', { repeat:true }); key('a', { defaultPrevented:true }); key('a', { ctrlKey:true });
assert.deepEqual(calls, []);
for(const modifier of ['altKey','ctrlKey','metaKey','shiftKey']) for(const value of ['g','a','k','n','Enter','ArrowRight','1','`']) {
    const event=key(value,{[modifier]:true});assert.ok(!event.prevented&&!event.stopped,modifier+' '+value);assert.deepEqual(calls,[]);
}
key('2'); assert.deepEqual(calls.splice(0), ['tab2']);
key('n'); key('F2'); key('g'); key('Alt'); key('k'); assert.deepEqual(calls, [], 'Mode actions do not run outside mode');
assert.equal(key('`').stopped,true); assert.deepEqual(calls.splice(0), ['clear','hints']); assert.equal(context.shortcutMode,true);
key('g'); assert.deepEqual(calls.splice(0), ['clear','toggle']); assert.equal(context.shortcutMode,false);
key('`'); calls.length=0; key('Escape'); assert.deepEqual(calls.splice(0),['clear']); assert.equal(context.shortcutMode,false);
key('`'); calls.length=0; assert.ok(!key('g',{altKey:true}).prevented); assert.deepEqual(calls.splice(0),['clear']); assert.equal(context.shortcutMode,false,'A modifier chord cancels mode without being intercepted');
for(const name of ['typing','editing','blocked','settings']) {
    typing=name==='typing';editing=name==='editing';blocked=name==='blocked';settings=name==='settings';
    assert.ok(!key('`').prevented); assert.deepEqual(calls,[],name);
}
typing=editing=blocked=settings=false;
key('²',{code:'Backquote'}); calls.length=0;
key('g',{code:'KeyG'}); assert.deepEqual(calls.splice(0),['clear','toggle'],'Physical-key mapping works without Alt');
key('`'); calls.length=0; key('k'); assert.deepEqual(calls.splice(0),['clear','rhine:searchshortcut']); assert.equal(context.shortcutMode,false);
key('`'); calls.length=0; key('d'); assert.deepEqual(calls.splice(0),['clear',1]);
dialog = { querySelector(){} }; blocked = true;
typing = true; key('`'); key('Enter',{ctrlKey:true}); assert.deepEqual(calls,[],'Typing and old save chord stay untouched');
typing = false; key('`'); assert.deepEqual(calls.splice(0),['clear','hints'],'Mode can open within a dialog');
key('2'); assert.deepEqual(calls.splice(0), ['tab2','hints']);
key('e'); assert.deepEqual(calls.splice(0), [['e',0]], 'Choosing a group must not execute it');
context.selectedAction = { key:'e', button:create };
key('ArrowDown'); assert.deepEqual(calls.splice(0), [['e',1]]);
key('ArrowUp'); assert.deepEqual(calls.splice(0), [['e',-1]]);
assert.equal(key('Enter').stopped, true); assert.deepEqual(calls.splice(0), ['clear','new']); assert.equal(context.shortcutMode,false);
context.selectedAction = null;
key('Enter'); assert.deepEqual(calls, []);
dialog=null; blocked=false;

vm.runInContext(source.slice(source.indexOf("    nav.addEventListener('pointermove'"), source.indexOf('    const cards =')), context);
for (let index=0; index<100; index++) handlers.pointermove({ clientX:index, pointerType:'mouse' });
assert.equal(frames.size, 1);
frames.values().next().value(); frames.clear();
assert.ok(Number(buttons[2].style.values['--dock-scale']) > Number(buttons[1].style.values['--dock-scale']));
assert.equal(Number(buttons[9].style.values['--dock-scale']), 1);
assert.ok(buttons.every(button => Number(button.style.values['--dock-scale']) <= 1.18));
assert.ok(buttons.every(button => Number(button.style.values['--dock-lift'].replace('px','')) >= -2));
context.motion.matches = true;
handlers.pointermove({ clientX:0, pointerType:'mouse' }); assert.equal(frames.size, 0);
context.motion.matches = false;
handlers.pointermove({ clientX:0, pointerType:'touch' }); assert.equal(frames.size, 0);

const observed = [], card = { classList:{ add:value => calls.push(value) } };
Object.assign(context, { revealObserver:{ observe:node => observed.push(node) }, seen:new WeakSet(), cards:'cards' });
vm.runInContext(source.slice(source.indexOf('    function observeCards('), source.indexOf("    if ('IntersectionObserver'")), context);
const root = { nodeType:1, closest:() => true, matches:() => false, querySelectorAll:() => [card] };
context.observeCards(root); context.observeCards(root);
assert.equal(observed.length, 1); assert.deepEqual(calls.splice(0), ['scroll-card']);
context.observeCards({ nodeType:3 });
context.motion.matches = true; context.observeCards(root); assert.equal(observed.length, 1);

// Semantic shortcuts cover any number of same-kind actions, including offscreen ones.
const element = (attributes = {}, extra = {}) => ({
    id:'', type:'button', dataset:{},
    getAttributeNames:() => Object.keys(attributes), getAttribute:name => attributes[name],
    classList:{ values:new Set(), add(value) { this.values.add(value); }, remove(value) { this.values.delete(value); } },
    matches:() => false, closest:() => false, getBoundingClientRect:() => ({ left:20,right:200,top:100,bottom:140 }),
    focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; }, ...extra
});
let candidates = Array.from({ length:90 }, () => element({ 'data-edit-result':'' }));
let headingCopy = null, modal = null, tabGroups = [], focusedGroup = null, isDock = false;
const scope = { contains:group => tabGroups.includes(group), querySelectorAll:selector => selector === 'button' ? candidates : selector.includes('.filter-tabs') ? tabGroups : candidates };
const groupContext = {
    document:{ querySelector:selector => selector === '.view.active' ? scope : selector === 'dialog[open]' ? modal : selector.includes(':first-child') ? headingCopy : null,
        activeElement:{ closest:() => focusedGroup }, getElementById:() => ({ getBoundingClientRect:() => ({ top:700 }) }),
        createElement:() => ({ className:'', style:{}, setAttribute() {}, remove() {}, getBoundingClientRect:() => ({ width:110,height:31 }) }), body:{ appendChild() {}, classList:{ contains:() => isDock } } },
    compact:{ matches:true },
    toggle:null,shortcuts,actionCommands,shortcutMode:false,updateLabels(){},
    visible:button => !!button && !button.disabled, innerWidth:390, innerHeight:844,
    requestAnimationFrame() {}, cancelAnimationFrame() {}
};
vm.createContext(groupContext);
vm.runInContext(source.slice(source.indexOf('    let hints ='), source.indexOf("    document.addEventListener('keydown'")) + ';api={actionKey,showHints,selectAction,clearHints,activateNumber,hintBounds,get actions(){return actions},get selected(){return selectedAction},get hints(){return hints}};', groupContext);
const { api } = groupContext;
for (const [attributes, extra, expected] of [
    [{ 'data-add-passage':'' }, {}, 'n'], [{ 'data-edit-task':'' }, {}, 'e'], [{ 'data-delete-result':'' }, {}, 'x'],
    [{ 'data-remove-run-photo':'' }, {}, 'x'], [{}, { id:'editProtocolButton' }, 'e'],
    [{}, { id:'entrySubmitButton' }, 's'], [{}, { type:'submit', form:{} }, 's'],
    [{ 'data-filter':'全部' }, { type:'submit', form:null }, 'f'],
    [{ 'data-biology-tab':'plants' }, {}, 'f'], [{ 'data-filter':'全部' }, {}, 'f'],
    [{ 'data-freezer-box':'box1' }, {}, 'v'], [{}, { dataset:{ layoutAction:'new' } }, 'n'],
    [{}, { dataset:{ layoutAction:'delete-plan' } }, 'x'], [{}, {}, 'a']
]) assert.equal(api.actionKey(element(attributes, extra)), expected);
api.showHints(); assert.equal(api.actions.length, 90); assert.equal(api.hints.length, 90);
assert.ok(api.actions.every(action => action.key === 'e'));
assert.equal(api.selectAction('e'), true); assert.equal(api.selected.button, candidates[0]);
api.selectAction('e', -1); assert.equal(api.selected.button, candidates[89]);
candidates[0].disabled = true;
api.selectAction('e', 1); assert.equal(api.selected.button, candidates[1]);
assert.ok(candidates[1].focused);
assert.equal(api.selectAction('x'), false); assert.equal(api.selected.button, candidates[1]);
assert.ok(api.hints.some(({ hint }) => hint.textContent === 'E 1/89 ↑ ↓ ↵'));
const activeHint = api.hints.find(({ hint }) => hint.className.includes('is-current')).hint;
assert.equal(activeHint.hidden, false);
assert.equal(parseFloat(activeHint.style.top),63, 'Hints stay directly above their target');
assert.equal(parseFloat(activeHint.style.left),55, 'Hints are horizontally centered');
api.clearHints(); assert.equal(api.actions.length, 0); assert.equal(api.hints.length, 0);
assert.equal(candidates[1].classList.values.size, 0);
headingCopy = { getBoundingClientRect:() => ({ left:0,right:390,top:0,bottom:90 }) };
api.showHints(); api.selectAction('e');
assert.equal(api.hints.find(item => item.selected).hint.hidden,true, 'Hide a blocked badge instead of moving it to another side');
api.clearHints(); headingCopy = null;
const dialogHints = [];
modal = { contains:() => false, querySelectorAll:selector => selector.includes('.filter-tabs') ? [] : candidates, appendChild:hint => dialogHints.push(hint) };
candidates = [element({}, { id:'entrySubmitButton', closest:selector => selector === 'dialog[open]' ? modal : false })];
api.showHints(); api.selectAction('s'); assert.ok(dialogHints.includes(api.hints[0].hint), 'Hints must be inside the native dialog top layer');
isDock = true;
candidates[0].getBoundingClientRect = () => ({ left:20,right:200,top:710,bottom:750 });
api.showHints(); api.selectAction('s');
assert.equal(api.hints[0].hint.hidden,false); assert.ok(parseFloat(api.hints[0].hint.style.top)+31<=684,'Dialog footer hints remain above the dock too');
isDock = false;
api.clearHints(); modal = null;
// Disabled, hidden and dense diagram controls do not fill the action groups.
candidates = [element({}, { disabled:true }), element({}, { closest:() => true }), element({ 'aria-hidden':'true' }), element({}, { getBoundingClientRect:() => ({ left:20,right:200,top:900,bottom:940 }) })];
api.showHints(); assert.equal(api.actions.length, 1); assert.equal(api.hints.length, 0);
api.selectAction('a'); assert.ok(candidates[3].focused && candidates[3].scrolled);
// Small switcher rows use numbers; focusing another row changes only that row's mapping.
const primaryTabs = Array.from({ length:6 }, (_, index) => element({ 'data-filter':'' }, { click:() => calls.push(index) }));
const secondaryTabs = Array.from({ length:3 }, (_, index) => element({ 'data-biology-tab':'' }, { click:() => calls.push('secondary' + index) }));
tabGroups = [element({}, { querySelectorAll:() => primaryTabs }), element({}, { querySelectorAll:() => secondaryTabs })];
candidates = [...primaryTabs,...secondaryTabs];
api.showHints(); assert.deepEqual(Array.from(api.actions, action => action.key), ['1','2','3','4','5','6']);
assert.equal(api.activateNumber('2'),true); assert.deepEqual(calls.splice(0),[1]);
assert.equal(api.activateNumber('0'),false);
focusedGroup = tabGroups[1]; api.showHints();
assert.deepEqual(Array.from(api.actions, action => action.key),['1','2','3']);
api.activateNumber('3'); assert.deepEqual(calls.splice(0),['secondary2']);
tabGroups = []; focusedGroup = null;
// Hints keep a viewport margin and never sit in or below the bottom dock.
candidates = [element({}, { getBoundingClientRect:() => ({ left:20,right:200,top:710,bottom:750 }) })];
isDock = true; api.showHints(); assert.equal(api.hints.length,0);
assert.equal(api.hintBounds().bottom,684);
isDock = false; api.showHints(); assert.equal(api.hints.length,1); assert.equal(api.hints[0].hint.hidden,false);
assert.ok(parseFloat(api.hints[0].hint.style.left)>=16);
groupContext.compact.matches = false; assert.equal(api.hintBounds().left,24);
api.clearHints();
groupContext.toggle = element({}, { getBoundingClientRect:() => ({ left:250,right:294,top:714,bottom:762 }) });
isDock = true; api.showHints();
const navigationHint = api.hints.find(({ hint }) => hint.textContent === 'G');
assert.ok(navigationHint&&!navigationHint.hint.hidden); assert.ok(parseFloat(navigationHint.hint.style.top)+31<=684,'G appears safely above the dock');
groupContext.toggle = null; isDock = false; api.clearHints();

// Visible header travel is bounded, frame-coalesced, and disabled for reduced motion.
const depthStyle = { value:null, setProperty(_, value) { this.value = value; }, removeProperty() { this.value = null; } };
let depthScroll, headingEntries;
const headingClasses = new Set(), headingObserved = [];
const depthHeading = { style:depthStyle, classList:{ add:value => headingClasses.add(value), remove:value => headingClasses.delete(value), toggle:(value,on) => on ? headingClasses.add(value) : headingClasses.delete(value) }, getBoundingClientRect:() => ({ top:100 - depthContext.window.scrollY,height:200 }) };
const headingIO = function (callback) { headingEntries = callback; this.observe = node => headingObserved.push(node); this.unobserve = node => headingObserved.splice(headingObserved.indexOf(node),1); };
const depthContext = {
    document:{ querySelector:() => depthHeading }, IntersectionObserver:headingIO,
    window:{ IntersectionObserver:headingIO, scrollY:0, innerHeight:1000, addEventListener:(_, listener) => depthScroll = listener }, motion:{ matches:false }, actions:[], hintFrame:0,
    requestAnimationFrame:callback => { frames.set(++frameId,callback); return frameId; }, cancelAnimationFrame:id => frames.delete(id)
};
vm.createContext(depthContext);
vm.runInContext(source.slice(source.indexOf('    let depthHeading ='), source.indexOf('    // Reuse the local vector atlas')) + ';api={paintHeadingDepth,refreshHeadingDepth}', depthContext);
vm.runInContext(source.slice(source.indexOf("    window.addEventListener('scroll'"), source.indexOf("    window.addEventListener('resize'")), depthContext);
depthContext.api.refreshHeadingDepth(); assert.equal(depthStyle.value, '0.0px');
depthContext.window.scrollY = 80;
for(let i=0;i<100;i++) depthScroll();
assert.equal(frames.size,1); frames.values().next().value(); frames.clear();
assert.equal(depthStyle.value, '80.0px');
depthContext.window.scrollY = 5000; depthContext.api.paintHeadingDepth(); assert.equal(depthStyle.value, '200.0px');
for(let i=0;i<2;i++) {
    headingEntries([{ target:depthHeading,isIntersecting:false }]); assert.equal(headingClasses.has('is-heading-visible'),false);
    depthContext.window.scrollY = 0; depthContext.api.paintHeadingDepth(); assert.equal(depthStyle.value,'0.0px');
    headingEntries([{ target:depthHeading,isIntersecting:true }]); assert.equal(headingClasses.has('is-heading-visible'),true);
    depthContext.window.scrollY = 80; depthContext.api.paintHeadingDepth(); assert.equal(depthStyle.value,'80.0px');
}
depthContext.motion.matches = true; depthContext.api.refreshHeadingDepth(); assert.equal(depthStyle.value,null);
depthScroll(); assert.equal(frames.size,0);
depthContext.motion.matches = false; depthContext.api.refreshHeadingDepth(); depthScroll();
assert.equal(frames.size,1);
depthContext.document.querySelector = () => null;
depthContext.api.refreshHeadingDepth(); assert.equal(frames.size,0); assert.equal(depthStyle.value,null);
assert.equal(headingObserved.length,0); assert.equal(headingClasses.size,0);

const [css, layout, biology, html, worker, pkg, android, ios, extension] = await Promise.all(['css/rhine-lab-navigation.css','css/rhine-lab-layout.css','css/rhine-lab-biology.css','index.html','sw.js','package.json','android/app/build.gradle','ios/App/App.xcodeproj/project.pbxproj','browser-extension/manifest.json'].map(read));
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /body\.navigation-dock \.sidebar \.nav-item\.active::after/);
assert.match(css, /rhineHeadingCopyIn/);
assert.match(css, /rhineHeadingArtIn/);
assert.match(css, /page-heading,\.dashboard-hero\) \* \{ animation:none !important/);
assert.match(css, /data-depth="far"[^}]*\.9/);
assert.match(css, /data-depth="mid"[^}]*\.45/);
assert.match(css, /data-depth="near"[^}]*\.12/);
assert.match(css, /--heading-travel:0px !important/);
const atlas = await read('images/theme-atlas/rhine-life-science-atlas-v1.svg');
assert.equal((atlas.match(/data-view=/g) || []).length,10);
for(const depth of ['far','mid','near']) assert.equal((atlas.match(new RegExp('data-depth="' + depth + '"','g')) || []).length,10);
assert.ok(worker.includes('images/theme-atlas/rhine-life-science-atlas-v1.svg?v=0.4.2-depth1'));
const collage = await read('images/theme-atlas/all-lives-heading-art-v1.svg');
for(const view of ['dashboard','experiments','mice','reagents']) assert.ok(collage.includes('data-view="' + view + '"'));
for(const depth of ['far','mid','near']) assert.equal((collage.match(new RegExp('data-depth="' + depth + '"','g')) || []).length,4);
assert.doesNotMatch(collage, /<text\b/);
assert.ok(worker.includes('images/theme-atlas/all-lives-heading-art-v1.svg?v=0.4.2-depth2'));
assert.match(css,/sidebar-foot[^}]*background:transparent !important/);
assert.match(css,/navigation-mode-toggle \{[^}]*background:transparent !important/);
assert.match(css,/100% \+ 20px/);
assert.match(css,/page-heading,\.dashboard-hero\) > :first-child \{ transform:none/);
assert.match(css,/technical-heading > div:first-child:not\(\.heading-visual\) \{ align-self:flex-start/);
assert.match(html,/id="keyboardShortcutHelp"[^>]*data-i18n-skip/);
assert.match(html,/dock-page-hint-prev[^>]*>‹ <kbd>A<\/kbd>/);
assert.match(html,/dock-page-hint-next[^>]*><kbd>D<\/kbd> ›/);
assert.doesNotMatch(html,/navigation-mode-key|systemConnectionLabel|class="system-status"/);
assert.match(source,/toggle.dataset.navLabel = label;/);
assert.doesNotMatch(source,/' · F2'/);
assert.doesNotMatch(source,/['"]f2['"]|['"]F2['"]/);
assert.match(source,/aria-keyshortcuts', shortcutMode \? shortcuts.get\('navigation'\)/);
assert.doesNotMatch(source,/Alt\+Shift|key === 'alt'|addEventListener\('keyup'/);
assert.match(source,/Never consume modifier chords/);
assert.doesNotMatch(source,/const candidates = \[/);
assert.match(html,/id="shortcutSettingsDialog"/);
assert.ok(html.indexOf('js/rhine-lab-shortcuts.js') < html.indexOf('js/rhine-lab-navigation.js'));
assert.match(css,/keyboard-action-hint \{[^}]*padding:3px 6px[^}]*font:800 12px/);
assert.match(css,/keyboard-action-hint\.is-current \{[^}]*font-size:13px/);
assert.match(css,/is-heading-visible/);
assert.match(source, /Place at bottom.*放在底部/);
assert.match(html, /<span>放在底部<\/span>/);
const headingStyles = await read('css/rhine-dashboard-refresh.css');
assert.match(headingStyles, /heading-visual:not\(\.heading-visual-layout\)\) \{[^}]*aspect-ratio: 2 \/ 1/);
assert.match(layout, /\.lab-layout-empty p \{[^}]*700[^}]*var\(--font-interface\)/);
assert.match(biology, /\.housing-room-tab small\{font-family:var\(--font-interface\);font-weight:700\}/);
for (const [, asset] of html.matchAll(/(?:src|href)="((?:css|js)\/[^"?]+\?v=[^"]+)"/g)) assert.ok(worker.includes(asset), asset);
assert.equal(JSON.parse(pkg).version, '0.4.2');
assert.equal(JSON.parse(extension).version, '0.4.2');
const distributions = await read('.github/workflows/desktop-distributions.yml');
assert.ok(distributions.includes("require('./browser-extension/manifest.json').version"));
assert.ok(distributions.includes('Rhine-Lab-Browser-Extension-$version.zip'));
assert.ok(distributions.includes('path: dist/release-*/*.zip'));
assert.doesNotMatch(distributions, /release-0\.4\.1|Extension-0\.4\.1/);
assert.match(android, /versionCode 42\s+versionName "0.4.2"/);
assert.equal((ios.match(/MARKETING_VERSION = 0.4.2/g) || []).length, 2);
const assistant = await read('js/rhine-lab-assistant.js');
const collision = { window:{ innerHeight:844 }, document:{ querySelector:() => ({ getBoundingClientRect:() => ({ left:8,right:382,top:770 }) }) } };
vm.runInNewContext(assistant.slice(assistant.indexOf('    function characterBottom('), assistant.indexOf('    function placeCharacter(')) + ';result=[characterBottom(310,70),characterBottom(400,70)]', collision);
assert.deepEqual(Array.from(collision.result), [762,844]);
console.log('Navigation guards, grouped shortcuts, external hint placement, bounded layered parallax, dock motion, heading entrances, fonts and 0.4.2 metadata passed.');
