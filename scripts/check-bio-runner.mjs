import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const runner = require('../desktop/bio-runner.cjs');
const main = await readFile(new URL('../desktop/main.cjs', import.meta.url), 'utf8');
const preload = await readFile(new URL('../desktop/preload.cjs', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8');
const ui = await readFile(new URL('../js/rhine-lab-bio-runner.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.deepEqual(runner.parseCommandLine('nextflow run nf-core/rnaseq -profile docker'), { executable: 'nextflow', args: ['run', 'nf-core/rnaseq', '-profile', 'docker'] });
assert.throws(() => runner.parseCommandLine('nextflow run x | powershell'), /管道/);
assert.throws(() => runner.parseCommandLine('cmd /c whoami'), /不允许/);
assert.throws(() => runner.parseCommandLine('C:\\tools\\python.exe script.py'), /不能指定程序路径/);
assert.match(runner.resolveLocalExecutable('python'), /python(?:\.exe)?$/i);
assert.equal(runner.prepareJob({ command: 'python "qc.py" --input {input}', inputPath: 'reads 1.fastq', runId: 'RUN-1' }).args[2], 'reads 1.fastq');
assert.match(runner.sshCommand({ executable: 'python3', args: ['qc.py', 'a b'], cwd: '/work/a' }), /^cd -- '\/work\/a' && exec 'python3' 'qc\.py' 'a b'$/);
assert.deepEqual(runner.validateRemoteTarget({ host: 'compute.example.org', username: 'researcher', port: 22 }), { host: 'compute.example.org', username: 'researcher', port: 22 });
assert.throws(() => runner.validateRemoteTarget({ host: 'x;rm', username: 'u', port: 22 }));
assert.match(main, /createBioRunner/); assert.match(main, /rhine-bio-run-remote/); assert.match(main, /isMainWindowSender/);
assert.match(preload, /bioRunner: Object\.freeze/); assert.doesNotMatch(preload, /ipcRenderer:\s*ipcRenderer/);
assert.match(app, /RhineLabBioBridge/); assert.doesNotMatch(app, /currentUserLabel/); assert.match(app, /createRun/); assert.match(app, /updateRun/);
assert.match(ui, /password is used for this session only|密码仅用于当前登录/); assert.doesNotMatch(ui, /localStorage\.setItem[\s\S]*Password/i);
assert.match(html, /id="bioRunnerCenter"/); assert.ok(html.includes('rhine-lab-bio-runner.js?v=' + version));
console.log('Bioinformatics runner checks passed.');
