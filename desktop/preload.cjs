const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('RHINE_LAB_DISTRIBUTION', 'desktop');
contextBridge.exposeInMainWorld('RhineLabDesktop', Object.freeze({
    platform: process.platform,
    getLocalSyncAddresses: function () { return ipcRenderer.invoke('rhine-local-sync-addresses'); },
    updateUsbSyncSnapshot: function (configuration) { ipcRenderer.send('rhine-usb-sync-snapshot', configuration); },
    onUsbSyncRemote: function (listener) {
        const handler = function (_event, snapshot) { listener(snapshot); };
        ipcRenderer.on('rhine-usb-sync-remote', handler);
        return function () { ipcRenderer.removeListener('rhine-usb-sync-remote', handler); };
    },
    onAuthCallback: function (listener) {
        const handler = function (_event, url) { listener(url); };
        ipcRenderer.on('rhine-auth-callback', handler);
        return function () { ipcRenderer.removeListener('rhine-auth-callback', handler); };
    },
    bioRunner: Object.freeze({
        probeRemote: function (configuration) { return ipcRenderer.invoke('rhine-bio-probe-remote', configuration); },
        connectRemote: function (configuration) { return ipcRenderer.invoke('rhine-bio-connect-remote', configuration); },
        disconnectRemote: function (sessionId) { return ipcRenderer.invoke('rhine-bio-disconnect-remote', sessionId); },
        runLocal: function (job) { return ipcRenderer.invoke('rhine-bio-run-local', job); },
        runRemote: function (job) { return ipcRenderer.invoke('rhine-bio-run-remote', job); },
        stopJob: function (jobId) { return ipcRenderer.invoke('rhine-bio-stop-job', jobId); },
        chooseDirectory: function () { return ipcRenderer.invoke('rhine-bio-choose-directory'); },
        onEvent: function (listener) {
            const handler = function (_event, payload) { listener(payload); };
            ipcRenderer.on('rhine-bio-event', handler);
            return function () { ipcRenderer.removeListener('rhine-bio-event', handler); };
        }
    })
}));
