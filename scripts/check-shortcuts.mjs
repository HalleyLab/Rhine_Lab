import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../js/rhine-lab-shortcuts.js',import.meta.url),'utf8');
const storage = new Map();
let failStorage = false;
function load() {
    const context = { window:{dispatchEvent(){}}, CustomEvent:class{}, localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>{if(failStorage)throw Error('Storage blocked');storage.set(key,value);}} };
    vm.runInNewContext(source,context);
    return context.window.RhineLabShortcuts;
}
let api = load();
assert.equal(api.validate(api.defaults).length,0);
for (const [input,expected] of [[' alt + g ','Alt+G'],['cmd+k','Ctrl+K'],['Ctrl+Shift+q','Ctrl+Shift+Q'],['left','ArrowLeft'],['',''],['Ctrl+Ctrl+A',null],['Alt+',null],['anything',null],[null,null],['a'.repeat(65),null]]) assert.equal(api.normalize(input),expected);
assert.ok(api.validate(null).length);
const key = (key,extra={}) => ({key,...extra});
assert.equal(api.matches(key('©',{altKey:true,code:'KeyG'}),'navigation'),true);
assert.equal(api.matches(key('k',{metaKey:true}),'search'),true);
assert.equal(api.matches(key('g'),'navigation'),false);
assert.equal(api.matches(key('F2',{altKey:true}),'navigation'),false);
for (const [id,value,code] of [['navigation','Alt+E','duplicate'],['search','Ctrl+W','reserved'],['navigation','Alt+F2','reserved'],['newEntry','Ctrl+Shift+Escape','reserved'],['newEntry','Alt+Tab','reserved'],['newEntry','1','reserved'],['newEntry','Ctrl+1','reserved'],['newEntry','Alt+Shift+1','reserved'],['create','Ctrl+Q','alt'],['search','K','modified'],['newEntry','Ctrl++','invalid'],['edit','Alt+ArrowLeft','reserved']]) {
    const errors = api.validate({...api.defaults,[id]:value});
    assert.ok(errors.some(error=>error.id===id&&error.code===code),JSON.stringify(errors));
    assert.equal(api.save({...api.defaults,[id]:value}).ok,false);
}
const duplicates = api.validate({...api.defaults,navigation:'Alt+E'});
assert.ok(duplicates.some(item=>item.id==='edit'&&item.other==='navigation'));
const customized = {...api.defaults,navigation:'Alt+H',edit:'Alt+B',previousPage:'Q',nextPage:'R',newEntry:'T'};
assert.equal(api.save(customized).ok,true);
assert.equal(api.command(key('h',{altKey:true})),'navigation');
assert.equal(api.command(key('g',{altKey:true})),undefined);
assert.equal(api.command(key('b',{altKey:true})),'edit');
assert.equal(api.command(key('q')),'previousPage');
assert.equal(api.command(key('ArrowLeft')),'previousPage');
api = load(); assert.equal(api.get('navigation'),'Alt+H');
assert.equal(api.save({...customized,navigation:''}).ok,true);
assert.equal(api.matches(key('h',{altKey:true}),'navigation'),false);
failStorage = true;
assert.equal(api.save(api.defaults).storage,true);
assert.equal(api.get('navigation'),'');
failStorage = false;
storage.set('rhineLabKeyboardShortcutsV1','not json'); api=load(); assert.equal(api.get('navigation'),'Alt+G');
storage.set('rhineLabKeyboardShortcutsV1',JSON.stringify({...api.defaults,navigation:'Alt+E'})); api=load(); assert.equal(api.get('navigation'),'Alt+G');
console.log('Shortcut validation, duplicate detection, reserved keys, remapping, aliases, persistence, disable and storage recovery passed.');
