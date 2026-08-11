import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const source = path.join(projectRoot, 'images', 'rhine-lab-icon.svg');
const output = path.join(projectRoot, 'images', 'rhine-lab-desktop-icon.png');

await sharp(source, { density: 288 })
    .resize(512, 512, {
        fit: 'contain',
        position: 'centre',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);

console.log('Created centered desktop icon:', output);
