const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { Client } = require('ssh2');

const MAX_LOG_CHUNK = 64 * 1024;
const CONNECTION_TIMEOUT_MS = 20000;
const ALLOWED_EXECUTABLES = new Set([
    'python', 'python.exe', 'python3', 'python3.exe', 'rscript', 'rscript.exe',
    'nextflow', 'nextflow.exe', 'java', 'java.exe', 'docker', 'docker.exe',
    'snakemake', 'snakemake.exe'
]);

function cleanText(value, maxLength) {
    return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function validateRemoteTarget(input) {
    const host = cleanText(input && input.host, 253);
    const username = cleanText(input && input.username, 128);
    const port = Number(input && input.port) || 22;
    if (!host || !/^[a-z0-9._:-]+$/i.test(host)) throw new Error('服务器地址格式不正确');
    if (!username || /[\s\0-\x1f]/.test(username)) throw new Error('Linux 用户名格式不正确');
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SSH 端口必须是 1–65535 的整数');
    return { host, username, port };
}

function parseCommandLine(value) {
    const command = cleanText(value, 8192);
    if (!command) throw new Error('分析流程尚未设置运行入口');
    if (/[;&|><`\r\n\0]/.test(command)) throw new Error('运行入口不能包含管道、重定向或多条 Shell 命令');
    const tokens = [];
    let token = '';
    let quote = '';
    for (let index = 0; index < command.length; index += 1) {
        const character = command[index];
        if (quote) {
            if (character === quote) quote = '';
            else if (character === '\\' && command[index + 1] === quote) token += command[++index];
            else token += character;
        } else if (character === '"' || character === "'") quote = character;
        else if (/\s/.test(character)) {
            if (token) { tokens.push(token); token = ''; }
        } else token += character;
    }
    if (quote) throw new Error('运行入口存在未闭合的引号');
    if (token) tokens.push(token);
    if (!tokens.length) throw new Error('分析流程尚未设置运行入口');
    if (/[\\/]/.test(tokens[0])) throw new Error('运行入口只能使用受信任的程序名，不能指定程序路径');
    const executableName = path.basename(tokens[0]).toLowerCase();
    if (!ALLOWED_EXECUTABLES.has(executableName)) throw new Error('暂不允许运行程序：' + executableName);
    if (/^(bash|sh)(\.exe)?$/i.test(executableName)) throw new Error('不允许通过 Shell 解释器执行任意命令');
    return { executable: tokens[0], args: tokens.slice(1) };
}

function expandToken(value, variables) {
    return String(value).replace(/\{([a-z][a-z0-9_]*)\}/gi, function (_match, key) {
        if (!Object.prototype.hasOwnProperty.call(variables, key)) throw new Error('未知运行参数：{' + key + '}');
        return cleanText(variables[key], 4096);
    });
}

function prepareJob(input) {
    const parsed = parseCommandLine(input && input.command);
    const variables = {
        input: input && input.inputPath,
        output: input && input.outputPath,
        dataset: input && input.datasetId,
        run: input && input.runId
    };
    const cwd = cleanText(input && input.cwd, 4096);
    return {
        executable: expandToken(parsed.executable, variables),
        args: parsed.args.map(function (item) { return expandToken(item, variables); }),
        cwd,
        runId: cleanText(input && input.runId, 128),
        label: cleanText(input && input.label, 240)
    };
}

function resolveLocalExecutable(executable) {
    const names = process.platform === 'win32' && !path.extname(executable) ? [executable + '.exe', executable] : [executable];
    for (const directory of String(process.env.PATH || '').split(path.delimiter)) {
        const cleanDirectory = directory.replace(/^"|"$/g, '');
        if (!cleanDirectory) continue;
        for (const name of names) {
            const candidate = path.resolve(cleanDirectory, name);
            try { if (fs.statSync(candidate).isFile()) return candidate; } catch (_error) {}
        }
    }
    throw new Error('未在系统 PATH 中找到运行程序：' + executable);
}

function shellQuote(value) {
    return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

function sshCommand(job) {
    const command = [job.executable].concat(job.args).map(shellQuote).join(' ');
    return job.cwd ? 'cd -- ' + shellQuote(job.cwd) + ' && exec ' + command : 'exec ' + command;
}

function randomId(prefix) {
    return prefix + '-' + crypto.randomBytes(12).toString('hex');
}

function createBioRunner(options) {
    const emit = options && typeof options.emit === 'function' ? options.emit : function () {};
    const sessions = new Map();
    const jobs = new Map();

    function probeRemote(configuration) {
        const target = validateRemoteTarget(configuration);
        return new Promise(function (resolve, reject) {
            const client = new Client();
            let fingerprint = '';
            let settled = false;
            const finish = function (error) {
                if (settled) return;
                settled = true;
                client.end();
                if (fingerprint) resolve({ host: target.host, port: target.port, fingerprint });
                else reject(error || new Error('无法读取服务器指纹'));
            };
            client.on('error', finish).on('ready', function () { finish(); });
            client.connect({
                host: target.host,
                port: target.port,
                username: target.username,
                readyTimeout: CONNECTION_TIMEOUT_MS,
                tryKeyboard: false,
                hostHash: 'sha256',
                hostVerifier: function (hash) { fingerprint = hash; setImmediate(finish); return false; }
            });
        });
    }

    function connectRemote(configuration) {
        const target = validateRemoteTarget(configuration);
        const password = String(configuration && configuration.password || '');
        const fingerprint = cleanText(configuration && configuration.fingerprint, 256);
        if (!password || password.length > 1024) return Promise.reject(new Error('请输入服务器密码'));
        if (!fingerprint) return Promise.reject(new Error('连接前必须确认服务器指纹'));
        return new Promise(function (resolve, reject) {
            const client = new Client();
            let settled = false;
            const timer = setTimeout(function () { finish(new Error('服务器连接超时')); }, CONNECTION_TIMEOUT_MS + 1000);
            const finish = function (error, value) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                if (error) { client.end(); reject(error); }
                else resolve(value);
            };
            client.on('ready', function () {
                const sessionId = randomId('ssh');
                sessions.set(sessionId, { client, target, fingerprint, lastUsedAt: Date.now() });
                finish(null, { sessionId, host: target.host, port: target.port, username: target.username, fingerprint });
            });
            client.on('error', function (error) { finish(new Error(error && error.level === 'client-authentication' ? '账户或密码不正确' : (error.message || 'SSH 连接失败'))); });
            client.on('close', function () {
                for (const [sessionId, session] of sessions) if (session.client === client) sessions.delete(sessionId);
            });
            client.connect({
                host: target.host,
                port: target.port,
                username: target.username,
                password,
                readyTimeout: CONNECTION_TIMEOUT_MS,
                keepaliveInterval: 15000,
                keepaliveCountMax: 3,
                hostHash: 'sha256',
                hostVerifier: function (hash) { return hash === fingerprint; }
            });
        });
    }

    function disconnectRemote(sessionId) {
        const session = sessions.get(String(sessionId || ''));
        if (!session) return false;
        session.client.end();
        sessions.delete(sessionId);
        return true;
    }

    function emitLog(jobId, stream, chunk) {
        const data = String(chunk || '').slice(0, MAX_LOG_CHUNK);
        if (data) emit({ type: 'log', jobId, stream, data });
    }

    function runLocal(input) {
        const job = prepareJob(input);
        if (!job.runId) return Promise.reject(new Error('缺少分析任务编号'));
        if (job.cwd && (!path.isAbsolute(job.cwd) || !fs.existsSync(job.cwd) || !fs.statSync(job.cwd).isDirectory())) return Promise.reject(new Error('本地工作目录不存在'));
        const jobId = randomId('local');
        let child;
        try {
            child = spawn(resolveLocalExecutable(job.executable), job.args, {
                cwd: job.cwd || undefined,
                shell: false,
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe']
            });
        } catch (error) {
            return Promise.reject(error);
        }
        jobs.set(jobId, { kind: 'local', process: child, runId: job.runId });
        child.stdout.on('data', function (chunk) { emitLog(jobId, 'stdout', chunk); });
        child.stderr.on('data', function (chunk) { emitLog(jobId, 'stderr', chunk); });
        child.on('error', function (error) { emit({ type: 'error', jobId, runId: job.runId, message: error.message }); });
        child.on('close', function (code, signal) {
            jobs.delete(jobId);
            emit({ type: 'exit', jobId, runId: job.runId, exitCode: Number.isInteger(code) ? code : null, signal: signal || '', status: code === 0 ? 'completed' : 'failed' });
        });
        emit({ type: 'started', jobId, runId: job.runId, label: job.label, target: 'local' });
        return Promise.resolve({ jobId, runId: job.runId, target: 'local' });
    }

    function runRemote(input) {
        const sessionId = cleanText(input && input.sessionId, 128);
        const session = sessions.get(sessionId);
        if (!session) return Promise.reject(new Error('服务器会话已失效，请重新登录'));
        const job = prepareJob(input);
        if (!job.runId) return Promise.reject(new Error('缺少分析任务编号'));
        session.lastUsedAt = Date.now();
        return new Promise(function (resolve, reject) {
            session.client.exec(sshCommand(job), function (error, stream) {
                if (error) { reject(error); return; }
                const jobId = randomId('remote');
                jobs.set(jobId, { kind: 'remote', stream, runId: job.runId, sessionId });
                stream.on('data', function (chunk) { emitLog(jobId, 'stdout', chunk); });
                stream.stderr.on('data', function (chunk) { emitLog(jobId, 'stderr', chunk); });
                stream.on('close', function (code, signal) {
                    jobs.delete(jobId);
                    emit({ type: 'exit', jobId, runId: job.runId, exitCode: Number.isInteger(code) ? code : null, signal: signal || '', status: code === 0 ? 'completed' : 'failed' });
                });
                emit({ type: 'started', jobId, runId: job.runId, label: job.label, target: session.target.host });
                resolve({ jobId, runId: job.runId, target: session.target.host });
            });
        });
    }

    function stopJob(jobId) {
        const job = jobs.get(String(jobId || ''));
        if (!job) return false;
        if (job.kind === 'local') job.process.kill();
        else job.stream.close();
        jobs.delete(jobId);
        emit({ type: 'stopped', jobId, runId: job.runId });
        return true;
    }

    function dispose() {
        for (const jobId of Array.from(jobs.keys())) stopJob(jobId);
        for (const session of sessions.values()) session.client.end();
        sessions.clear();
    }

    return { probeRemote, connectRemote, disconnectRemote, runLocal, runRemote, stopJob, dispose };
}

module.exports = { ALLOWED_EXECUTABLES, createBioRunner, parseCommandLine, prepareJob, resolveLocalExecutable, shellQuote, sshCommand, validateRemoteTarget };
