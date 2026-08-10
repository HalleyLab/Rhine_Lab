const CACHE_NAME = 'rhine-lab-pages-v27';
const APP_SHELL = [
    './',
    './index.html',
    './app.webmanifest',
    './css/rhine-lab.css?v=20260810-2',
    './js/rhine-lab-config.js',
    './js/rhine-lab-i18n.js',
    './js/rhine-lab-sync.js',
    './js/rhine-lab-pwa.js',
    './js/rhine-lab-bootstrap.js',
    './js/rhine-lab.js',
    './data/seed.json',
    './images/rhine-life-logo.png',
    './images/rhine-lab-icon.svg'
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
