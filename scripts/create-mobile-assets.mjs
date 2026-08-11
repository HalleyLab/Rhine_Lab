import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const assetDirectory = path.join(projectRoot, 'assets');
const splashSource = await readFile(path.join(projectRoot, 'images', 'rhine-lab-icon.svg'));
const iconSource = await readFile(path.join(projectRoot, 'images', 'rhine-life-logo.png'));

await mkdir(assetDirectory, { recursive: true });

const iconMark = await sharp(iconSource)
  .trim({ threshold: 10 })
  .resize({ width: 700, height: 700, fit: 'inside', withoutEnlargement: false })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: '#f2f4ed'
  }
})
  .composite([{ input: iconMark, gravity: 'centre' }])
  .png()
  .toFile(path.join(assetDirectory, 'icon-only.png'));

async function createSplash(filename, background) {
  const mark = await sharp(splashSource)
    .resize(1050, 1050)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background
    }
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toFile(path.join(assetDirectory, filename));
}

await Promise.all([
  createSplash('splash.png', '#f2f4ed'),
  createSplash('splash-dark.png', '#151c19')
]);

console.log('Generated Rhine Life app icon and internal-test splash source assets.');
