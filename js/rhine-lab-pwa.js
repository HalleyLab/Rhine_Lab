(function () {
    'use strict';

    let installPrompt = null;
    const capacitor = window.Capacitor;
    const nativeApp = Boolean(capacitor && typeof capacitor.isNativePlatform === 'function' && capacitor.isNativePlatform());
    const installButton = document.getElementById('installAppButton');
    const bootScreen = document.getElementById('appBootScreen');

    if (nativeApp) {
        document.documentElement.classList.add('native-app', 'native-performance');
        if (installButton) installButton.hidden = true;

        const updateVisibilityClass = function () {
            document.documentElement.classList.toggle('app-backgrounded', document.hidden);
        };
        updateVisibilityClass();
        document.addEventListener('visibilitychange', updateVisibilityClass, { passive: true });

        let bootFinished = false;
        const finishBoot = function () {
            if (bootFinished || !bootScreen) return;
            bootFinished = true;
            window.requestAnimationFrame(function () {
                window.setTimeout(function () {
                    bootScreen.classList.add('is-hidden');
                    window.setTimeout(function () { bootScreen.hidden = true; }, 240);
                }, 120);
            });
        };

        window.addEventListener('rhine:ready', finishBoot, { once: true });
        window.setTimeout(finishBoot, 3500);

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

    window.addEventListener('beforeinstallprompt', function (event) {
        if (nativeApp) return;
        event.preventDefault();
        installPrompt = event;
        if (installButton) installButton.hidden = false;
    });

    if (installButton) {
        installButton.addEventListener('click', async function () {
            if (!installPrompt) return;
            await installPrompt.prompt();
            installPrompt = null;
            installButton.hidden = true;
        });
    }

    window.addEventListener('appinstalled', function () {
        installPrompt = null;
        if (installButton) installButton.hidden = true;
    });

    if (!nativeApp && 'serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js?v=32', { updateViaCache: 'none' }).then(function (registration) {
                return registration.update();
            }).catch(function () {
                // The site remains usable if service worker registration is unavailable.
            });
        });
    }
}());
