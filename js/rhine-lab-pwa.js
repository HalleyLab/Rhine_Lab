(function () {
    'use strict';

    const capacitor = window.Capacitor;
    const nativeApp = Boolean(capacitor && typeof capacitor.isNativePlatform === 'function' && capacitor.isNativePlatform());
    const bootScreen = document.getElementById('appBootScreen');
    const bootStartedAt = window.performance && performance.now ? performance.now() : Date.now();
    let bootFinished = false;

    const finishBoot = function () {
        if (bootFinished || !bootScreen) return;
        bootFinished = true;
        const now = window.performance && performance.now ? performance.now() : Date.now();
        const remaining = Math.max(0, 1680 - (now - bootStartedAt));
        window.setTimeout(function () {
            window.requestAnimationFrame(function () {
                bootScreen.classList.add('is-hidden');
                window.setTimeout(function () { bootScreen.hidden = true; }, 520);
            });
        }, remaining);
    };

    if (bootScreen) {
        window.addEventListener('rhine:ready', finishBoot, { once: true });
        window.setTimeout(finishBoot, 1800);
    }

    if (nativeApp) {
        document.documentElement.classList.add('native-app', 'native-performance');

        const updateVisibilityClass = function () {
            document.documentElement.classList.toggle('app-backgrounded', document.hidden);
        };
        updateVisibilityClass();
        document.addEventListener('visibilitychange', updateVisibilityClass, { passive: true });

        const plugins = capacitor.Plugins || {};
        if (plugins.StatusBar) {
            plugins.StatusBar.setOverlaysWebView({ overlay: false }).catch(function () {});
            plugins.StatusBar.setBackgroundColor({ color: '#252d29' }).catch(function () {});
            plugins.StatusBar.setStyle({ style: 'LIGHT' }).catch(function () {});
        }
        if (plugins.SplashScreen) {
            window.addEventListener('load', function () {
                plugins.SplashScreen.hide().catch(function () {});
            });
        }
    }

    if (!nativeApp && 'serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js?v=36', { updateViaCache: 'none' }).then(function (registration) {
                return registration.update();
            }).catch(function () {
                // The site remains usable if service worker registration is unavailable.
            });
        });
    }
}());