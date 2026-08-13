import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'images', 'rhine-life-app-icon.png');
const resources = path.join(root, 'android', 'app', 'src', 'main', 'res');
const densities = {
  ldpi: 36,
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192
};

await Promise.all(Object.entries(densities).flatMap(([density, size]) => {
  const directory = path.join(resources, `mipmap-${density}`);
  return [
    mkdir(directory, { recursive: true }),
    sharp(source).resize(size, size, { fit: 'fill' }).png({ compressionLevel: 9 })
      .toFile(path.join(directory, 'ic_launcher.png')),
    sharp(source).resize(size, size, { fit: 'fill' }).png({ compressionLevel: 9 })
      .toFile(path.join(directory, 'ic_launcher_round.png'))
  ];
}));

await Promise.all([
  rm(path.join(resources, 'mipmap-anydpi-v26'), { recursive: true, force: true }),
  rm(path.join(resources, 'drawable-v24', 'ic_launcher_foreground.xml'), { force: true }),
  rm(path.join(resources, 'drawable', 'ic_launcher_background.xml'), { force: true }),
  rm(path.join(resources, 'values', 'ic_launcher_background.xml'), { force: true })
]);

console.log('Synchronized Android launcher PNGs with the shared web and desktop icon.');
