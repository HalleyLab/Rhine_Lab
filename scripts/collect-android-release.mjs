import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const source = path.join(root, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const release = path.join(root, 'dist', `release-${pkg.version}`);
const target = path.join(release, `Rhine-Lab-${pkg.version}-Android.apk`);
await mkdir(release, { recursive: true });
await copyFile(source, target);
console.log(`Collected ${target}`);
