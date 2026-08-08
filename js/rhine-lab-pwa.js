(function () {
    'use strict';

    let installPrompt = null;
    const installButton = document.getElementById('installAppButton');

    window.addEventListener('beforeinstallprompt', function (event) {
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

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js').catch(function () {
                // The site remains usable if service worker registration is unavailable.
            });
        });
    }
}());
