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
        if (dock) toggle.removeAttribute('title');
        else if (toggle.title !== title) toggle.title = title;
        toggle.dataset.navLabel = label;
        if (toggle.getAttribute('aria-label') !== title) toggle.setAttribute('aria-label', title);
        toggle.setAttribute('aria-keyshortcuts', 'F2');
        toggle.setAttribute('aria-pressed', String(dock));
        buttons.forEach((button, index) => {
            const label = button.querySelector('span:not(.nav-code)').textContent;
            if (button.dataset.navLabel !== label) button.dataset.navLabel = label;
            if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
            button.setAttribute('aria-keyshortcuts', 'Alt+Shift+' + ((index + 1) % 10));
            const title = label + ' · Alt+Shift+' + ((index + 1) % 10);
            if (dock) button.removeAttribute('title');
            else if (button.title !== title) button.title = title;
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

    let depthHeading = null;
    let depthFrame = 0;
    let depthStart = 0;
    let depthHeight = 0;
    let depthTravel = -1;
    const headingObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('is-heading-visible', entry.isIntersecting));
    }, { rootMargin:'-80px 0px 0px', threshold:0 }) : null;
    function paintHeadingDepth() {
        depthFrame = 0;
        if (!depthHeading || motion.matches) return;
        const travel = Math.max(0, Math.min(depthHeight, window.scrollY - depthStart));
        if (travel === depthTravel) return;
        depthTravel = travel;
        depthHeading.style.setProperty('--heading-travel', travel.toFixed(1) + 'px');
    }
    function refreshHeadingDepth() {
        if (depthFrame) cancelAnimationFrame(depthFrame);
        depthFrame = 0;
        const next = document.querySelector('.view.active > :is(.page-heading,.dashboard-hero)');
        depthHeading?.style.removeProperty('--heading-travel');
        if (depthHeading !== next) {
            if (depthHeading) { headingObserver?.unobserve(depthHeading); depthHeading.classList.remove('is-heading-visible'); }
            depthHeading = next;
            if (depthHeading) { depthHeading.classList.add('is-heading-visible'); headingObserver?.observe(depthHeading); }
        }
        depthTravel = -1;
        if (!depthHeading || motion.matches) return;
        const rect = depthHeading.getBoundingClientRect();
        depthStart = Math.max(0, rect.top + window.scrollY - window.innerHeight * .3);
        depthHeight = rect.height;
        paintHeadingDepth();
    }
    // Reuse the local vector atlas; the original background remains if it cannot load.
    function loadHeadingArt(url, kind) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error('Heading artwork unavailable');
            return response.text();
        }).then(source => {
            const atlas = new DOMParser().parseFromString(source, 'image/svg+xml');
            if (atlas.querySelector('parsererror')) return;
            atlas.querySelectorAll('svg > g[data-view]').forEach(tile => {
                const art = document.querySelector('#view-' + tile.dataset.view + ' .heading-visual,#view-' + tile.dataset.view + ' .hero-atmosphere');
                if (!art) return;
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 800 400');
                svg.setAttribute('fill', 'none');
                svg.setAttribute('class', 'heading-' + kind + '-art');
                svg.setAttribute('aria-hidden', 'true');
                const defs = atlas.querySelector('defs').cloneNode(true);
                const scene = tile.cloneNode(true);
                scene.removeAttribute('transform');
                // Keep gradient/clip references unique across inline page illustrations.
                defs.querySelectorAll('[id]').forEach(node => {
                    const id = node.id;
                    const unique = 'heading-' + kind + '-' + tile.dataset.view + '-' + id;
                    node.id = unique;
                    [scene, ...scene.querySelectorAll('*')].forEach(element => {
                        ['fill','stroke','clip-path'].forEach(attribute => {
                            if (element.getAttribute(attribute) === 'url(#' + id + ')') element.setAttribute(attribute, 'url(#' + unique + ')');
                        });
                    });
                });
                svg.append(defs, scene);
                art.appendChild(svg);
                art.classList.add('has-' + kind + '-art');
            });
        }).catch(() => { /* Keep the cached, static artwork. */ });
    }
    loadHeadingArt('images/theme-atlas/rhine-life-science-atlas-v1.svg?v=0.4.2-depth1', 'depth');
    loadHeadingArt('images/theme-atlas/all-lives-heading-art-v1.svg?v=0.4.2-depth2', 'collage');

    function refreshView() {
        clearHints();
        updateLabels();
        document.querySelectorAll('.view.active').forEach(observeCards);
        refreshHeadingDepth();
    }
    window.addEventListener('scroll', () => {
        if (actions.length && !hintFrame) hintFrame = requestAnimationFrame(paintHints);
        if (depthHeading && !motion.matches && !depthFrame) depthFrame = requestAnimationFrame(paintHeadingDepth);
    }, { passive:true });
    window.addEventListener('resize', () => { resetDock(); refreshView(); });
    window.addEventListener('rhine:viewchange', refreshView);
    window.addEventListener('rhine:ready', refreshView);
    window.addEventListener('rhine:languagechange', () => { updateLabels(); refreshHeadingDepth(); });
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
    const switchers = '.filter-tabs,[role="tablist"],.calendar-modes';
    function numberTabs() {
        const scope = document.querySelector('dialog[open]') || document.querySelector('.view.active');
        if (!scope) return [];
        const focused = document.activeElement?.closest(switchers);
        const group = focused && scope.contains(focused) ? focused : Array.from(scope.querySelectorAll(switchers)).find(visible);
        return group ? Array.from(group.querySelectorAll('button')).filter(visible) : [];
    }
    function activateNumber(key) {
        const button = numberTabs()[(Number(key) + 9) % 10];
        if (!button) return false;
        clearHints();
        button.click();
        return true;
    }
    function hintBounds() {
        const margin = compact.matches ? 16 : 24;
        const bar = document.querySelector('.topbar')?.getBoundingClientRect();
        const dock = document.body.classList.contains('navigation-dock') && document.getElementById('sidebar')?.getBoundingClientRect();
        return { left:margin, right:innerWidth - margin, top:Math.max(margin, (bar?.bottom || 0) + 12), bottom:Math.min(innerHeight - margin, dock ? dock.top - 16 : innerHeight) };
    }
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
        const bounds = hintBounds();
        const group = selectedAction && actions.filter(action => action.key === selectedAction.key && visible(action.button));
        const positioned = actions.filter(action => visible(action.button)).map(action => ({ ...action, rect:action.button.getBoundingClientRect() })).filter(({ button, rect }) => rect.top >= bounds.top && rect.bottom <= (button.closest('dialog[open]') ? innerHeight : bounds.bottom) && rect.right > bounds.left && rect.left < bounds.right);
        positioned.sort((a, b) => Number(b.button === selectedAction?.button) - Number(a.button === selectedAction?.button));
        positioned.forEach(({ key, button, rect }) => {
            const hint = document.createElement('kbd');
            const selected = button === selectedAction?.button;
            hint.className = 'keyboard-action-hint' + (selected ? ' is-current' : '') + (/^[0-9]$/.test(key) ? ' is-tab' : '');
            hint.setAttribute('aria-hidden', 'true');
            hint.setAttribute('data-shortcut', key);
            hint.textContent = key.toUpperCase() + (selected ? ' ' + (group.indexOf(selectedAction) + 1) + '/' + group.length + ' ↑↓ ↵' : '');
            // Native dialogs are in the top layer, above even fixed body overlays.
            (button.closest('dialog[open]') || document.body).appendChild(hint);
            hints.push({ button, hint, rect, selected });
        });
        const placed = [];
        const obstacles = positioned.map(item => item.rect);
        const copy = !document.querySelector('dialog[open]') && document.querySelector('.view.active > :is(.page-heading,.dashboard-hero) > :first-child');
        if (copy) obstacles.push(copy.getBoundingClientRect());
        const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
        const measured = hints.map(item => ({ ...item, size:item.hint.getBoundingClientRect() }));
        measured.forEach(({ hint, rect, size, selected }) => {
            const left = Math.max(bounds.left, Math.min(bounds.right - size.width, rect.right - size.width));
            const candidates = [
                { left, top:rect.top - size.height - 8 },
                { left, top:rect.bottom + 8 },
                { left:rect.left - size.width - 8, top:rect.top + (rect.bottom - rect.top - size.height) / 2 },
                { left:rect.right + 8, top:rect.top + (rect.bottom - rect.top - size.height) / 2 }
            ];
            if (selected) obstacles.forEach(other => candidates.push({ left, top:other.top - size.height - 8 }, { left, top:other.bottom + 8 }));
            if (selected && document.querySelector('dialog[open]')) candidates.push({ left, top:bounds.bottom - size.height });
            const spot = candidates.map(point => ({ ...point, right:point.left + size.width, bottom:point.top + size.height })).find(point =>
                point.left >= bounds.left && point.right <= bounds.right && point.top >= bounds.top && point.bottom <= bounds.bottom &&
                !obstacles.some(other => overlaps(point, other)) && !placed.some(other => overlaps(point, other)));
            // Crowded controls remain reachable by group; don't cover their icons with badges.
            hint.hidden = !spot;
            if (!spot) return;
            hint.style.left = spot.left + 'px';
            hint.style.top = spot.top + 'px';
            placed.push(spot);
        });
    }
    function showHints() {
        clearHints();
        const scope = document.querySelector('dialog[open]') || document.querySelector('.view.active');
        if (!scope) return;
        const tabs = numberTabs();
        actions = Array.from(scope.querySelectorAll('button,[role="button"],summary,.clickable-data-row[tabindex],.protocol-card[tabindex]')).filter(button => visible(button) && !button.closest('svg,.animal-rack-grid,.plant-rack-grid,.microbe-rack-grid,.cold-storage-device-level-slots,.cold-storage-map,.freezer-grid') && button.getAttribute('aria-hidden') !== 'true').map(button => ({ key:tabs.includes(button) ? String((tabs.indexOf(button) + 1) % 10) : actionKey(button), button })).filter(action => action.key !== 'f');
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
        const rect = selectedAction.button.getBoundingClientRect();
        const bounds = hintBounds();
        if (rect.top < bounds.top + 40 || rect.bottom > bounds.bottom - 40) selectedAction.button.scrollIntoView({ block:'center', inline:'nearest', behavior:'instant' });
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
        if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey && /^[0-9]$/.test(key) && !overlay()) {
            event.preventDefault(); event.stopImmediatePropagation(); clearHints(); buttons[(Number(key) + 9) % 10].click(); return;
        }
        if (key === 'alt' && !event.ctrlKey && !event.metaKey && !event.shiftKey && (!overlay() || document.querySelector('dialog[open]'))) { event.preventDefault(); showHints(); return; }
        if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            if (/^[0-9]$/.test(key) && (!overlay() || document.querySelector('dialog[open]'))) {
                if (activateNumber(key)) { event.preventDefault(); showHints(); }
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
            } else if (['n','e','x','s','v','a'].includes(key) && (!overlay() || document.querySelector('dialog[open]'))) {
                event.preventDefault();
                selectAction(key);
            }
            if (event.defaultPrevented) event.stopImmediatePropagation();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || overlay() || target.closest(editor)) return;
        if (/^[0-9]$/.test(key)) { if (activateNumber(key)) event.preventDefault(); return; }
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
