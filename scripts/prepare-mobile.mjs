import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(projectRoot, 'www');

const files = [
  'index.html',
  'app.webmanifest'
];

const directories = [
  'css',
  'data',
  'images',
  'js'
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await cp(
    path.join(projectRoot, file),
    path.join(outputDirectory, file)
  );
}

for (const directory of directories) {
  await cp(
    path.join(projectRoot, directory),
    path.join(outputDirectory, directory),
    { recursive: true }
  );
}

console.log('Prepared Capacitor web assets in www/.');
