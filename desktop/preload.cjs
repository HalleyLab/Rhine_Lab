const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('RHINE_LAB_DISTRIBUTION', 'desktop');
contextBridge.exposeInMainWorld('RhineLabDesktop', Object.freeze({
    platform: process.platform,
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
    }
}));
