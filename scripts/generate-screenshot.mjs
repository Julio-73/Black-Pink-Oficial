import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'assets', 'originals', 'pink.png');
const OUT = path.join(ROOT, 'img', 'pwa', 'screenshot-wide.png');

await mkdir(path.dirname(OUT), { recursive: true });

const W = 1280, H = 720;
const HOT_PINK = '#ff2e93';
const DEEP_PINK = '#160810';
const WHITE = '#ffffff';

const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${DEEP_PINK}"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${HOT_PINK}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${HOT_PINK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="640" cy="360" rx="500" ry="300" fill="url(#glow)"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-weight="800" font-size="120" fill="${WHITE}" letter-spacing="-3">BLACKPINK</text>
  <text x="50%" y="60%" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-weight="500" font-size="28" fill="${HOT_PINK}">FAN HUB · BLINK COMMUNITY</text>
  <rect x="500" y="610" width="280" height="6" rx="3" fill="${HOT_PINK}" opacity="0.7"/>
</svg>
`);

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 22, g: 8, b: 16, alpha: 1 } }
})
  .composite([
    { input: svg, top: 0, left: 0 },
    { input: await sharp(SOURCE).resize(120, 120).toBuffer(), top: 30, left: 30 }
  ])
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(OUT);

console.log(`OK ${OUT}`);
