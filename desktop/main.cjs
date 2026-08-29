const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const { createUsbSyncBridge, isSnapshot } = require('./usb-sync.cjs');

const isDevelopment = !app.isPackaged;
let mainWindow = null;
let updateCheckTimer = null;
let updatePromptOpen = false;
let updateInstallQueued = false;
let desktopUsbSync = null;
let usbSyncBridge = null;
const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

ipcMain.on('rhine-usb-sync-snapshot', function (_event, configuration) {
    const authKey = configuration && String(configuration.authKey || '');
    const snapshot = configuration && configuration.snapshot;
    desktopUsbSync = /^[a-f0-9]{64}$/.test(authKey) && isSnapshot(snapshot) ? { authKey, snapshot } : null;
    if (!usbSyncBridge) return;
    if (desktopUsbSync) {
        usbSyncBridge.start().catch(function (error) {
            console.warn('Rhine Lab USB sync bridge failed:', error && error.message ? error.message : error);
        });
    } else {
        usbSyncBridge.stop();
    }
});

function setupUsbSyncBridge() {
    usbSyncBridge = createUsbSyncBridge({
        getLocal: function () { return desktopUsbSync; },
        onRemote: function (snapshot) {
            if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('rhine-usb-sync-remote', snapshot);
        },
        onError: function (error) {
            console.warn('Rhine Lab USB sync bridge failed:', error && error.message ? error.message : error);
        }
    });
}

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-smooth-scrolling');

function appUrlFromArguments(argumentsList) {
    return (argumentsList || []).find(function (value) { return String(value).startsWith('rhinelab://'); }) || '';
}

function sendAppUrl(url) {
    if (!url || !mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('rhine-auth-callback', url);
}

function createWindow() {
    const window = mainWindow = new BrowserWindow({
        width: 1480,
        height: 940,
        minWidth: 960,
        minHeight: 680,
        show: false,
        backgroundColor: '#f2f4ed',
        icon: path.join(__dirname, '..', 'images', 'rhine-lab-desktop-icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            webSecurity: true,
            backgroundThrottling: false
        }
    });

    window.webContents.setWindowOpenHandler(function (details) {
        if (/^https?:\/\//i.test(details.url)) shell.openExternal(details.url);
        return { action: 'deny' };
    });
    window.webContents.session.setPermissionRequestHandler(function (_webContents, _permission, callback) {
        callback(false);
    });
    window.once('ready-to-show', function () { window.show(); });
    window.webContents.once('did-finish-load', function () {
        sendAppUrl(appUrlFromArguments(process.argv));
    });
    window.on('closed', function () { if (mainWindow === window) mainWindow = null; });
    window.loadFile(path.join(__dirname, '..', 'index.html'));
    if (isDevelopment && process.env.RHINE_LAB_DEVTOOLS === '1') window.webContents.openDevTools({ mode: 'detach' });
}

function setupAutomaticUpdates() {
    if (isDevelopment || process.platform !== 'win32') return;

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.autoRunAppAfterInstall = true;
    autoUpdater.allowPrerelease = false;

    autoUpdater.on('update-available', async function (info) {
        if (updatePromptOpen || updateInstallQueued) return;
        updatePromptOpen = true;
        try {
            const result = await dialog.showMessageBox(mainWindow || undefined, {
                type: 'info',
                title: 'Rhine Lab 更新',
                message: '发现新版本 ' + info.version,
                detail: '是否现在下载并安装？完成后 Rhine Lab 会自动重新打开。',
                buttons: ['更新', '稍后'],
                defaultId: 0,
                cancelId: 1,
                noLink: true
            });
            if (result.response === 0) {
                updateInstallQueued = true;
                await autoUpdater.downloadUpdate();
            }
        } catch (error) {
            updateInstallQueued = false;
            console.warn('Rhine Lab update download failed:', error && error.message ? error.message : error);
        } finally {
            updatePromptOpen = false;
        }
    });

    autoUpdater.on('download-progress', function (progress) {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(Math.max(0, Math.min(1, progress.percent / 100)));
    });

    autoUpdater.on('update-downloaded', function () {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(-1);
        setTimeout(function () {
            autoUpdater.quitAndInstall(false, true);
        }, 450);
    });

    autoUpdater.on('error', function (error) {
        updateInstallQueued = false;
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setProgressBar(-1);
        console.warn('Rhine Lab update check failed:', error && error.message ? error.message : error);
    });

    const checkForUpdates = function () {
        if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) return;
        autoUpdater.checkForUpdates().catch(function (error) {
            console.warn('Rhine Lab update check failed:', error && error.message ? error.message : error);
        });
    };

    setTimeout(checkForUpdates, 5000);
    updateCheckTimer = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL_MS);
    if (updateCheckTimer.unref) updateCheckTimer.unref();
}

const applicationMenu = Menu.buildFromTemplate([
    {
        label: 'Rhine Lab',
        submenu: [
            { role: 'reload', label: '重新载入' },
            { role: 'togglefullscreen', label: '全屏' },
            { type: 'separator' },
            { role: 'quit', label: '退出' }
        ]
    },
    {
        label: '编辑',
        submenu: [
            { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
            { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
        ]
    },
    { label: '视图', submenu: [{ role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'resetZoom' }] }
]);

const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) app.quit();

app.on('second-instance', function (_event, commandLine) {
    sendAppUrl(appUrlFromArguments(commandLine));
});

app.on('open-url', function (event, url) {
    event.preventDefault();
    sendAppUrl(url);
});

app.whenReady().then(function () {
    if (isDevelopment && process.defaultApp) {
        app.setAsDefaultProtocolClient('rhinelab', process.execPath, [path.resolve(process.argv[1])]);
    } else {
        const protocolExecutable = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;
        app.setAsDefaultProtocolClient('rhinelab', protocolExecutable);
    }
    Menu.setApplicationMenu(applicationMenu);
    if (singleInstance) createWindow();
    setupUsbSyncBridge();
    setupAutomaticUpdates();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('before-quit', function () {
    if (updateCheckTimer) clearInterval(updateCheckTimer);
    if (usbSyncBridge) usbSyncBridge.stop();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
