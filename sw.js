const CACHE_NAME = 'rhine-lab-pages-v62';
const APP_SHELL = [
    './',
    './index.html',
    './app.webmanifest',
    './css/rhine-lab.css?v=20260815-1',
    './css/rhine-lab-v019.css?v=0.1.9-multi-lab',
    './css/rhine-dashboard-refresh.css?v=20260814-1',
    './js/rhine-lab-config.js?v=0.1.9-invite-url',
    './js/rhine-lab-i18n.js?v=20260817-1',
    './js/vendor/supabase.min.js?v=2.112.3',
    './js/rhine-lab-crypto.js?v=0.1.9-account-password',
    './js/rhine-lab-sync-v019.js?v=0.1.9-multi-lab',
    './js/rhine-lab-pwa.js?v=0.1.9',
    './js/rhine-lab-bootstrap.js?v=0.1.9',
    './js/rhine-lab.js?v=20260816-2',
    './data/seed.json',
    './images/rhine-life-logo.png',
    './images/rhine-life-app-icon.png?v=0.1.9'
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
