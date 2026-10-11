import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const source = await read('js/rhine-lab-navigation.js');
const handlers = {}, calls = [], frames = new Map();
let frameId = 0, blocked = false, typing = false, editing = false, control = false, dialog = null;
const target = { closest(selector) {
    if (selector === 'editable') return typing;
    if (selector === 'editor') return editing;
    if (selector === 'dialog[open]') return dialog;
    return control;
} };
const create = { click: () => calls.push('new') };
const buttons = Array.from({ length:10 }, (_, index) => ({ classList:{ contains:() => index === 0 }, click:() => calls.push(index), style:{ values:{}, setProperty(key,value) { this.values[key] = value; }, removeProperty(key) { delete this.values[key]; } } }));
const context = {
    document:{ addEventListener:(type, handler) => handlers[type] = handler, querySelectorAll:() => [create], querySelector:() => dialog },
    nav:{ addEventListener:(type, handler) => handlers[type] = handler },
    buttons, toggle:{ click:() => calls.push('toggle') }, overlay:() => blocked,
    editable:'editable', editor:'editor', visible:element => !!element && !element.disabled,
    clearHints:() => calls.push('clear'), showHints:() => calls.push('hints'), selectedAction:null,
    selectAction:(key, step = 0) => calls.push([key,step]),
    dock:true, motion:{ matches:false }, dockFrame:0, dockPointer:null, dockCenters:buttons.map((_,index) => index * 52),
    requestAnimationFrame:callback => { frames.set(++frameId,callback); return frameId; }, cancelAnimationFrame:id => frames.delete(id)
};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf("    document.addEventListener('keydown'"), source.indexOf("    document.addEventListener('keyup'")), context);
const key = (value, options = {}) => {
    const event = { key:value, target, preventDefault() { this.prevented = this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...options };
    handlers.keydown(event);
    return event;
};
key('ArrowRight'); assert.deepEqual(calls.splice(0), [1]);
key('a'); assert.deepEqual(calls.splice(0), [9]);
for (const name of ['typing','editing','blocked','control']) {
    typing = name === 'typing'; editing = name === 'editing'; blocked = name === 'blocked'; control = name === 'control';
    key('ArrowRight'); assert.deepEqual(calls, [], name);
}
typing = editing = blocked = control = false;
key('d', { isComposing:true }); key('a', { repeat:true }); key('a', { defaultPrevented:true }); key('a', { ctrlKey:true });
assert.deepEqual(calls, []);
assert.equal(key('3', { altKey:true }).prevented, true); assert.deepEqual(calls.splice(0), ['clear',2]);
key('0', { altKey:true }); assert.deepEqual(calls.splice(0), ['clear',9]);
key('¡', { altKey:true, code:'Digit1' }); assert.deepEqual(calls.splice(0), ['clear',0]);
key('n'); assert.deepEqual(calls.splice(0), ['new']);
key('F2'); assert.deepEqual(calls.splice(0), ['toggle']);
key('Alt'); assert.deepEqual(calls.splice(0), ['hints']);
typing = true; key('n'); key('2', { altKey:true }); assert.deepEqual(calls, []);
const save = { click:() => calls.push('save') };
dialog = { querySelector:() => save }; blocked = true;
key('Enter', { ctrlKey:true }); assert.deepEqual(calls.splice(0), ['save']);
save.disabled = true; key('Enter', { ctrlKey:true }); assert.deepEqual(calls, []);
typing = false; key('ArrowLeft'); key('2', { altKey:true }); assert.deepEqual(calls, []);
key('Alt'); assert.deepEqual(calls.splice(0), ['hints']);
key('e', { altKey:true }); assert.deepEqual(calls.splice(0), [['e',0]], 'Choosing a group must not execute it');
context.selectedAction = { key:'e', button:create };
key('ArrowDown', { altKey:true }); assert.deepEqual(calls.splice(0), [['e',1]]);
key('ArrowUp', { altKey:true }); assert.deepEqual(calls.splice(0), [['e',-1]]);
assert.equal(key('Enter', { altKey:true }).stopped, true); assert.deepEqual(calls.splice(0), ['clear','new']);
context.selectedAction = null;
key('Enter', { altKey:true }); assert.deepEqual(calls, []);

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
    matches:() => false, closest:() => false, getBoundingClientRect:() => ({ left:20,right:200,top:40,bottom:80 }),
    focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; }, ...extra
});
let candidates = Array.from({ length:90 }, () => element({ 'data-edit-result':'' }));
let headingCopy = null, modal = null;
const groupContext = {
    document:{ querySelector:selector => selector === '.view.active' ? { querySelectorAll:() => candidates } : selector === 'dialog[open]' ? modal : headingCopy,
        createElement:() => ({ className:'', style:{}, setAttribute() {}, remove() {}, getBoundingClientRect:() => ({ width:110,height:31 }) }), body:{ appendChild() {} } },
    visible:button => !!button && !button.disabled, innerWidth:390, innerHeight:844,
    requestAnimationFrame() {}, cancelAnimationFrame() {}
};
vm.createContext(groupContext);
vm.runInContext(source.slice(source.indexOf('    let hints ='), source.indexOf("    document.addEventListener('keydown'")) + ';api={actionKey,showHints,selectAction,clearHints,get actions(){return actions},get selected(){return selectedAction},get hints(){return hints}};', groupContext);
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
assert.ok(candidates[1].focused && candidates[1].scrolled);
assert.equal(api.selectAction('x'), false); assert.equal(api.selected.button, candidates[1]);
assert.ok(api.hints.some(({ hint }) => hint.textContent === 'E 1/89 ↑↓ ↵'));
const activeHint = api.hints.find(({ hint }) => hint.className.includes('is-current')).hint;
assert.equal(activeHint.hidden, false);
assert.ok(parseFloat(activeHint.style.top) >= 88, 'Hints stay outside the target and its icons');
api.clearHints(); assert.equal(api.actions.length, 0); assert.equal(api.hints.length, 0);
assert.equal(candidates[1].classList.values.size, 0);
headingCopy = { getBoundingClientRect:() => ({ left:0,right:390,top:0,bottom:90 }) };
api.showHints(); api.selectAction('e');
assert.ok(parseFloat(api.hints.find(item => item.selected).hint.style.top)>=98, 'Move below copy when there is no space above the button');
api.clearHints(); headingCopy = null;
const dialogHints = [];
modal = { querySelectorAll:() => candidates, appendChild:hint => dialogHints.push(hint) };
candidates = [element({}, { id:'entrySubmitButton', closest:selector => selector === 'dialog[open]' ? modal : false })];
api.showHints(); api.selectAction('s'); assert.ok(dialogHints.includes(api.hints[0].hint), 'Hints must be inside the native dialog top layer');
api.clearHints(); modal = null;
// Disabled, hidden and dense diagram controls do not fill the action groups.
candidates = [element({}, { disabled:true }), element({}, { closest:() => true }), element({ 'aria-hidden':'true' }), element({}, { getBoundingClientRect:() => ({ left:20,right:200,top:900,bottom:940 }) })];
api.showHints(); assert.equal(api.actions.length, 1); assert.equal(api.hints.length, 0);
api.selectAction('a'); assert.ok(candidates[3].focused && candidates[3].scrolled);

