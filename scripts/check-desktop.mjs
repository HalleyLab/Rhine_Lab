import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { X509Certificate, createPrivateKey, createHash } from 'node:crypto';
import { createSecureContext } from 'node:tls';
import path from 'node:path';
import vm from 'node:vm';

const read = name => readFile(new URL('../' + name, import.meta.url), 'utf8');
const require = createRequire(import.meta.url);
const [main, sync, runner, app, html, translations, distribution, release, finalizer, entitlements, packageSource] = await Promise.all([
    'desktop/main.cjs', 'desktop/usb-sync.cjs', 'desktop/bio-runner.cjs', 'js/rhine-lab.js', 'index.html', 'js/rhine-lab-i18n.js',
    '.github/workflows/desktop-distributions.yml', '.github/workflows/release.yml', 'scripts/finalize-release.mjs', 'desktop/entitlements.mac.plist', 'package.json'
].map(read));
const pkg = JSON.parse(packageSource);
assert.deepEqual(pkg.build.mac.target, [{ target:'dmg', arch:['universal'] }, { target:'zip', arch:['universal'] }]);
assert.equal(pkg.build.mac.artifactName, 'Rhine-Lab-${version}-macOS-${arch}.${ext}');
assert.equal(pkg.build.mac.hardenedRuntime, true);
assert.equal(pkg.build.appId, 'com.halleylab.rhinelab.desktop');
assert.equal(pkg.build.productName, 'Rhine Lab');
assert.doesNotMatch(main, /app\.setName\(|app\.setPath\(/);
assert.equal(pkg.build.mac.notarize, false);
assert.equal(pkg.build.npmRebuild, false, 'Existing optional native dependency builds remain disabled');
assert.deepEqual(pkg.build.protocols[0].schemes, ['rhinelab']);
assert.match(pkg.scripts['desktop:build'], /--win nsis/);
assert.match(pkg.scripts['desktop:build:mac'], /--universal --config.mac.identity=-/);
assert.match(pkg.scripts['desktop:build:mac:release'], /mac.notarize=true --config.forceCodeSigning=true/);
assert.match(entitlements, /com.apple.security.cs.allow-jit/);
assert.doesNotMatch(entitlements, /disable-library-validation|allow-unsigned-executable-memory/);
assert.ok(pkg.build.mac.extendInfo.NSLocalNetworkUsageDescription);
for (const source of [distribution, release]) {
    assert.match(source, /runs-on: macos-15/);
    assert.match(source, /pnpm verify:desktop/);
}
for (const secret of ['MAC_CSC_LINK','MAC_CSC_KEY_PASSWORD','APPLE_TEAM_ID','APP_STORE_CONNECT_ISSUER_ID','APP_STORE_CONNECT_KEY_ID','APP_STORE_CONNECT_PRIVATE_KEY']) assert.ok(release.includes('secrets.' + secret));
assert.match(release,/APPLE_API_KEY=\$key_path/);
assert.match(release,/chmod 600 "\$key_path"/);
for (const check of ['lipo -verify_arch arm64 x86_64','codesign --verify','spctl --assess','xcrun stapler validate','latest-mac.yml']) assert.ok(release.includes(check));
assert.match(distribution, /Rhine-Lab-macOS-Universal-Test/);
assert.match(finalizer, /exe\|apk\|dmg\|zip/);
const removalExpression = finalizer.split(/\r?\n/).find(line => line.includes('entry.isDirectory()')).trim().slice(4, -3);
const shouldRemove = new Function('entry','pkg','return ' + removalExpression);
for (const name of ['latest.yml','latest-mac.yml',`Rhine-Lab-${pkg.version}-macOS-universal.zip`]) assert.equal(shouldRemove({ name,isDirectory:()=>false },pkg),false,name);

const tick = () => new Promise(resolve => setImmediate(resolve));
function desktop(platform, signature = 'TeamIdentifier=ABCDE12345', packaged = true, argv = ['Rhine Lab']) {
    const app = new EventEmitter(), windows = [], handlers = {}, scheduled = [], update = new EventEmitter();
    let ready = false, finishReady, menu, quits = 0, disposed = 0, stopped = 0, checks = 0;
    const readyPromise = new Promise(resolve => { finishReady = () => { ready = true; resolve(); }; });
    Object.assign(app, { isPackaged:packaged, commandLine:{ appendSwitch(){} }, requestSingleInstanceLock:()=>true,
        whenReady:()=>readyPromise,isReady:()=>ready,getPath:()=>'/Applications/Rhine Lab.app/Contents/MacOS/Rhine Lab',
        setAsDefaultProtocolClient(){},quit(){quits++;} });
    class Window extends EventEmitter {
        constructor(options) {
            super();this.options=options;this.live=true;this.sent=[];this.loading=true;
            this.webContents=Object.assign(new EventEmitter(), { session:{setPermissionRequestHandler(){}},setWindowOpenHandler(){},
                isLoading:()=>this.loading,send:(...args)=>this.sent.push(args),openDevTools(){} });
            windows.push(this);
        }
        static getAllWindows(){return windows.filter(window=>window.live);}
        isDestroyed(){return !this.live;} isMinimized(){return false;} show(){} focus(){} loadFile(){} setProgressBar(){}
        finish(){this.loading=false;this.webContents.emit('did-finish-load');}
        close(){this.live=false;this.emit('closed');app.emit('window-all-closed');}
    }
    update.checkForUpdates=async()=>{checks++;};
    const electron={app,BrowserWindow:Window,Menu:{buildFromTemplate:template=>template,setApplicationMenu:value=>{menu=value;}},shell:{openExternal(){}},dialog:{},
        ipcMain:{handle:(name,handler)=>{handlers[name]=handler;},on(){}}};
    const dependencies={electron,'electron-updater':{autoUpdater:update},'node:path':platform==='win32'?path.win32:path.posix,
        'node:child_process':{spawnSync:()=>({status:0,stderr:signature})},'node:os':{networkInterfaces:()=>({})},
        './usb-sync.cjs':{createUsbSyncBridge:()=>({stop(){stopped++;}})},'./bio-runner.cjs':{createBioRunner:()=>({dispose(){disposed++;}})}};
    vm.runInNewContext(main,{require:name=>{assert.ok(name in dependencies,name);return dependencies[name];},__dirname:'/app/desktop',process:{platform,argv,env:{},execPath:'/app/Rhine Lab'},console,
        setTimeout:(fn,delay)=>{scheduled.push({fn,delay});return 1;},setInterval:()=>({unref(){}}),clearInterval(){}});
    return {app,windows,update,handlers,scheduled,get menu(){return menu;},get quits(){return quits;},get disposed(){return disposed;},get stopped(){return stopped;},get checks(){return checks;},
        async ready(){finishReady();await tick();}};
}
const mac = desktop('darwin');
let prevented = false;
mac.app.emit('open-url',{preventDefault(){prevented=true;}},'rhinelab://auth?code=cold-start');
assert.equal(prevented,true);assert.equal(mac.windows.length,0);
await mac.ready();
const first=mac.windows[0];
assert.equal(first.options.webPreferences.sandbox,true);assert.equal(first.options.webPreferences.nodeIntegration,false);
assert.equal(first.sent.length,0);first.finish();
assert.equal(first.sent[0][0],'rhine-auth-callback');assert.equal(first.sent[0][1],'rhinelab://auth?code=cold-start');
first.finish();assert.equal(first.sent.length,1,'Reload must not replay a login callback');
assert.ok(mac.menu.some(item=>item.role==='appMenu'));assert.ok(mac.menu.some(item=>item.role==='windowMenu'));
assert.equal(mac.menu.filter(item=>item.label==='Rhine Lab').length,1);
assert.ok(mac.menu.some(item=>item.submenu?.some(action=>action.role==='close')));
assert.equal(mac.update.listenerCount('update-available'),1);
await mac.scheduled.find(item=>item.delay===5000).fn();assert.equal(mac.checks,1);
first.loading=true;mac.app.emit('open-url',{preventDefault(){}},'rhinelab://auth?code=during-reload');
assert.equal(first.sent.length,1);first.finish();assert.equal(first.sent.at(-1)[1],'rhinelab://auth?code=during-reload');
first.close();assert.equal(mac.quits,0,'Closing the last Mac window keeps the app running');
mac.app.emit('activate');assert.equal(mac.windows.length,2);mac.windows[1].finish();assert.equal(mac.windows[1].sent.length,0);
mac.windows[1].close();mac.app.emit('open-url',{preventDefault(){}},'rhinelab://auth?code=reopen');
assert.equal(mac.windows.length,3);mac.windows[2].finish();assert.equal(mac.windows[2].sent[0][1],'rhinelab://auth?code=reopen');
mac.app.emit('open-url',{preventDefault(){}},'https://example.org/');assert.equal(mac.windows[2].sent.length,1);
mac.app.emit('before-quit');assert.equal(mac.disposed,1);assert.equal(mac.stopped,1);
for (const signature of ['TeamIdentifier=not set','']) {
    const unsigned=desktop('darwin',signature);await unsigned.ready();assert.equal(unsigned.update.listenerCount('update-available'),0);
}
const development=desktop('darwin','TeamIdentifier=ABCDE12345',false);await development.ready();assert.equal(development.update.listenerCount('update-available'),0);
const windows=desktop('win32', '', true,['Rhine Lab','rhinelab://auth?code=windows']);await windows.ready();windows.windows[0].finish();
assert.equal(windows.windows[0].sent[0][1],'rhinelab://auth?code=windows');assert.equal(windows.update.listenerCount('update-available'),1);
assert.ok(!windows.menu.some(item=>item.role==='appMenu'));windows.windows[0].close();assert.equal(windows.quits,1);

// Finder's short PATH must work on both Homebrew installation layouts, without enabling a shell.
for (const homebrew of ['/opt/homebrew/bin','/usr/local/bin']) {
    const context={module:{exports:{}},process:{platform:'darwin',env:{PATH:'/usr/bin:/bin'}},console};
    const commands=[];
    context.require=name=>name==='ssh2'?{Client:class{}}:name==='node:path'?path.posix:name==='node:fs'?{
        constants:{X_OK:1},statSync:candidate=>{if(candidate!==homebrew+'/python3')throw Error('Not found');return {isFile:()=>true};},accessSync:candidate=>commands.push(candidate)
    }:require(name);
    vm.runInNewContext(runner+'\nmodule.exports.localExecutablePath=localExecutablePath;',context);
    assert.equal(context.module.exports.resolveLocalExecutable('python3'),homebrew+'/python3');
    assert.ok(context.module.exports.localExecutablePath().includes(homebrew));assert.equal(commands.length,1);
}

// Exercise the actual OpenSSL command, certificate/key pair and cleanup; no network listener is opened.
const openssl=process.platform==='win32'?'openssl.exe':'/usr/bin/openssl';
async function certificateTest(fail=false){
    const realFs=require('node:fs/promises');let directory;
    const context={module:{exports:{}},Buffer,process:{platform:'darwin'},require:name=>{
        if(name==='node:fs/promises')return {...realFs,async mkdtemp(prefix){directory=await realFs.mkdtemp(prefix);return directory;}};
        if(name==='node:child_process')return {execFile:(command,args,options,callback)=>{
            assert.equal(command,'/usr/bin/openssl');if(fail){callback(new Error('OpenSSL failed'));return;}
            // Windows OpenSSL distributions disagree on the default config directory.
            if(process.platform==='win32')options={...options,env:{...process.env,OPENSSL_CONF:process.env.OPENSSL_CONF||'NUL'}};
            return execFile(openssl,args,options,callback);
        }};
        return require(name);
    }};
    vm.runInNewContext(sync+'\nmodule.exports.certificate=createEphemeralCertificate;',context);
    if(fail)await assert.rejects(context.module.exports.certificate(),/OpenSSL failed/);
    else{
        const value=await context.module.exports.certificate(),cert=new X509Certificate(value.tlsOptions.cert);
        assert.ok(cert.checkPrivateKey(createPrivateKey(value.tlsOptions.key)));
        assert.equal(value.fingerprint,createHash('sha256').update(cert.raw).digest('hex'));createSecureContext(value.tlsOptions);
    }
    await assert.rejects(access(directory),{code:'ENOENT'});
}
await certificateTest();await certificateTest(true);

const downloadSource=app.slice(app.indexOf('    function resolveLatestDesktopDownload()'),app.indexOf('    function normalizeActivityEntry('));
async function downloads(assets,installed=false,fail=false){
    const links={desktopDownloadButton:{href:'fallback',removeAttribute(){}},macDownloadButton:{href:'fallback',removeAttribute(){}}};let fetched=false;
    const context={document:{getElementById:id=>links[id]},isInstalledAppRuntime:()=>installed,fetch:async()=>{fetched=true;if(fail)throw Error('Offline');return {ok:true,json:async()=>({assets})};}};
    vm.runInNewContext(downloadSource+'\nresolveLatestDesktopDownload();',context);await tick();return {links,fetched};
}
const base='https://github.com/HalleyLab/Rhine_Lab/releases/download/v'+pkg.version+'/';
const assets=[{name:`Rhine-Lab-${pkg.version}-macOS-universal.dmg`,browser_download_url:base+'mac.dmg'}, {name:`Rhine-Lab-${pkg.version}-Windows-Setup.exe`,browser_download_url:base+'win.exe'}];
const links=(await downloads(assets)).links;
assert.equal(links.macDownloadButton.href,base+'mac.dmg');assert.equal(links.desktopDownloadButton.href,base+'win.exe');
assert.equal((await downloads(assets.slice(0,1))).links.macDownloadButton.href,base+'mac.dmg');
assert.equal((await downloads([{...assets[0],browser_download_url:'javascript:bad'}])).links.macDownloadButton.href,'fallback');
assert.equal((await downloads([],false,true)).links.macDownloadButton.href,'fallback');
assert.equal((await downloads(assets,true)).fetched,false);
assert.match(html,/id="macDownloadButton"/);assert.match(translations,/'macOS 应用': 'macOS app'/);
console.log('macOS universal packaging, signing gates, menus, lifecycle, cold/reload/reopen links, Windows regression, Homebrew paths, real TLS certificate cleanup and download links passed.');
