import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'images', 'rhine-life-app-icon.png');
const checks = [
  ['desktop', path.join(root, 'images', 'rhine-lab-desktop-icon.png'), 512],
  ['extension-128', path.join(root, 'browser-extension', 'icons', 'icon-128.png'), 128],
  ['android-mdpi', path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher.png'), 48],
  ['android-mdpi-round', path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher_round.png'), 48],
  ['android-xxxhdpi', path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png'), 192]
];

for (const [name, target, size] of checks) {
  const expected = await sharp(source).resize(size, size, { fit: 'fill' }).raw().toBuffer();
  const actual = await sharp(target).resize(size, size, { fit: 'fill' }).raw().toBuffer();
  if (!expected.equals(actual)) throw new Error(`${name} does not match the shared icon source`);
  console.log(`${name}: exact pixel match`);
}
