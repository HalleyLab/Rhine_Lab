import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const source = path.join(projectRoot, 'images', 'rhine-life-logo.png');
const output = path.join(projectRoot, 'images', 'rhine-lab-desktop-icon.png');
const webOutput = path.join(projectRoot, 'images', 'rhine-life-app-icon.png');
const extensionDirectory = path.join(projectRoot, 'browser-extension', 'icons');

const sourceMetadata = await sharp(source).metadata();
const symbolCrop = {
    left: 0,
    top: 0,
    width: sourceMetadata.width,
    height: Math.round(sourceMetadata.height * 0.76)
};
const logo = await sharp(source)
    .extract(symbolCrop)
    .trim()
    .resize({ width: 380, height: 330, fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .png()
    .toBuffer();

const icon = await sharp({
    create: {
        width: 512,
        height: 512,
        channels: 4,
        background: '#f4f6ef'
    }
})
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

await mkdir(extensionDirectory, { recursive: true });
await Promise.all([
    sharp(icon).toFile(output),
    sharp(icon).toFile(webOutput),
    ...[16, 32, 48, 128].map((size) => sharp(icon)
        .resize(size, size)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(path.join(extensionDirectory, `icon-${size}.png`)))
]);

console.log('Created official Rhine Life mark icons for web, desktop and browser extensions.');
