// Image optimizer: PNG -> WebP + AVIF
// Generates progressive responsive sizes for member photos and a hi-res logo.
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const OUT_DIR = path.join(ROOT, 'img');
const BACKUP = path.join(ROOT, 'assets', 'originals');

// PNG files to convert (relative names)
const TARGETS = [
    { file: 'pink.png',  sizes: [{ w: 400, suffix: '' }, { w: 200, suffix: '-sm' }] },
    { file: 'jisoo.png', sizes: [{ w: 800, suffix: '' }, { w: 400, suffix: '-sm' }] },
    { file: 'jenny.png', sizes: [{ w: 800, suffix: '' }, { w: 400, suffix: '-sm' }] },
    { file: 'rose.png',  sizes: [{ w: 800, suffix: '' }, { w: 400, suffix: '-sm' }] },
    { file: 'lisa.png',  sizes: [{ w: 800, suffix: '' }, { w: 400, suffix: '-sm' }] },
];

async function ensureDir(p) {
    if (!existsSync(p)) await mkdir(p, { recursive: true });
}

function fmtKB(bytes) { return `${(bytes / 1024).toFixed(1)} KB`; }

async function processOne(target) {
    let srcPath = path.join(ROOT, target.file);
    if (!existsSync(srcPath)) {
        srcPath = path.join(BACKUP, target.file);
    }
    if (!existsSync(srcPath)) {
        console.warn(`  [skip] ${target.file} not found`);
        return { saved: 0, generated: 0 };
    }
    const original = await stat(srcPath);
    const baseName = path.basename(srcPath, path.extname(srcPath));
    let totalGenerated = 0;
    let totalNew = 0;

    for (const size of target.sizes) {
        const stem = `${baseName}${size.suffix}`;
        const webpPath = path.join(OUT_DIR, `${stem}.webp`);
        const avifPath = path.join(OUT_DIR, `${stem}.avif`);
        const fallbackPng = path.join(OUT_DIR, `${stem}.png`);

        const pipe = sharp(srcPath).resize({ width: size.w, withoutEnlargement: true });

        await pipe.clone().webp({ quality: 82, effort: 6 }).toFile(webpPath);
        await pipe.clone().avif({ quality: 55, effort: 5 }).toFile(avifPath);
        await pipe.clone().png({ compressionLevel: 9, palette: true }).toFile(fallbackPng);

        const [w, a, p] = await Promise.all([stat(webpPath), stat(avifPath), stat(fallbackPng)]);
        totalNew += w.size + a.size + p.size;
        totalGenerated += 3;

        console.log(`  ${stem}: webp ${fmtKB(w.size)} | avif ${fmtKB(a.size)} | png ${fmtKB(p.size)}`);
    }

    return { original: original.size, totalNew, generated: totalGenerated };
}

(async () => {
    console.log('Optimizing images...\n');
    await ensureDir(OUT_DIR);
    await ensureDir(BACKUP);

    let originalSum = 0;
    let newSum = 0;
    let generatedCount = 0;

    for (const t of TARGETS) {
        console.log(`-> ${t.file}`);
        const r = await processOne(t);
        if (r.original) originalSum += r.original;
        newSum += r.totalNew;
        generatedCount += r.generated;
        console.log('');
    }

    console.log('=========================================');
    console.log(`Originals total: ${fmtKB(originalSum)}`);
    console.log(`Generated total: ${fmtKB(newSum)} across ${generatedCount} files`);
    const ratio = ((1 - newSum / originalSum) * 100).toFixed(1);
    console.log(`Reduction:       ${ratio}%`);
    console.log('Output dir:      img/');
})().catch(err => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
