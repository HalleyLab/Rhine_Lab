import { createHash } from 'node:crypto';
import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const release = path.join(root, 'dist', `release-${pkg.version}`);
for (const entry of await readdir(release, { withFileTypes: true })) {
  const target = path.join(release, entry.name);
  if (entry.isDirectory() || !entry.name.includes(pkg.version)) {
    await rm(target, { recursive: true, force: true });
  }
}
for (const entry of await readdir(release, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(?:exe|apk)$/i.test(entry.name)) continue;
  const file = path.join(release, entry.name);
  const digest = createHash('sha256').update(await readFile(file)).digest('hex');
  await writeFile(`${file}.sha256`, `${digest}  ${entry.name}\n`, 'utf8');
}
console.log(`Finalized ${release}`);