import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const dist = path.join(root, 'dist');
const release = path.join(dist, `release-${pkg.version}`);
const semanticVersion = /\d+\.\d+\.\d+/;
await mkdir(dist, { recursive: true });
for (const entry of await readdir(dist, { withFileTypes: true })) {
  if (semanticVersion.test(entry.name)) continue;
  await rm(path.join(dist, entry.name), {
    recursive: true,
    force: true,
    maxRetries: 12,
    retryDelay: 500
  });
}
await mkdir(release, { recursive: true });
console.log(`Preserved versioned releases and prepared ${release}`);