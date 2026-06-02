import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'assets', 'originals', 'pink.png');
const OUT = path.join(ROOT, 'img', 'pwa');
const FAVICON = path.join(ROOT, 'favicon.ico');

const HOT_PINK = '#ff2e93';
const WHITE = '#ffffff';

await mkdir(OUT, { recursive: true });

if (!await fsExists(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

async function fsExists(p) {
  try { await (await import('node:fs/promises')).access(p); return true; } catch { return false; }
}

const base = sharp(SOURCE);

async function makeStandard(size) {
  const out = path.join(OUT, `icon-${size}.png`);
  await base
    .clone()
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(out);
  console.log(`OK ${out}`);
}

async function makeMaskable(size) {
  const padding = Math.round(size * 0.1);
  const innerSize = size - padding * 2;
  const out = path.join(OUT, `icon-maskable-${size}.png`);
  const inner = await base
    .clone()
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: HOT_PINK }
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(out);
  console.log(`OK ${out}`);
}

async function makeApple(size) {
  const out = path.join(OUT, `apple-touch-icon-${size}.png`);
  const padding = Math.round(size * 0.08);
  const innerSize = size - padding * 2;
  const inner = await base
    .clone()
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: WHITE }
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(out);
  console.log(`OK ${out}`);
}

async function makeFavicon() {
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map(sz =>
      base.clone()
        .resize(sz, sz, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  await sharp(buffers[0]).toFile(FAVICON);
  console.log(`OK ${FAVICON} (single 16x16; ICO conversion skipped — modern browsers prefer PNG favicon)`);
}

await makeStandard(192);
await makeStandard(512);
await makeMaskable(192);
await makeMaskable(512);
await makeApple(180);
await makeFavicon();

console.log('\nPWA icons generated.');
