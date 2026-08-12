import { mkdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const assetDirectory = path.join(projectRoot, 'assets');
const source = await readFile(path.join(projectRoot, 'images', 'rhine-lab-icon.svg'));

await mkdir(assetDirectory, { recursive: true });

const icon = await sharp(source)
  .resize(1024, 1024)
  .png()
  .toBuffer();

await sharp(icon).toFile(path.join(assetDirectory, 'icon-only.png'));

// Derive all Android launcher variants from the complete 0.1.0 icon.
await Promise.allSettled([
  unlink(path.join(assetDirectory, 'icon-foreground.png')),
  unlink(path.join(assetDirectory, 'icon-background.png'))
]);

async function createSplash(filename, background) {
  return sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background
    }
  })
    .png()
    .toFile(path.join(assetDirectory, filename));
}

await Promise.all([
  createSplash('splash.png', '#f2f4ed'),
  createSplash('splash-dark.png', '#151c19')
]);

console.log('Generated the Rhine Lab 0.1.0 icon with plain splash backgrounds.');
