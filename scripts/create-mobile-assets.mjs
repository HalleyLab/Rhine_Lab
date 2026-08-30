import { mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
await mkdir(assets, { recursive: true });

// Android, the web manifest and Electron all derive from this exact artwork.
const icon = await sharp(path.join(root, 'images', 'rhine-life-app-icon.png'))
  .resize(1024, 1024, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(icon).toFile(path.join(assets, 'icon-only.png'));
await Promise.allSettled([
  unlink(path.join(assets, 'icon-foreground.png')),
  unlink(path.join(assets, 'icon-background.png'))
]);

const splash = (name, color) => sharp({
  create: {
    width: 2732,
    height: 2732,
    channels: 4,
    background: color
  }
}).png().toFile(path.join(assets, name));

await Promise.all([
  splash('splash.png', '#eef5d3'),
  splash('splash-dark.png', '#eef5d3')
]);

console.log('Created Android assets from the shared Rhine Lab app icon.');
