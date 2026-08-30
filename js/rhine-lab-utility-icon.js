import { createMorph } from './vendor/morphicons/dom.js';

const toggle = document.getElementById('utilityNavToggle');
const path = document.getElementById('utilityNavMorphPath');

if (toggle && path) {
    const closedIcon = [
        ['path', { d: 'm11 17-5-5 5-5' }],
        ['path', { d: 'm18 17-5-5 5-5' }]
    ];
    const openIcon = [
        ['path', { d: 'm13 7 5 5-5 5' }],
        ['path', { d: 'm6 7 5 5-5 5' }]
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
