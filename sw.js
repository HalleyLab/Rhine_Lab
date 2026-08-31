const CACHE_NAME = 'rhine-lab-pages-v137-0.2.6';
const APP_SHELL = [
    './',
    './index.html',
    './app.webmanifest',
    './css/rhine-lab.css?v=20260831-3',
    './css/rhine-dashboard-refresh.css?v=20260814-1',
    './css/rhine-lab-v019.css?v=0.2.6',
    './css/rhine-lab-theme-atlas.css?v=20260818-1',
    './css/rhine-lab-theme-atlas-v2.css?v=20260830-1',
    './css/rhine-lab-workflow-refine.css?v=0.2.6',
    './css/rhine-lab-biology.css?v=0.2.6',
    './css/rhine-lab-bioinformatics.css?v=0.2.6',
    './css/rhine-lab-assistant.css?v=0.2.6a',
    './css/rhine-lab-motion-icons.css?v=0.2.6',
    './css/rhine-lab-mobile.css?v=0.2.6f',
    './js/rhine-lab-config.js?v=0.2.6',
    './js/rhine-lab-i18n.js?v=0.2.6f',
    './js/rhine-lab-crypto.js?v=0.1.9-storage-recovery',
    './js/rhine-lab-sync-v019.js?v=0.2.6',
    './js/rhine-lab-pwa.js?v=0.2.6',
    './js/rhine-lab-assistant.js?v=0.2.6a',
    './js/rhine-lab-close-icons.js?v=0.2.6',
    './js/rhine-lab-theme-init.js?v=0.2.6d',
    './js/rhine-lab-bootstrap.js?v=0.2.6g',
    './js/rhine-lab.js?v=0.2.6g',
    './js/vendor/morphicons/dom.js',
    './js/vendor/morphicons/spring-CFHloqPP.js',
    './js/vendor/morphicons/normalize-CYnN3Npw.js',
    './data/showcase.json',
    './images/rhine-life-logo.png',
    './images/rhine-life-app-icon.png?v=0.2.6',
    './images/assistant/kristen-wright.png',
    './images/theme-atlas/all-lives-bioinformatics-collage-v1.svg'
];

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(APP_SHELL);
    }));
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return key.startsWith('rhine-lab-') && key !== CACHE_NAME;
        }).map(function (key) {
            return caches.delete(key);
        }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).then(function (response) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
            return response;
        }).catch(function () {
            return caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(request).then(function (cached) {
                    return cached || cache.match('./index.html');
                });
            });
        }));
        return;
    }

    if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(fetch(request).then(function (response) {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
            }
            return response;
        }).catch(function () {
            return caches.match(request);
        }));
        return;
    }

    event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
            const network = fetch(request).then(function (response) {
                if (response.ok) cache.put(request, response.clone());
                return response;
            });
            return cached || network;
        });
    }));
});
