(function () {
    'use strict';

    const nav = document.querySelector('.primary-nav');
    const toggle = document.getElementById('navigationModeToggle');
    if (!nav || !toggle) return;
    const buttons = Array.from(nav.querySelectorAll('.nav-item'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width:820px), (max-width:1200px) and (max-height:700px) and (orientation:landscape)');
    const icons = {
        dashboard: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
        'lab-layout': '<path d="M3 3h18v18H3zM3 10h7V3m5 0v12h6M10 15v6"/>',
        experiments: '<path d="M8 3h8M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M7 15h10"/>',
        mice: '<path d="M7 8C1 7 3 1 7 3l3 4m4 0 3-4c4-2 6 4 0 5M5 13c0-8 14-8 14 0 0 5-3 8-7 8s-7-3-7-8Z"/><circle cx="9" cy="12" r=".6"/><circle cx="15" cy="12" r=".6"/><path d="m10 16 2 2 2-2"/>',
        bioinformatics: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
        cells: '<circle cx="12" cy="12" r="9"/><path d="M8 8c4-3 10 3 6 6s-9-3-6-6Z"/><path d="m7 16 .01 0M17 8h.01"/>',
        reagents: '<path d="M8 3h8v4H8zM9 7v3l-3 3v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7l-3-3V7M6 15h12"/>',
        samples: '<path d="M5 3h14v18H5zM5 10h14M8 6v1m0 7v3M14 13v5m-2-4 4 3m-4 0 4-3"/>',
        protocols: '<path d="M5 3h14v18H5zM9 7h6M9 11h6M9 15h4M3 6h4M3 12h4M3 18h4"/>',
        schedule: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 4h2"/>'
    };
    buttons.forEach(button => {
        button.insertAdjacentHTML('afterbegin', '<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">' + icons[button.dataset.view] + '</svg>');
    });
    const marker = document.createElement('div');
    marker.className = 'nav-hover-marker';
    marker.setAttribute('aria-hidden', 'true');
    nav.prepend(marker);
    let dock = false;
    let dockFrame = 0;
    let dockPointer = null;
    let dockCenters = [];

    function updateLabels() {
        const english = document.documentElement.lang === 'en';
        const label = dock ? (english ? 'Restore sidebar' : '还原侧栏') : (english ? 'Place at bottom' : '放在底部');
        const text = toggle.querySelector('span');
        const title = (dock ? (english ? 'Switch to sidebar' : '切换为侧边栏') : (english ? 'Switch to bottom dock' : '切换为底部停靠栏')) + ' · F2';
        if (text.textContent !== label) text.textContent = label;
        if (toggle.title !== title) toggle.title = title;
        if (toggle.getAttribute('aria-label') !== title) toggle.setAttribute('aria-label', title);
        toggle.setAttribute('aria-keyshortcuts', 'F2');
        toggle.setAttribute('aria-pressed', String(dock));
        buttons.forEach((button, index) => {
            const label = button.querySelector('span:not(.nav-code)').textContent;
            if (button.dataset.navLabel !== label) button.dataset.navLabel = label;
            if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
            button.setAttribute('aria-keyshortcuts', 'Alt+' + ((index + 1) % 10));
            const title = label + ' · Alt+' + ((index + 1) % 10);
            if (button.title !== title) button.title = title;
            if (button.classList.contains('active')) {
                if (!button.hasAttribute('aria-current')) button.setAttribute('aria-current', 'page');
            } else if (button.hasAttribute('aria-current')) button.removeAttribute('aria-current');
        });
    }

    function setDock(next) {
        dock = next;
        document.body.classList.toggle('navigation-dock', dock);
        document.body.classList.remove('sidebar-open');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', String(!dock && compact.matches));
        try { localStorage.setItem('rhineLabNavigationMode', dock ? 'dock' : 'sidebar'); } catch (_) { /* Navigation still works without preference storage. */ }
        resetDock();
        updateLabels();
        if (!dock && compact.matches) document.body.classList.add('sidebar-open');
        window.dispatchEvent(new CustomEvent('rhine:navigationchange'));
        if (!motion.matches) document.getElementById('sidebar').animate([
            { opacity:0, transform:dock ? 'translate(-50%,12px) scale(.96)' : 'translateX(-12px)' },
            { opacity:1, transform:dock ? 'translateX(-50%)' : 'translateX(0)' }
        ], { duration:220, easing:'cubic-bezier(.2,.7,.2,1)' });
    }
    toggle.addEventListener('click', () => setDock(!dock));
    document.getElementById('menuToggle')?.addEventListener('click', () => { if (dock) setDock(false); });
    try { dock = localStorage.getItem('rhineLabNavigationMode') === 'dock'; } catch (_) { /* Use the sidebar. */ }
    document.body.classList.toggle('navigation-dock', dock);
    updateLabels();

    function highlight(button) {
        if (!button || dock) return;
        nav.style.setProperty('--nav-hover-y', button.offsetTop + 'px');
        nav.style.setProperty('--nav-hover-height', button.offsetHeight + 'px');
        nav.classList.add('is-hovering');
    }
    function resetDock() {
        if (dockFrame) cancelAnimationFrame(dockFrame);
        dockFrame = 0;
        dockPointer = null;
        dockCenters = [];
        buttons.forEach(button => {
            button.style.removeProperty('--dock-scale');
            button.style.removeProperty('--dock-lift');
        });
    }
    nav.addEventListener('pointerenter', () => {
        if (dock) dockCenters = buttons.map(button => { const rect = button.getBoundingClientRect(); return rect.x + rect.width / 2; });
    });
    nav.addEventListener('pointerover', event => highlight(event.target.closest('.nav-item')));
    nav.addEventListener('focusin', event => {
        const button = event.target.closest('.nav-item');
        highlight(button);
        if (dock && button && !motion.matches) {
            resetDock();
            button.style.setProperty('--dock-scale', '1.18');
            button.style.setProperty('--dock-lift', '-2px');
        }
    });
    nav.addEventListener('focusout', () => { if (!nav.contains(document.activeElement)) { nav.classList.remove('is-hovering'); resetDock(); } });
    nav.addEventListener('pointerleave', () => { nav.classList.remove('is-hovering'); resetDock(); });
    nav.addEventListener('pointermove', event => {
        if (!dock || motion.matches || event.pointerType === 'touch') return;
        dockPointer = event.clientX;
        if (!dockFrame) dockFrame = requestAnimationFrame(() => {
            dockFrame = 0;
            if (dockCenters.length !== buttons.length) dockCenters = buttons.map(button => { const rect = button.getBoundingClientRect(); return rect.x + rect.width / 2; });
            buttons.forEach((button, index) => {
                const influence = Math.max(0, 1 - Math.abs(dockPointer - dockCenters[index]) / 116) ** 2;
                button.style.setProperty('--dock-scale', String(1 + influence * .18));
                button.style.setProperty('--dock-lift', (-influence * 2) + 'px');
            });
        });
    });

    const cards = '.metric-card,.project-row,.today-item,.activity-item,.experiment-record-entry,.protocol-card,.formulation-card,.cell-culture-card,.housing-room-tab,.cold-storage-tab,.freezer-box-tab,.bio-folder-card,.bio-script-file,.schedule-block,.plate-layout-item,.run-tool-card,.load-item';
    const seen = new WeakSet();
    let revealObserver;
    function observeCards(root) {
        if (motion.matches || !revealObserver || root.nodeType !== 1 || !root.closest('.view')) return;
        const found = root.matches(cards) ? [root] : Array.from(root.querySelectorAll(cards));
        found.forEach(card => {
            if (seen.has(card)) return;
            seen.add(card);
            card.classList.add('scroll-card');
            revealObserver.observe(card);
        });
    }
    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
        }), { threshold:.08 });
        const main = document.querySelector('main');
        new MutationObserver(records => records.forEach(record => {
            record.removedNodes.forEach(node => {
                if (node.nodeType !== 1 || node.isConnected) return;
                if (node.matches('.scroll-card')) revealObserver.unobserve(node);
                node.querySelectorAll('.scroll-card').forEach(card => revealObserver.unobserve(card));
            });
            record.addedNodes.forEach(observeCards);
        })).observe(main, { childList:true, subtree:true });
    }

    function refreshView() {
        clearHints();
        updateLabels();
        document.querySelectorAll('.view.active').forEach(observeCards);
    }
    window.addEventListener('scroll', () => {
        if (actions.length && !hintFrame) hintFrame = requestAnimationFrame(paintHints);
    }, { passive:true });
    window.addEventListener('resize', () => { resetDock(); refreshView(); });
    window.addEventListener('rhine:viewchange', refreshView);
    window.addEventListener('rhine:ready', refreshView);
    window.addEventListener('rhine:languagechange', updateLabels);
    motion.addEventListener('change', () => {
        resetDock();
        document.querySelectorAll('.scroll-card').forEach(card => card.classList.add('is-revealed'));
        refreshView();
    });

    const editable = 'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]';
    const editor = '#labLayoutWorkspace,.animal-rack-grid,.plant-rack-grid,.microbe-rack-grid,.housing-room-map,.cold-storage-stage,.freezer-grid,.plate-map,[role="slider"],[role="grid"]';
    const visible = element => !!(element && !element.disabled && !element.closest('[inert],[hidden]') && element.getClientRects().length);
    const overlay = () => document.querySelector('dialog[open],#searchOverlay:not([hidden]),#notificationPanel:not([hidden]),#utilityNav:not([hidden]),#assistantDrawer:not([hidden])');
    let hints = [];
    let actions = [];
    let selectedAction = null;
    let hintFrame = 0;
    function clearHints() {
        if (hintFrame) cancelAnimationFrame(hintFrame);
        hintFrame = 0;
        hints.forEach(({ hint }) => hint.remove());
        selectedAction?.button.classList.remove('keyboard-action-target');
        hints = [];
        actions = [];
        selectedAction = null;
    }
    function actionKey(button) {
        const names = button.getAttributeNames().join(' ');
        const id = button.id;
        const layout = button.dataset.layoutAction;
        if (/data-(add|new|create)(-|\b)/.test(names) || /^(add|new|create)|Add$/.test(id) || layout === 'new' || button.dataset.layoutTool === 'room') return 'n';
        if (/data-edit(-|\b)/.test(names) || /^(edit)|Edit/.test(id) || layout === 'rename') return 'e';
        if (/data-(delete|remove)(-|\b)/.test(names) || /^(delete)|Delete/.test(id) || layout?.startsWith('delete')) return 'x';
        if ((button.type === 'submit' && button.form) || /data-save(-|\b)/.test(names) || /^(save)|Submit/.test(id) || layout === 'save') return 's';
        if (button.matches('[role="tab"],.filter-tabs button,.calendar-modes button') || /data-(filter|[\w-]+-(tab|filter|mode))\b/.test(names)) return 'f';
        if (button.matches('[role="button"],summary,.row-arrow,.clickable-data-row,.protocol-card') || /data-(open|view-target|cold-storage|freezer-box|room-tab|layout-enter|[\w-]+-(id|record|toggle))\b/.test(names)) return 'v';
        return 'a';
    }
    function paintHints() {
        hintFrame = 0;
        hints.forEach(({ hint }) => hint.remove());
        hints = [];
        const group = selectedAction && actions.filter(action => action.key === selectedAction.key && visible(action.button));
        const positioned = actions.filter(action => visible(action.button)).map(action => ({ ...action, rect:action.button.getBoundingClientRect() })).filter(({ rect }) => rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth);
        positioned.forEach(({ key, button, rect }) => {
            const hint = document.createElement('kbd');
            const selected = button === selectedAction?.button;
            hint.className = 'keyboard-action-hint' + (selected ? ' is-current' : '');
            hint.setAttribute('aria-hidden', 'true');
            hint.textContent = key.toUpperCase() + (selected ? ' ' + (group.indexOf(selectedAction) + 1) + '/' + group.length + ' ↑↓ ↵' : '');
            hint.style.left = Math.max(2, Math.min(innerWidth - (selected ? 120 : 24), rect.right - (selected ? 110 : 16))) + 'px';
            hint.style.top = Math.max(2, rect.top - 4) + 'px';
            document.body.appendChild(hint);
            hints.push({ button, hint });
        });
    }
    function showHints() {
        clearHints();
        const scope = document.querySelector('dialog[open]') || document.querySelector('.view.active');
        if (!scope) return;
        actions = Array.from(scope.querySelectorAll('button,[role="button"],summary,.clickable-data-row[tabindex],.protocol-card[tabindex]')).filter(button => visible(button) && !button.closest('svg,.animal-rack-grid,.plant-rack-grid,.microbe-rack-grid,.cold-storage-device-level-slots,.cold-storage-map,.freezer-grid') && button.getAttribute('aria-hidden') !== 'true').map(button => ({ key:actionKey(button), button }));
        paintHints();
    }
    function selectAction(key, step = 0) {
        if (!actions.length) showHints();
        const group = actions.filter(action => action.key === key && visible(action.button));
        if (!group.length) return false;
        const index = group.indexOf(selectedAction);
        selectedAction?.button.classList.remove('keyboard-action-target');
        selectedAction = group[index < 0 ? 0 : (index + step + group.length) % group.length];
        selectedAction.button.classList.add('keyboard-action-target');
        selectedAction.button.focus({ preventScroll:true });
        selectedAction.button.scrollIntoView({ block:'nearest', inline:'nearest', behavior:'instant' });
        paintHints();
        return true;
    }
    document.addEventListener('keydown', event => {
        if (event.defaultPrevented || event.isComposing || event.repeat) return;
        let key = event.key.toLowerCase();
        if (event.altKey && !/^[a-z0-9]$/.test(key) && /^(Digit[0-9]|Key[A-Z])$/.test(event.code || '')) key = event.code.replace(/^(Digit|Key)/, '').toLowerCase();
        const target = event.target;
        if ((event.ctrlKey || event.metaKey) && !event.altKey && key === 'enter') {
            const dialog = target.closest('dialog[open]');
            const save = dialog?.querySelector('#entrySubmitButton,#experimentDetailSubmitButton');
            if (visible(save)) { event.preventDefault(); save.click(); }
            return;
        }
        if (target.closest(editable)) return;
        if (key === 'alt' && !event.ctrlKey && !event.metaKey && !event.shiftKey && (!overlay() || document.querySelector('dialog[open]'))) { event.preventDefault(); showHints(); return; }
        if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            if (/^[0-9]$/.test(key) && !overlay()) {
                const button = buttons[(Number(key) + 9) % 10];
                if (button) { event.preventDefault(); clearHints(); button.click(); }
            } else if (['arrowup','arrowdown','arrowleft','arrowright'].includes(key) && selectedAction) {
                event.preventDefault();
                selectAction(selectedAction.key, key === 'arrowup' || key === 'arrowleft' ? -1 : 1);
            } else if (key === 'enter' && selectedAction && visible(selectedAction.button)) {
                event.preventDefault();
                const button = selectedAction.button;
                clearHints();
                button.click();
            } else if (key === 'escape') {
                clearHints();
            } else if (['n','e','x','s','f','v','a'].includes(key) && (!overlay() || document.querySelector('dialog[open]'))) {
                event.preventDefault();
                selectAction(key);
            }
            if (event.defaultPrevented) event.stopImmediatePropagation();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || overlay() || target.closest(editor)) return;
        if (key === 'f2') { event.preventDefault(); toggle.click(); return; }
        if (['arrowleft','arrowright','a','d'].includes(key)) {
            if (target.closest('button:not(.nav-item),[role="button"],a,summary')) return;
            const index = buttons.findIndex(button => button.classList.contains('active'));
            const step = key === 'arrowleft' || key === 'a' ? -1 : 1;
            event.preventDefault();
            buttons[(index + step + buttons.length) % buttons.length].click();
        } else if (key === 'n') {
            const create = Array.from(document.querySelectorAll('.view.active .page-heading button[data-add],.view.active .dashboard-hero button[data-add],.view.active .module-toolbar button.primary[data-add],.view.active [data-layout-action="new"]')).find(visible);
            if (create) { event.preventDefault(); create.click(); }
        }
    }, true);
    document.addEventListener('keyup', event => { if (event.key === 'Alt') clearHints(); });
    window.addEventListener('blur', clearHints);
    document.addEventListener('pointerdown', clearHints, { passive:true });
}());
