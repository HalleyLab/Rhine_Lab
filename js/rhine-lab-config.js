(function () {
    'use strict';

    // Only the public Worker URL belongs in this browser configuration.
    // D1/R2 credentials and email provider keys remain Worker secrets.
    window.RHINE_LAB_CONFIG = Object.assign({
        cloudflareApiUrl: 'https://api.rh1nelab.com',
        cloudflareFallbackApiUrl: 'https://rhine-lab-api.rhine-lab.workers.dev',
        // Only a message the user explicitly sends is forwarded by the Worker.
        assistantApiUrl: 'https://api.rh1nelab.com/api/assistant',
        publicAppUrl: 'https://halleylab.github.io/Rhine_Lab/',
        seedUrl: './data/showcase.json'
    }, window.RHINE_LAB_CONFIG || {});
}());
