const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('RHINE_LAB_DISTRIBUTION', 'desktop');
contextBridge.exposeInMainWorld('RhineLabDesktop', Object.freeze({
    platform: process.platform,
    onAuthCallback: function (listener) {
        const handler = function (_event, url) { listener(url); };
        ipcRenderer.on('rhine-auth-callback', handler);
        return function () { ipcRenderer.removeListener('rhine-auth-callback', handler); };
    }
}));