// Visible header travel is bounded, frame-coalesced, and disabled for reduced motion.
const depthStyle = { value:null, setProperty(_, value) { this.value = value; }, removeProperty() { this.value = null; } };
let depthScroll;
const depthContext = {
    document:{ querySelector:() => ({ style:depthStyle, getBoundingClientRect:() => ({ top:100 - depthContext.window.scrollY,height:200 }) }) },
    window:{ scrollY:0, innerHeight:1000, addEventListener:(_, listener) => depthScroll = listener }, motion:{ matches:false }, actions:[], hintFrame:0,
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
depthContext.motion.matches = true; depthContext.api.refreshHeadingDepth(); assert.equal(depthStyle.value,null);
depthScroll(); assert.equal(frames.size,0);
depthContext.motion.matches = false; depthContext.api.refreshHeadingDepth(); depthScroll();
assert.equal(frames.size,1);
depthContext.document.querySelector = () => null;
depthContext.api.refreshHeadingDepth(); assert.equal(frames.size,0); assert.equal(depthStyle.value,null);

const [css, layout, biology, html, worker, pkg, android, ios, extension] = await Promise.all(['css/rhine-lab-navigation.css','css/rhine-lab-layout.css','css/rhine-lab-biology.css','index.html','sw.js','package.json','android/app/build.gradle','ios/App/App.xcodeproj/project.pbxproj','browser-extension/manifest.json'].map(read));
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /body\.navigation-dock \.sidebar \.nav-item\.active::after/);
assert.match(css, /rhineHeadingCopyIn/);
assert.match(css, /rhineHeadingArtIn/);
assert.match(css, /page-heading,\.dashboard-hero\) \* \{ animation:none !important/);
assert.match(css, /data-depth="far"[^}]*\.52/);
assert.match(css, /data-depth="mid"[^}]*\.30/);
assert.match(css, /data-depth="near"[^}]*\.12/);
assert.match(css, /--heading-travel:0px !important/);
assert.match(css, /font:800 14px/);
assert.match(css, /keyboard-action-hint\.is-current[^}]*font-size:15px/);
const atlas = await read('images/theme-atlas/rhine-life-science-atlas-v1.svg');
assert.equal((atlas.match(/data-view=/g) || []).length,10);
for(const depth of ['far','mid','near']) assert.equal((atlas.match(new RegExp('data-depth="' + depth + '"','g')) || []).length,10);
assert.ok(worker.includes('images/theme-atlas/rhine-life-science-atlas-v1.svg?v=0.4.2-depth1'));
assert.match(source, /Place at bottom.*放在底部/);
assert.match(html, /<span>放在底部<\/span>/);
const headingStyles = await read('css/rhine-dashboard-refresh.css');
assert.match(headingStyles, /heading-visual:not\(\.heading-visual-layout\)\) \{[^}]*aspect-ratio: 2 \/ 1/);
assert.match(layout, /\.lab-layout-empty p \{[^}]*700[^}]*var\(--font-interface\)/);
assert.match(biology, /\.housing-room-tab small\{font-family:var\(--font-interface\);font-weight:700\}/);
for (const [, asset] of html.matchAll(/(?:src|href)="((?:css|js)\/[^"?]+\?v=[^"]+)"/g)) assert.ok(worker.includes(asset), asset);
assert.equal(JSON.parse(pkg).version, '0.4.2');
assert.equal(JSON.parse(extension).version, '0.4.2');
assert.match(android, /versionCode 42\s+versionName "0.4.2"/);
assert.equal((ios.match(/MARKETING_VERSION = 0.4.2/g) || []).length, 2);
const assistant = await read('js/rhine-lab-assistant.js');
const collision = { window:{ innerHeight:844 }, document:{ querySelector:() => ({ getBoundingClientRect:() => ({ left:8,right:382,top:770 }) }) } };
vm.runInNewContext(assistant.slice(assistant.indexOf('    function characterBottom('), assistant.indexOf('    function placeCharacter(')) + ';result=[characterBottom(310,70),characterBottom(400,70)]', collision);
assert.deepEqual(Array.from(collision.result), [762,844]);
console.log('Navigation guards, grouped shortcuts, external hint placement, bounded layered parallax, dock motion, heading entrances, fonts and 0.4.2 metadata passed.');
