(function () {
    'use strict';
    const definitions = [
        { id:'previousPage', label:['上一页面','Previous page'], value:'A', aliases:['ArrowLeft'] },
        { id:'nextPage', label:['下一页面','Next page'], value:'D', aliases:['ArrowRight'] },
        { id:'newEntry', label:['新建条目','New entry'], value:'N' },
        { id:'navigation', label:['侧栏 / 停靠栏','Sidebar / dock'], value:'Alt+G', alt:true },
        { id:'create', label:['新建操作组','Create actions'], value:'Alt+N', alt:true },
        { id:'edit', label:['编辑操作组','Edit actions'], value:'Alt+E', alt:true },
        { id:'delete', label:['删除操作组','Delete actions'], value:'Alt+X', alt:true },
        { id:'save', label:['保存操作组','Save actions'], value:'Alt+S', alt:true },
        { id:'view', label:['查看操作组','View actions'], value:'Alt+V', alt:true },
        { id:'other', label:['其他操作组','Other actions'], value:'Alt+A', alt:true },
        { id:'previousAction', label:['同组上一项','Previous action'], value:'Alt+ArrowUp', aliases:['Alt+ArrowLeft'], alt:true },
        { id:'nextAction', label:['同组下一项','Next action'], value:'Alt+ArrowDown', aliases:['Alt+ArrowRight'], alt:true },
        { id:'confirmAction', label:['执行选中操作','Activate selected action'], value:'Alt+Enter', alt:true },
        { id:'search', label:['搜索','Search'], value:'Ctrl+K', modified:true },
        { id:'saveDialog', label:['保存条目弹窗','Save entry dialog'], value:'Ctrl+Enter', modified:true }
    ];
    const defaults = Object.fromEntries(definitions.map(item => [item.id,item.value]));
    const storageKey = 'rhineLabKeyboardShortcutsV1';
    const modifiers = ['Ctrl','Alt','Shift'];
    function normalize(value) {
        if (typeof value !== 'string' || value.length > 64) return null;
        if (!value.trim()) return '';
        const parts = value.trim().split('+').map(part => part.trim().toLowerCase());
        const key = parts.pop();
        const aliases = { control:'Ctrl',ctrl:'Ctrl',cmd:'Ctrl',command:'Ctrl',meta:'Ctrl',alt:'Alt',option:'Alt',shift:'Shift' };
        const mods = parts.map(part => aliases[part]);
        if (mods.some(mod => !mod) || new Set(mods).size !== mods.length) return null;
        const special = { arrowleft:'ArrowLeft',left:'ArrowLeft',arrowright:'ArrowRight',right:'ArrowRight',arrowup:'ArrowUp',up:'ArrowUp',arrowdown:'ArrowDown',down:'ArrowDown',enter:'Enter',return:'Enter',escape:'Escape',esc:'Escape',space:'Space',tab:'Tab',delete:'Delete',backspace:'Backspace',home:'Home',end:'End',pageup:'PageUp',pagedown:'PageDown' };
        const name = /^[a-z0-9]$|^f(?:[1-9]|1[0-2])$/.test(key) ? key.toUpperCase() : special[key];
        return name ? [...modifiers.filter(mod => mods.includes(mod)),name].join('+') : null;
    }
    function chord(event) {
        let key = event.key;
        if (/^(Key[A-Z]|Digit[0-9])$/.test(event.code || '')) key = event.code.replace(/^(Key|Digit)/,'');
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
            if (item.alt && !value.split('+').includes('Alt')) errors.push({ id:item.id,code:'alt' });
            if (item.modified && !value.includes('Ctrl+') && !value.includes('Alt+')) errors.push({ id:item.id,code:'modified' });
            // Global OS hooks cannot be enumerated in a browser; reject common reserved combinations.
            const numbered = /^(?:(?:Ctrl|Alt)(?:\+Shift)?\+)?[0-9]$/.test(value);
            const nativeKey = /^(?:Escape|Tab|Enter|Space|F(?:[1-9]|1[0-2]))$/.test(value);
            const system = /^(?:Alt\+(?:Shift\+)?(?:F[0-9]+|Tab|Space|Escape)|Ctrl\+(?:Shift\+)?Escape|Ctrl\+Alt\+Delete)$/.test(value);
            const browser = /^(?:Ctrl\+(?:[RWLTPOSFHJNUACVXZYQDBEIG]|Tab|Backspace|Delete)|Ctrl\+Shift\+(?:[RWTNIPJCZABDEOQHVGK]|Tab))$/.test(value);
            const history = /^Alt\+Arrow(?:Left|Right)$/.test(value) && !item.aliases?.includes(value);
            if (numbered || nativeKey || system || browser || history) errors.push({ id:item.id,code:'reserved' });
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
        const stored = JSON.parse(localStorage.getItem(storageKey));
        if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
            const candidate = Object.fromEntries(definitions.map(item => [item.id,stored[item.id] ?? item.value]));
            if (!validate(candidate).length) bindings = Object.fromEntries(definitions.map(item => [item.id,normalize(candidate[item.id])]));
        }
    } catch (_) { /* Keep defaults when preference storage is unavailable or invalid. */ }
    function matches(event, id) {
        const value = bindings[id];
        if (!value) return false;
        const key = chord(event);
        return key === value || (definitions.find(item => item.id === id)?.aliases || []).includes(key);
    }
    window.RhineLabShortcuts = Object.freeze({
        definitions, defaults, normalize, chord, validate, matches,
        get:id => bindings[id],
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
