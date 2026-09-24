(function () {
    'use strict';

    const root = document.getElementById('bioRunnerCenter');
    if (!root) return;

    const text = {
        zh: {
            center: '运行中心', desktop: '桌面安全运行器', gateway: '网站运行网关', unavailable: '需要桌面应用或运行网关',
            pipeline: '分析流程', dataset: '输入数据集', target: '运行位置', local: '本地电脑', remote: '已有服务器',
            cwd: '工作目录', choose: '选择', input: '输入路径', output: '输出路径',
            host: '服务器地址', port: 'SSH 端口', username: 'Linux 账户', password: '密码',
            probe: '检测服务器', connect: '登录服务器', disconnect: '断开连接', fingerprint: '服务器指纹',
            confirmFingerprint: '我已核对并信任这个服务器指纹', run: '开始运行', stop: '停止任务', clear: '清空日志',
            waiting: '等待运行任务…', connected: '已登录', probing: '正在读取服务器指纹…', connecting: '正在登录服务器…',
            running: '任务正在运行', completed: '任务已完成', failed: '任务运行失败', stopped: '任务已停止',
            noGateway: '网页不能直接建立 SSH 连接。请使用桌面应用，或为私有部署配置 bioRunnerApiUrl。',
            noPipeline: '请先登记一个分析流程', noDataset: '请先登记一个输入数据集', readOnly: '当前工作区只读，不能启动任务。',
            verifyFirst: '请先检测服务器并核对指纹', passwordMissing: '请输入服务器密码', loggedOut: '服务器连接已断开',
            command: '即将运行', security: '密码仅用于当前登录，不会写入工作区或浏览器存储。',
            runCreated: '已建立分析任务', webWarning: '网站模式只连接你明确配置的私有运行网关。'
        },
        en: {
            center: 'Run Center', desktop: 'Desktop secure runner', gateway: 'Web runner gateway', unavailable: 'Desktop app or runner gateway required',
            pipeline: 'Pipeline', dataset: 'Input dataset', target: 'Run on', local: 'Local computer', remote: 'Existing server',
            cwd: 'Working directory', choose: 'Choose', input: 'Input path', output: 'Output path',
            host: 'Server address', port: 'SSH port', username: 'Linux account', password: 'Password',
            probe: 'Check server', connect: 'Sign in', disconnect: 'Disconnect', fingerprint: 'Server fingerprint',
            confirmFingerprint: 'I verified and trust this server fingerprint', run: 'Run', stop: 'Stop', clear: 'Clear log',
            waiting: 'Waiting for a run…', connected: 'Signed in', probing: 'Reading the server fingerprint…', connecting: 'Signing in…',
            running: 'Run in progress', completed: 'Run completed', failed: 'Run failed', stopped: 'Run stopped',
            noGateway: 'A browser cannot open SSH directly. Use the desktop app or configure bioRunnerApiUrl for a private deployment.',
            noPipeline: 'Register a pipeline first', noDataset: 'Register an input dataset first', readOnly: 'This workspace is read-only.',
            verifyFirst: 'Check the server and verify its fingerprint first', passwordMissing: 'Enter the server password', loggedOut: 'Server disconnected',
            command: 'Command', security: 'The password is used for this session only and is not saved to workspace or browser storage.',
            runCreated: 'Analysis run created', webWarning: 'Web mode only connects to a private gateway you explicitly configure.'
        }
    };

    let snapshot = { pipelines: [], datasets: [], runs: [], readOnly: true };
    let remoteSession = null;
    let fingerprint = '';
    let activeJob = null;
    let logText = '';
    let webPollTimer = 0;
    let webCursor = 0;

    function bridge() { return window.RhineLabBioBridge || null; }
    function desktop() { return window.RhineLabDesktop && window.RhineLabDesktop.bioRunner; }
    function gatewayUrl() { return String((window.RHINE_LAB_CONFIG || {}).bioRunnerApiUrl || '').replace(/\/+$/, ''); }
    function locale() { return document.documentElement.lang === 'en' ? 'en' : 'zh'; }
    function t(key) { return text[locale()][key] || key; }
    function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]; }); }
    function value(id) { const field = document.getElementById(id); return field ? field.value.trim() : ''; }

    async function webCall(action, payload) {
        const endpoint = gatewayUrl();
        if (!endpoint) throw new Error(t('noGateway'));
        const response = await fetch(endpoint + '/' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload || {}),
            cache: 'no-store',
            credentials: 'include'
        });
        const data = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(data.message || ('Runner gateway error ' + response.status));
        return data;
    }

    function runnerCall(action, payload) {
        const native = desktop();
        if (native && typeof native[action] === 'function') return native[action](payload);
        const names = { probeRemote: 'probe', connectRemote: 'connect', disconnectRemote: 'disconnect', runRemote: 'run', stopJob: 'stop' };
        if (!names[action]) return Promise.reject(new Error(t('noGateway')));
        return webCall(names[action], payload);
    }

    function setMessage(message, kind) {
        const element = document.getElementById('bioRunnerMessage');
        if (!element) return;
        element.textContent = message;
        element.dataset.kind = kind || '';
    }

    function appendLog(value, stream) {
        if (!value) return;
        logText = (logText + String(value)).slice(-100000);
        const consoleElement = document.getElementById('bioRunnerConsole');
        if (consoleElement) {
            consoleElement.textContent = logText || t('waiting');
            consoleElement.dataset.stream = stream || '';
            consoleElement.scrollTop = consoleElement.scrollHeight;
        }
    }

    function refreshSnapshot() {
        snapshot = bridge() ? bridge().getSnapshot() : { pipelines: [], datasets: [], runs: [], readOnly: true };
    }

    function options(records, label) {
        return records.map(function (item) { return '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.name || item.id) + ' · ' + escapeHtml(item.id) + '</option>'; }).join('') || '<option value="">' + escapeHtml(label) + '</option>';
    }

    function render() {
        refreshSnapshot();
        const native = Boolean(desktop());
        const gateway = Boolean(gatewayUrl());
        const selectedPipeline = value('bioRunnerPipeline') || (snapshot.pipelines[0] && snapshot.pipelines[0].id) || '';
        const selectedDataset = value('bioRunnerDataset') || (snapshot.datasets[0] && snapshot.datasets[0].id) || '';
        const previousTarget = document.querySelector('[name="bioRunnerTarget"]:checked');
        const target = previousTarget ? previousTarget.value : (native ? 'local' : 'remote');
        root.innerHTML = '<header class="bio-runner-head"><div><p class="micro-label">COMPUTE RUNNER</p><h2>' + t('center') + '</h2><small>' + escapeHtml(native ? t('desktop') : (gateway ? t('gateway') : t('unavailable'))) + '</small></div><span class="bio-runner-status" data-connected="' + Boolean(remoteSession) + '">' + escapeHtml(remoteSession ? t('connected') + ' · ' + remoteSession.host : (native ? t('desktop') : (gateway ? t('gateway') : 'OFFLINE'))) + '</span></header>' +
            '<div class="bio-runner-layout"><section class="bio-runner-config">' +
                '<div class="bio-runner-field-row"><label><span>' + t('pipeline') + '</span><select id="bioRunnerPipeline">' + options(snapshot.pipelines, t('noPipeline')) + '</select></label><label><span>' + t('dataset') + '</span><select id="bioRunnerDataset">' + options(snapshot.datasets, t('noDataset')) + '</select></label></div>' +
                '<fieldset class="bio-runner-target"><legend>' + t('target') + '</legend><label><input type="radio" name="bioRunnerTarget" value="local" ' + (target === 'local' ? 'checked' : '') + (native ? '' : ' disabled') + '><span>' + t('local') + '</span></label><label><input type="radio" name="bioRunnerTarget" value="remote" ' + (target === 'remote' ? 'checked' : '') + '><span>' + t('remote') + '</span></label></fieldset>' +
                '<label class="bio-runner-path"><span>' + t('cwd') + '</span><div><input id="bioRunnerCwd" type="text" autocomplete="off"><button type="button" data-bio-runner-choose ' + (native ? '' : 'hidden') + '>' + t('choose') + '</button></div></label>' +
                '<div class="bio-runner-field-row"><label><span>' + t('input') + '</span><input id="bioRunnerInput" type="text" autocomplete="off"></label><label><span>' + t('output') + '</span><input id="bioRunnerOutput" type="text" autocomplete="off"></label></div>' +
                '<section class="bio-runner-remote" ' + (target === 'remote' ? '' : 'hidden') + '><div class="bio-runner-field-row server"><label><span>' + t('host') + '</span><input id="bioRunnerHost" type="text" inputmode="url" autocomplete="off" placeholder="192.168.1.10"></label><label class="port"><span>' + t('port') + '</span><input id="bioRunnerPort" type="number" min="1" max="65535" step="1" value="22"></label></div><div class="bio-runner-field-row"><label><span>' + t('username') + '</span><input id="bioRunnerUsername" type="text" autocomplete="username"></label><label><span>' + t('password') + '</span><input id="bioRunnerPassword" type="password" autocomplete="current-password"></label></div><p class="bio-runner-security">' + t('security') + '</p><div class="bio-runner-server-actions"><button class="button ghost compact" type="button" data-bio-runner-probe>' + t('probe') + '</button><button class="button primary compact" type="button" data-bio-runner-connect disabled>' + t('connect') + '</button><button class="button ghost compact" type="button" data-bio-runner-disconnect ' + (remoteSession ? '' : 'hidden') + '>' + t('disconnect') + '</button></div><div class="bio-runner-fingerprint" id="bioRunnerFingerprint" hidden><span>' + t('fingerprint') + '</span><code></code><label><input id="bioRunnerFingerprintConfirm" type="checkbox"> ' + t('confirmFingerprint') + '</label></div>' + (!native && !gateway ? '<p class="bio-runner-warning">' + t('noGateway') + '</p>' : '') + '</section>' +
            '</section><section class="bio-runner-monitor"><header><div><p class="micro-label">LIVE OUTPUT</p><strong id="bioRunnerMessage">' + t('waiting') + '</strong></div><button type="button" data-bio-runner-clear>' + t('clear') + '</button></header><pre id="bioRunnerConsole">' + escapeHtml(logText || t('waiting')) + '</pre><div class="bio-runner-command"><span>' + t('command') + '</span><code id="bioRunnerCommand"></code></div></section></div>' +
            '<footer class="bio-runner-actions"><button class="button ghost" type="button" data-bio-runner-stop ' + (activeJob ? '' : 'disabled') + '>' + t('stop') + '</button><button class="button primary" type="button" data-bio-runner-run ' + (snapshot.readOnly || activeJob || !snapshot.pipelines.length || !snapshot.datasets.length ? 'disabled' : '') + '>' + t('run') + '</button></footer>';
        document.getElementById('bioRunnerPipeline').value = selectedPipeline;
        document.getElementById('bioRunnerDataset').value = selectedDataset;
        updateDatasetPath();
        updateCommandPreview();
        if (snapshot.readOnly) setMessage(t('readOnly'), 'warning');
    }

    function selectedPipeline() { return snapshot.pipelines.find(function (item) { return item.id === value('bioRunnerPipeline'); }); }
    function selectedDataset() { return snapshot.datasets.find(function (item) { return item.id === value('bioRunnerDataset'); }); }

    function updateDatasetPath() {
        const dataset = selectedDataset();
        const input = document.getElementById('bioRunnerInput');
        if (dataset && input && !input.value) input.value = dataset.location || '';
    }

    function updateCommandPreview() {
        const pipeline = selectedPipeline();
        const output = document.getElementById('bioRunnerCommand');
        if (output) output.textContent = pipeline ? (pipeline.command || '—') : '—';
    }

    function serverConfiguration() {
        return { host: value('bioRunnerHost'), port: Number(value('bioRunnerPort')) || 22, username: value('bioRunnerUsername'), password: value('bioRunnerPassword'), fingerprint };
    }

    async function probeServer() {
        setMessage(t('probing'));
        fingerprint = '';
        try {
            const result = await runnerCall('probeRemote', serverConfiguration());
            fingerprint = String(result.fingerprint || '');
            const panel = document.getElementById('bioRunnerFingerprint');
            panel.hidden = false;
            panel.querySelector('code').textContent = fingerprint;
            panel.querySelector('input').checked = false;
            document.querySelector('[data-bio-runner-connect]').disabled = true;
            setMessage(t('verifyFirst'));
        } catch (error) { setMessage(error.message, 'error'); }
    }

    async function connectServer() {
        if (!fingerprint || !document.getElementById('bioRunnerFingerprintConfirm').checked) { setMessage(t('verifyFirst'), 'error'); return; }
        if (!value('bioRunnerPassword')) { setMessage(t('passwordMissing'), 'error'); return; }
        setMessage(t('connecting'));
        try {
            remoteSession = await runnerCall('connectRemote', serverConfiguration());
            document.getElementById('bioRunnerPassword').value = '';
            render();
            setMessage(t('connected') + ' · ' + remoteSession.host, 'success');
        } catch (error) { setMessage(error.message, 'error'); }
    }

    async function disconnectServer() {
        if (remoteSession) await runnerCall('disconnectRemote', remoteSession.sessionId).catch(function () {});
        remoteSession = null;
        fingerprint = '';
        render();
        setMessage(t('loggedOut'));
    }

    function jobPayload(run) {
        const pipeline = selectedPipeline();
        const dataset = selectedDataset();
        return {
            runId: run.id,
            label: pipeline.name + ' · ' + dataset.name,
            command: pipeline.command,
            cwd: value('bioRunnerCwd'),
            inputPath: value('bioRunnerInput'),
            outputPath: value('bioRunnerOutput'),
            datasetId: dataset.id
        };
    }

    async function startRun() {
        if (!bridge() || snapshot.readOnly) return;
        const pipeline = selectedPipeline();
        const dataset = selectedDataset();
        if (!pipeline) { setMessage(t('noPipeline'), 'error'); return; }
        if (!dataset) { setMessage(t('noDataset'), 'error'); return; }
        const target = document.querySelector('[name="bioRunnerTarget"]:checked').value;
        if (target === 'remote' && !remoteSession) { setMessage(t('verifyFirst'), 'error'); return; }
        logText = '';
        const run = bridge().createRun({ pipelineId: pipeline.id, datasetId: dataset.id, compute: target === 'local' ? t('local') : (remoteSession.host + ':' + remoteSession.port), outputLocation: value('bioRunnerOutput') });
        if (!run) return;
        setMessage(t('running'));
        try {
            const result = target === 'local'
                ? await runnerCall('runLocal', jobPayload(run))
                : await runnerCall('runRemote', Object.assign(jobPayload(run), { sessionId: remoteSession.sessionId }));
            activeJob = { jobId: result.jobId, runId: run.id, target };
            bridge().updateRun(run.id, { status: '运行中', runnerJobId: result.jobId, runnerTarget: result.target, runnerStartedAt: new Date().toISOString() });
            root.querySelector('[data-bio-runner-run]').disabled = true;
            root.querySelector('[data-bio-runner-stop]').disabled = false;
            if (!desktop()) startWebPolling();
        } catch (error) {
            bridge().updateRun(run.id, { status: '失败', runnerFinishedAt: new Date().toISOString(), runnerLog: error.message });
            setMessage(error.message, 'error');
        }
    }

    async function stopRun() {
        if (!activeJob) return;
        await runnerCall('stopJob', activeJob.jobId).catch(function (error) { setMessage(error.message, 'error'); });
    }

    function handleRunnerEvent(event) {
        if (!event || (activeJob && event.jobId && event.jobId !== activeJob.jobId) || (!activeJob && event.type !== 'started')) return;
        if (event.type === 'log') { appendLog(event.data, event.stream); return; }
        if (event.type === 'started') { setMessage(t('running')); return; }
        const runId = event.runId || (activeJob && activeJob.runId);
        if (!runId || !['exit', 'error', 'stopped'].includes(event.type)) return;
        const status = event.type === 'stopped' ? '已取消' : (event.type === 'exit' && event.status === 'completed' ? '已完成' : '失败');
        bridge().updateRun(runId, { status, endDate: new Date().toISOString().slice(0, 10), runnerFinishedAt: new Date().toISOString(), runnerExitCode: event.exitCode, runnerLog: logText.slice(-50000) });
        setMessage(event.type === 'stopped' ? t('stopped') : (status === '已完成' ? t('completed') : (event.message || t('failed'))), status === '已完成' ? 'success' : 'error');
        activeJob = null;
        stopWebPolling();
        const runButton = root.querySelector('[data-bio-runner-run]');
        const stopButton = root.querySelector('[data-bio-runner-stop]');
        if (runButton) runButton.disabled = snapshot.readOnly;
        if (stopButton) stopButton.disabled = true;
    }

    function startWebPolling() {
        stopWebPolling();
        webCursor = 0;
        const poll = async function () {
            if (!activeJob || !gatewayUrl()) return;
            try {
                const response = await fetch(gatewayUrl() + '/events?jobId=' + encodeURIComponent(activeJob.jobId) + '&cursor=' + webCursor, { cache: 'no-store', credentials: 'include' });
                const data = await response.json();
                webCursor = Number(data.cursor) || webCursor;
                (data.events || []).forEach(handleRunnerEvent);
            } catch (_error) {}
            if (activeJob) webPollTimer = window.setTimeout(poll, 1000);
        };
        poll();
    }

    function stopWebPolling() { if (webPollTimer) clearTimeout(webPollTimer); webPollTimer = 0; }

    root.addEventListener('change', function (event) {
        if (event.target.name === 'bioRunnerTarget') {
            root.querySelector('.bio-runner-remote').hidden = event.target.value !== 'remote';
        }
        if (event.target.id === 'bioRunnerPipeline') updateCommandPreview();
        if (event.target.id === 'bioRunnerDataset') { document.getElementById('bioRunnerInput').value = ''; updateDatasetPath(); }
        if (event.target.id === 'bioRunnerFingerprintConfirm') root.querySelector('[data-bio-runner-connect]').disabled = !event.target.checked;
    });
    root.addEventListener('click', function (event) {
        if (event.target.closest('[data-bio-runner-probe]')) probeServer();
        if (event.target.closest('[data-bio-runner-connect]')) connectServer();
        if (event.target.closest('[data-bio-runner-disconnect]')) disconnectServer();
        if (event.target.closest('[data-bio-runner-run]')) startRun();
        if (event.target.closest('[data-bio-runner-stop]')) stopRun();
        if (event.target.closest('[data-bio-runner-clear]')) { logText = ''; appendLog('', ''); document.getElementById('bioRunnerConsole').textContent = t('waiting'); }
        if (event.target.closest('[data-bio-runner-choose]') && desktop()) desktop().chooseDirectory().then(function (directory) { if (directory) document.getElementById('bioRunnerCwd').value = directory; });
    });

    if (desktop()) desktop().onEvent(handleRunnerEvent);
    window.addEventListener('rhine:languagechange', render);
    window.addEventListener('rhine:ready', render);
    window.addEventListener('rhine:biochange', render);
    render();
}());
