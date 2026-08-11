(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};

    function startApplication() {
        const script = document.createElement('script');
        script.src = 'js/rhine-lab.js?v=20260811-8';
        script.defer = true;
        document.body.appendChild(script);
    }

    if (!config.seedUrl) {
        startApplication();
        return;
    }

    fetch(config.seedUrl, { cache: 'no-cache' })
        .then(function (response) {
            if (!response.ok) throw new Error('Seed request failed: ' + response.status);
            return response.json();
        })
        .then(function (seed) {
            window.RHINE_LAB_SEED = seed;
        })
        .catch(function (error) {
            console.warn('Rhine Lab seed data is unavailable; built-in examples will be used.', error);
        })
        .finally(startApplication);
}());
