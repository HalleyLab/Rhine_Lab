import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const assetDirectory = path.join(projectRoot, 'assets');
const iconSource = await readFile(path.join(projectRoot, 'images', 'rhine-life-logo.png'));

await mkdir(assetDirectory, { recursive: true });

const sourceMetadata = await sharp(iconSource).metadata();
const symbolCrop = {
  left: 0,
  top: 0,
  width: sourceMetadata.width,
  height: Math.round(sourceMetadata.height * 0.76)
};
const iconMark = await sharp(iconSource)
  .extract(symbolCrop)
  .trim()
  .resize({ width: 900, height: 780, fit: 'inside', withoutEnlargement: false })
  .ensureAlpha()
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: '#f4f6ef'
  }
})
  .composite([{ input: iconMark, gravity: 'centre' }])
  .png()
  .toFile(path.join(assetDirectory, 'icon-only.png'));

const foregroundMark = await sharp(iconSource)
  .extract(symbolCrop)
  .trim()
  .resize({ width: 780, height: 680, fit: 'inside', withoutEnlargement: false })
  .ensureAlpha()
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite([{ input: foregroundMark, gravity: 'centre' }])
  .png()
  .toFile(path.join(assetDirectory, 'icon-foreground.png'));

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: '#f4f6ef'
  }
})
  .png()
  .toFile(path.join(assetDirectory, 'icon-background.png'));

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

console.log('Generated official Rhine Life mark launcher icons and plain mobile splash backgrounds.');
