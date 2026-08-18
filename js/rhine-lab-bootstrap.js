(function () {
    'use strict';

    const config = window.RHINE_LAB_CONFIG || {};

    async function startApplication() {
        try {
            if (window.RhineLabCrypto) {
                const secureStorageKeys = ['rhineLabWorkspaceV1', 'rhineLabWorkspaceV1:lab', 'rhineLabPendingInvite'];
                for (let index = 0; index < localStorage.length; index += 1) {
                    const storageKey = localStorage.key(index);
                    if (storageKey && storageKey.startsWith('rhineLabSecureAuth:') && !storageKey.includes(':recovery')) secureStorageKeys.push(storageKey);
                }
                await window.RhineLabCrypto.prepareLocalStorage(Array.from(new Set(secureStorageKeys)));
            }
        } catch (error) {
            console.error('Secure local workspace initialization failed.', error);
            document.body.dataset.cryptoError = 'true';
            const boot = document.getElementById('appBootScreen');
            if (boot) { boot.querySelector('strong').textContent = 'SECURE STORAGE ERROR'; boot.querySelector('span').textContent = '无法解锁本机加密数据，请重新载入或恢复备份'; }
            return;
        }
        const script = document.createElement('script');
        script.src = 'js/rhine-lab.js?v=20260818-3';
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
