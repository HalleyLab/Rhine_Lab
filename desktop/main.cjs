const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

const isDevelopment = !app.isPackaged;
let mainWindow = null;

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
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
