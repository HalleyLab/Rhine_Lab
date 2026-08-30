import { createMorph } from './vendor/morphicons/dom.js';

const CLOSE = 'M6 6L18 18M18 6L6 18';
const CLOSE_ACTIVE = 'M8 5L19 16M16 8L5 19';
const selector = [
    '.dialog-close', '.close-button', '.notification-close', '#assistantClose',
    '.housing-layout-rack-delete', '.schedule-delete-button', '.embedded-lineage-remove',
    'button[aria-label^="关闭"]', 'button[aria-label^="删除"]', 'button[aria-label^="移除"]',
    'button[aria-label^="Close"]', 'button[aria-label^="Delete"]', 'button[aria-label^="Remove"]'
].join(',');

function enhance(button) {
    if (!(button instanceof HTMLButtonElement) || button.dataset.morphClose || String(button.textContent || '').trim()) return;
    button.dataset.morphClose = 'true';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('morph-close-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    svg.append(path);
    button.append(svg);
    const morph = createMorph(path, CLOSE, { reducedMotion: 'user' });
    button.addEventListener('pointerenter', function () { morph.morphTo(CLOSE_ACTIVE, 'snappy'); });
    button.addEventListener('pointerleave', function () { morph.morphTo(CLOSE, 'snappy'); });
    button.addEventListener('focus', function () { morph.morphTo(CLOSE_ACTIVE, 'snappy'); });
    button.addEventListener('blur', function () { morph.morphTo(CLOSE, 'snappy'); });
}

function enhanceAll(root) {
    if (root.matches?.(selector)) enhance(root);
    root.querySelectorAll?.(selector).forEach(enhance);
}

enhanceAll(document);
new MutationObserver(function (records) {
    records.forEach(function (record) { record.addedNodes.forEach(function (node) { if (node.nodeType === 1) enhanceAll(node); }); });
}).observe(document.body, { childList: true, subtree: true });
