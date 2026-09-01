(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};

    async function startApplication() {
        try {
            if (window.RhineLabCrypto) {
                const secureStorageKeys = ['rhineLabWorkspaceV3', 'rhineLabWorkspaceV3:lab', 'rhineLabWorkspaceV2', 'rhineLabWorkspaceV2:lab', 'rhineLabPendingInvite'];
                for (let index = 0; index < localStorage.length; index += 1) {
                    const storageKey = localStorage.key(index);
                    if (storageKey && storageKey.startsWith('rhineLabSecureAuth:') && !storageKey.includes(':recovery')) secureStorageKeys.push(storageKey);
                }
                await window.RhineLabCrypto.prepareLocalStorage(Array.from(new Set(secureStorageKeys)));
                for (const suffix of ['', ':lab']) {
                    const currentKey = 'rhineLabWorkspaceV3' + suffix;
                    const previousValue = window.RhineLabCrypto.readLocal('rhineLabWorkspaceV2' + suffix);
                    if (window.RhineLabCrypto.readLocal(currentKey) == null && previousValue != null) {
                        await window.RhineLabCrypto.writeLocal(currentKey, previousValue);
                    }
                }
            }
        } catch (error) {
            console.error('Secure local workspace initialization failed.', error);
            window.RHINE_LAB_STORAGE_LOCKED = true;
            document.body.dataset.cryptoError = 'true';
        }
        const script = document.createElement('script');
        script.src = 'js/rhine-lab.js?v=0.3.2-r2';
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
