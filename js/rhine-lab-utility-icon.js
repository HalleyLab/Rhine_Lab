import { createMorph } from './vendor/morphicons/dom.js';

const toggle = document.getElementById('utilityNavToggle');
const path = document.getElementById('utilityNavMorphPath');

if (toggle && path) {
    const closedIcon = [
        ['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
        ['path', { d: 'M15 3v18' }],
        ['path', { d: 'm10 9-3 3 3 3' }]
    ];
    const openIcon = [
        ['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
        ['path', { d: 'M15 3v18' }],
        ['path', { d: 'm8 9 3 3-3 3' }]
    ];
    const iconForState = () => toggle.getAttribute('aria-expanded') === 'true' ? openIcon : closedIcon;
    const morph = createMorph(path, iconForState(), { reducedMotion: 'user' });
    const observer = new MutationObserver(function () {
        morph.morphTo(iconForState(), 'smooth');
    });

    observer.observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
    window.addEventListener('pagehide', function () {
        observer.disconnect();
        morph.destroy();
    }, { once: true });
}
