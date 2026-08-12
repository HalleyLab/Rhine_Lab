import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const source = await readFile(path.join(projectRoot, 'images', 'rhine-lab-icon.svg'));
const output = path.join(projectRoot, 'images', 'rhine-lab-desktop-icon.png');
const webOutput = path.join(projectRoot, 'images', 'rhine-life-app-icon.png');
const extensionDirectory = path.join(projectRoot, 'browser-extension', 'icons');

const icon = await sharp(source).resize(512, 512).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();

await mkdir(extensionDirectory, { recursive: true });
await Promise.all([
  sharp(icon).toFile(output),
  sharp(icon).toFile(webOutput),
  ...[16, 32, 48, 128].map((size) => sharp(icon)
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(extensionDirectory, `icon-${size}.png`)))
]);

console.log('Created green Rhine Lab icons for web, desktop and browser extensions.');
