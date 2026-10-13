(function () {
    'use strict';
    const definitions = [
        { id:'mode', label:['进入 / 退出快捷键模式','Enter / exit shortcut mode'], value:'Backquote' },
        { id:'previousPage', label:['上一页面（也可直接按）','Previous page (also works directly)'], value:'A', aliases:['ArrowLeft'] },
        { id:'nextPage', label:['下一页面（也可直接按）','Next page (also works directly)'], value:'D', aliases:['ArrowRight'] },
        { id:'navigation', label:['侧栏 / 停靠栏','Sidebar / dock'], value:'G' },
        { id:'create', label:['新建操作组','Create actions'], value:'N' },
        { id:'edit', label:['编辑操作组','Edit actions'], value:'E' },
        { id:'delete', label:['删除操作组','Delete actions'], value:'X' },
        { id:'save', label:['保存操作组','Save actions'], value:'S' },
        { id:'view', label:['查看操作组','View actions'], value:'V' },
        { id:'other', label:['其他操作组','Other actions'], value:'O' },
        { id:'previousAction', label:['同组上一项','Previous action'], value:'ArrowUp' },
        { id:'nextAction', label:['同组下一项','Next action'], value:'ArrowDown' },
        { id:'confirmAction', label:['执行选中操作','Activate selected action'], value:'Enter' },
        { id:'search', label:['搜索','Search'], value:'K' }
    ];
    const defaults = Object.fromEntries(definitions.map(item => [item.id,item.value]));
    const storageKey = 'rhineLabKeyboardShortcutsV2';
    const modifiers = ['Ctrl','Alt','Shift'];
    function normalize(value) {
        if (typeof value !== 'string' || value.length > 64) return null;
        if (!value.trim()) return '';
        const parts = value.trim().split('+').map(part => part.trim().toLowerCase());
        const key = parts.pop();
        const aliases = { control:'Ctrl',ctrl:'Ctrl',cmd:'Ctrl',command:'Ctrl',meta:'Ctrl',alt:'Alt',option:'Alt',shift:'Shift' };
        const mods = parts.map(part => aliases[part]);
        if (mods.some(mod => !mod) || new Set(mods).size !== mods.length) return null;
        const special = { '`':'Backquote',backquote:'Backquote',arrowleft:'ArrowLeft',left:'ArrowLeft',arrowright:'ArrowRight',right:'ArrowRight',arrowup:'ArrowUp',up:'ArrowUp',arrowdown:'ArrowDown',down:'ArrowDown',enter:'Enter',return:'Enter',escape:'Escape',esc:'Escape',space:'Space',tab:'Tab',delete:'Delete',backspace:'Backspace',home:'Home',end:'End',pageup:'PageUp',pagedown:'PageDown' };
        const name = /^[a-z0-9]$|^f(?:[1-9]|1[0-2])$/.test(key) ? key.toUpperCase() : special[key];
        return name ? [...modifiers.filter(mod => mods.includes(mod)),name].join('+') : null;
    }
    function chord(event) {
        let key = event.key;
        if (/^(Key[A-Z]|Digit[0-9])$/.test(event.code || '')) key = event.code.replace(/^(Key|Digit)/,'');
        if (event.code === 'Backquote') key = 'Backquote';
        if (key === ' ') key = 'Space';
        return normalize([event.ctrlKey || event.metaKey ? 'Ctrl' : '',event.altKey ? 'Alt' : '',event.shiftKey ? 'Shift' : '',key].filter(Boolean).join('+'));
    }
    function validate(input) {
        input = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
        const errors = [], owners = new Map();
        definitions.forEach(item => {
            const value = normalize(input[item.id]);
            if (value === null) { errors.push({ id:item.id,code:'invalid' }); return; }
            if (!value) return;
            if (value.includes('+')) { errors.push({ id:item.id,code:'single' }); return; }
            // Sequential, unmodified keys avoid browser/OS modifier chords entirely.
            if (/^[0-9]$|^(?:Escape|Tab|Space|Delete|Backspace|Home|End|PageUp|PageDown|F[0-9]+)$/.test(value) || value === 'Enter' && item.id !== 'confirmAction') errors.push({ id:item.id,code:'reserved' });
            [value,...(item.aliases || [])].forEach(binding => {
                const other = owners.get(binding);
                if (other && other !== item.id) {
                    errors.push({ id:item.id,code:'duplicate',other });
                    errors.push({ id:other,code:'duplicate',other:item.id });
                } else owners.set(binding,item.id);
            });
        });
        return errors;
    }
    let bindings = { ...defaults };
    try {
        const raw = localStorage.getItem(storageKey);
        const stored = JSON.parse(raw ?? localStorage.getItem('rhineLabKeyboardShortcutsV1') ?? 'null');
        if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
            const candidate = Object.fromEntries(definitions.map(item => {
                let value = stored[item.id] ?? item.value;
                if (raw == null) {
                    value = item.id === 'mode' ? item.value : value.replace(/^(?:Alt|Ctrl)\+/,'');
                    if (item.id === 'other' && value === 'A') value = item.value;
                }
                return [item.id,value];
            }));
            if (!validate(candidate).length) bindings = Object.fromEntries(definitions.map(item => [item.id,normalize(candidate[item.id])]));
        }
    } catch (_) { /* Keep defaults when preference storage is unavailable or invalid. */ }
    function matches(event, id) {
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;
        const value = bindings[id];
        if (!value) return false;
        const key = chord(event);
        return key === value || (definitions.find(item => item.id === id)?.aliases || []).includes(key);
    }
    window.RhineLabShortcuts = Object.freeze({
        definitions, defaults, normalize, chord, validate, matches,
        get:id => bindings[id],
        display:value => value === 'Backquote' ? '`' : value,
        command:event => definitions.find(item => matches(event,item.id))?.id,
        save(input) {
            const errors = validate(input);
            if (errors.length) return { ok:false,errors };
            const next = Object.fromEntries(definitions.map(item => [item.id,normalize(input[item.id])]));
            try { localStorage.setItem(storageKey,JSON.stringify(next)); } catch (_) { return { ok:false,storage:true }; }
            bindings = next;
            window.dispatchEvent(new CustomEvent('rhine:shortcutschange'));
            return { ok:true };
        }
    });
}());
