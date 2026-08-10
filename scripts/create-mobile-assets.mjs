import { mkdir, readFile } from 'node:fs/promises';
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

async function createSplash(filename, background) {
  const mark = await sharp(source)
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

console.log('Generated internal-test icon and splash source assets.');
