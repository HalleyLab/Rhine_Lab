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
    clearHints:() => calls.push('clear'), showHints:() => calls.push('hints'), hints:[],
    dock:true, motion:{ matches:false }, dockFrame:0, dockPointer:null, dockCenters:buttons.map((_,index) => index * 52),
    requestAnimationFrame:callback => { frames.set(++frameId,callback); return frameId; }, cancelAnimationFrame:id => frames.delete(id)
};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf("    document.addEventListener('keydown'"), source.indexOf("    document.addEventListener('keyup'")), context);
const key = (value, options = {}) => {
    const event = { key:value, target, preventDefault() { this.prevented = true; }, ...options };
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
context.hints = [{ key:'q', button:create }]; key('q', { altKey:true }); assert.deepEqual(calls.splice(0), ['clear','new']);

vm.runInContext(source.slice(source.indexOf("    nav.addEventListener('pointermove'"), source.indexOf('    const cards =')), context);
for (let index=0; index<100; index++) handlers.pointermove({ clientX:index, pointerType:'mouse' });
assert.equal(frames.size, 1);
frames.values().next().value(); frames.clear();
assert.ok(Number(buttons[2].style.values['--dock-scale']) > Number(buttons[1].style.values['--dock-scale']));
assert.equal(Number(buttons[9].style.values['--dock-scale']), 1);
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

const shifts = [];
Object.assign(context, { heading:{ style:{ getPropertyValue:() => shifts.at(-1), setProperty:(_,value) => shifts.push(value) } }, headingTop:100, scrollFrame:1, window:{ scrollY:200 } });
vm.runInContext(source.slice(source.indexOf('    function paintParallax('), source.indexOf('    function refreshView(')), context);
context.paintParallax(); assert.deepEqual(shifts, []);
context.motion.matches = false; context.paintParallax(); assert.deepEqual(shifts, ['24px']);
context.paintParallax(); assert.equal(shifts.length, 1, 'Do not invalidate styles when the offset is unchanged');
context.window.scrollY = 2000; context.paintParallax(); assert.equal(shifts.at(-1), '36px');

const [css, layout, biology, html, worker, pkg, android, ios, extension] = await Promise.all(['css/rhine-lab-navigation.css','css/rhine-lab-layout.css','css/rhine-lab-biology.css','index.html','sw.js','package.json','android/app/build.gradle','ios/App/App.xcodeproj/project.pbxproj','browser-extension/manifest.json'].map(read));
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /body\.navigation-dock \.sidebar \.nav-item\.active::after/);
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
console.log('Navigation guards, button shortcuts, dock animation, card observers, parallax, typography and 0.4.2 metadata passed.');
