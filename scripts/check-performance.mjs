import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const [i18n, app, layout, html, css, worker, bootstrap] = await Promise.all([
    'js/rhine-lab-i18n.js', 'js/rhine-lab.js', 'js/rhine-lab-layout.js', 'index.html',
    'css/rhine-lab.css', 'sw.js', 'js/rhine-lab-bootstrap.js'
].map(file => readFile(new URL('../' + file, import.meta.url), 'utf8')));

// A tooltip or drag preview must not retranslate all of document.body.
const translated = [], jobs = [];
let notify;
const body = { nodeType: 1, isConnected: true, parentNode: null };
const parent = { nodeType: 1, isConnected: true, parentNode: body };
const child = { nodeType: 1, isConnected: true, parentNode: parent };
const text = { nodeType: 3, isConnected: true, parentNode: child };
vm.runInNewContext(i18n.slice(i18n.indexOf('    function observeChanges()'), i18n.indexOf('    window.RhineLabI18n =')) + '\nobserveChanges();', {
    document: { body }, Node: { ELEMENT_NODE: 1 },
    MutationObserver: class { constructor(callback) { notify = callback; } observe() {} },
    queueMicrotask: callback => jobs.push(callback), applyTree: root => translated.push(root)
});
notify([{ type: 'childList', target: body, addedNodes: [child] }]);
jobs.shift()(); assert.deepEqual(translated.splice(0), [child]);
notify([{ type: 'characterData', target: text }, { type: 'attributes', target: child }, { type: 'childList', target: body, addedNodes: [parent] }]);
assert.equal(jobs.length, 1);
jobs.shift()(); assert.deepEqual(translated.splice(0), [parent]);
notify([{ type: 'childList', target: body, addedNodes: [{ isConnected: false }] }]);
jobs.shift()(); assert.equal(translated.length, 0);
notify([{ type: 'characterData', target: text }]);
jobs.shift()(); assert.deepEqual(translated.splice(0), [text]);

// Cached formatters preserve both locales and rounding, including language switches.
let locale = 'zh-CN', constructions = 0;
const quantity = vm.runInNewContext(app.match(/function formatQuantity\(value\) \{[\s\S]*?\n    \}/)[0] + '; formatQuantity;', {
    quantityFormatters: new Map(), interfaceLocale: () => locale,
    Intl: { NumberFormat: function (...args) { constructions++; return new Intl.NumberFormat(...args); } }
});
for (locale of ['zh-CN', 'en-US', 'zh-CN']) {
    for (const value of [0, 1234.56789, -0.1255, '', null, NaN, Infinity]) {
        assert.equal(quantity(value), Number(value || 0).toLocaleString(locale, { maximumFractionDigits: 3 }));
    }
}
assert.equal(constructions, 2);

// Many pointer moves per frame are coalesced; release flushes the final target.
const handlers = {}, frames = new Map(), hits = [];
let frameId = 0, saves = 0;
const classes = { add() {}, remove() {} };
const rack = { dataset: { storageUnit: 'unit', storageShelf: '1', storageRack: '1' }, classList: classes, setPointerCapture() {}, cloneNode: () => ({ style: {}, setAttribute() {}, remove() {} }) };
const unit = { id: 'unit', history: [] };
const context = {
    document: { addEventListener: (name, callback) => handlers[name] = callback, querySelectorAll: () => [], elementFromPoint: () => null, body: { appendChild() {} } },
    window: { requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; }, cancelAnimationFrame: id => frames.delete(id), setTimeout() {} },
    state: { coldStorageUnits: [unit], freezerBoxes: [] }, dragInteractionsLocked: () => false,
    coldStorageLevel: () => ({}), coldStorageRackPosition: () => ({ row: 1, column: 1 }), coldStorageRackLayout: () => ({ rows: 4, columns: 4 }),
    coldStorageBoxRack: () => 1, openColdStorageDeviceDuringDrag: () => false,
    coldStorageDeviceTargetAt: (x, y) => { hits.push([x, y]); return { unitId: 'unit', shelf: 2, row: 1, column: 1 }; },
    coldStorageRackDropPlan: () => ({ valid: true, rackMoves: [], targetBoxes: [] }), coldStorageApplyRackDrop: () => 1,
    localStorage: { setItem() {} }, addActivity() {}, saveState: () => saves++, renderSamples() {}
};
vm.runInNewContext(app.slice(app.indexOf('    function bindColdStorageRackGridDrag()'), app.indexOf('    function housingHitAt(')) + '\nbindColdStorageRackGridDrag();', context);
const pointer = (x, type = 'pointermove', pointerId = 1) => ({ pointerId, button: 0, clientX: x, clientY: x + 1, type, preventDefault() {}, target: { closest: () => rack } });
handlers.pointerdown(pointer(0, 'pointerdown'));
for (let x = 10; x <= 100; x += 10) handlers.pointermove(pointer(x));
assert.equal(frames.size, 1); assert.equal(hits.length, 0);
handlers.pointermove(pointer(300, 'pointermove', 2));
handlers.pointerup(pointer(100, 'pointerup'));
assert.deepEqual(hits, [[100, 101]]); assert.equal(frames.size, 0); assert.equal(saves, 1);
handlers.pointerdown(pointer(0, 'pointerdown'));
handlers.pointermove(pointer(200));
handlers.pointercancel(pointer(200, 'pointercancel'));
assert.equal(hits.length, 1); assert.equal(frames.size, 0); assert.equal(saves, 1);

// Layout panning also consumes only the latest pointer position in each frame.
const layoutHandlers = {}, viewport = { scrollLeft: 0, scrollTop: 0 };
vm.runInNewContext(layout.slice(layout.indexOf('    let gestureFrame ='), layout.indexOf("    root.addEventListener('pointerup'")), {
    root: { addEventListener: (name, callback) => layoutHandlers[name] = callback }, window: context.window,
    gesture: { mode: 'pan', pointerId: 1, viewport, scrollX: 0, scrollY: 0, clientX: 0, clientY: 0 }
});
for (let x = 1; x <= 100; x++) layoutHandlers.pointermove(pointer(x));
assert.equal(frames.size, 1); assert.equal(viewport.scrollLeft, 0);
const [id, draw] = frames.entries().next().value; frames.delete(id); draw();
assert.equal(viewport.scrollLeft, -100); assert.equal(viewport.scrollTop, -101);
assert.match(layout, /cancelAnimationFrame\(gestureFrame\);\s*flushGestureMove\(\);\s*const previous = gesture/);
assert.match(layout, /gestureFrame = 0; pendingGestureMove = null/);
assert.doesNotMatch(css.match(/\.view \{[^}]+\}/)[0], /animation:/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(html, /class="story-quote">“工作中就该保持安静、专注。”<cite>——塞雷娅/);
assert.match(i18n, /Everyone should be quiet and focused during work/);
for (const [, path] of html.matchAll(/(?:src|href)="((?:css|js)\/[^"?]+\?v=[^"]+)"/g)) assert.ok(worker.includes(path), path);
assert.ok(worker.includes(bootstrap.match(/script.src = '([^']+)'/)[1]));
console.log('Incremental translations, cached formatting, frame-coalesced drags, motion and asset cache checks passed.');
