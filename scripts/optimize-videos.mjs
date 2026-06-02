// Video optimizer: shrinks hero/tour MP4s and generates web-ready versions.
// Output per source (background loops trimmed to LOOP_SECONDS):
//   - <name>.mp4   (H.264, 960p,  CRF 33, no audio)  -> universal fallback
//   - <name>.webm  (VP9,   960p,  CRF 40, no audio)  -> modern browsers
//   - <name>-poster.webp (frame at 2s)               -> video poster
//
// Originals moved to assets/originals/ (gitignored, recoverable).
const LOOP_SECONDS = 15;
const SCALE_W = 960;
const CRF_H264 = 33;
const CRF_VP9 = 40;
import { spawn } from 'node:child_process';
import { stat, mkdir, rename, access } from 'node:fs/promises';
import { existsSync, constants } from 'node:fs';
import path from 'node:path';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = ffmpegStatic;
const ROOT = path.resolve('.');
const OUT_DIR = path.join(ROOT, 'video');
const BACKUP_DIR = path.join(ROOT, 'assets', 'originals');

const SOURCES = [
    { file: 'loveluna.mp4', label: 'Hero (loveluna)' },
    { file: 'amor.mp4',     label: 'Tour (amor)' },
];

function run(args, label) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const proc = spawn(FFMPEG, args, { stdio: ['ignore', 'ignore', 'pipe'] });
        let lastLine = '';
        proc.stderr.on('data', chunk => {
            const lines = chunk.toString().split(/\r|\n/).filter(Boolean);
            for (const l of lines) {
                if (l.includes('time=')) {
                    const m = l.match(/time=(\d+:\d+:\d+\.\d+)/);
                    if (m) {
                        process.stdout.write(`\r    ${label}: ${m[1]}    `);
                        lastLine = l;
                    }
                }
            }
        });
        proc.on('close', code => {
            process.stdout.write('\r');
            if (code === 0) {
                const secs = ((Date.now() - start) / 1000).toFixed(1);
                console.log(`    ${label}: done (${secs}s)`);
                resolve();
            } else {
                console.error(lastLine);
                reject(new Error(`ffmpeg exited with code ${code}`));
            }
        });
        proc.on('error', reject);
    });
}

function fmtMB(bytes) { return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }

async function ensureDir(p) {
    if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function processVideo(src) {
    const inputPath = path.join(ROOT, src.file);
    const backupPath = path.join(BACKUP_DIR, src.file);

    // If original already moved to backup, reuse it as input
    let actualInput = inputPath;
    if (!existsSync(inputPath) && existsSync(backupPath)) {
        actualInput = backupPath;
    }
    if (!existsSync(actualInput)) {
        console.warn(`  [skip] ${src.file} not found`);
        return null;
    }

    const baseName = path.basename(src.file, path.extname(src.file));
    const mp4Out  = path.join(OUT_DIR, `${baseName}.mp4`);
    const webmOut = path.join(OUT_DIR, `${baseName}.webm`);
    const posterOut = path.join(OUT_DIR, `${baseName}-poster.webp`);

    const original = await stat(actualInput);
    console.log(`-> ${src.label} | original ${fmtMB(original.size)}`);

    // 1. MP4 H.264 (compatible everywhere) - trimmed loop
    await run([
        '-y', '-ss', '0', '-i', actualInput,
        '-t', String(LOOP_SECONDS),
        '-vf', `scale='min(${SCALE_W},iw)':-2`,
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', String(CRF_H264),
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-an',
        mp4Out
    ], 'mp4 ');

    // 2. WebM VP9 (smaller for modern browsers) - trimmed loop
    await run([
        '-y', '-ss', '0', '-i', actualInput,
        '-t', String(LOOP_SECONDS),
        '-vf', `scale='min(${SCALE_W},iw)':-2`,
        '-c:v', 'libvpx-vp9',
        '-crf', String(CRF_VP9),
        '-b:v', '0',
        '-deadline', 'good',
        '-cpu-used', '2',
        '-row-mt', '1',
        '-an',
        webmOut
    ], 'webm');

    // 3. Poster WebP (frame at 2s - skip black intro)
    await run([
        '-y', '-i', actualInput,
        '-ss', '2',
        '-frames:v', '1',
        '-vf', `scale='min(${SCALE_W},iw)':-2`,
        '-c:v', 'libwebp',
        '-quality', '80',
        posterOut
    ], 'post');

    const [mp4s, webms, posters] = await Promise.all([stat(mp4Out), stat(webmOut), stat(posterOut)]);
    const totalNew = mp4s.size + webms.size + posters.size;
    console.log(`    -> mp4 ${fmtMB(mp4s.size)} | webm ${fmtMB(webms.size)} | poster ${fmtMB(posters.size)}`);
    console.log(`    -> reduction ${((1 - totalNew / original.size) * 100).toFixed(1)}%\n`);

    // Move original to backup if still in root
    if (actualInput !== backupPath) {
        try {
            await rename(actualInput, backupPath);
        } catch {
            // ignore if move fails
        }
    }

    return { original: original.size, totalNew };
}

(async () => {
    if (!FFMPEG) {
        console.error('ffmpeg-static binary not resolved');
        process.exit(1);
    }
    console.log(`ffmpeg: ${FFMPEG}\n`);
    await ensureDir(OUT_DIR);
    await ensureDir(BACKUP_DIR);

    let origSum = 0;
    let newSum = 0;
    for (const src of SOURCES) {
        const r = await processVideo(src);
        if (r) {
            origSum += r.original;
            newSum += r.totalNew;
        }
    }
    console.log('=========================================');
    console.log(`Originals: ${fmtMB(origSum)}  (moved to assets/originals/)`);
    console.log(`New:       ${fmtMB(newSum)}`);
    if (origSum > 0) {
        console.log(`Saved:     ${fmtMB(origSum - newSum)} (${((1 - newSum / origSum) * 100).toFixed(1)}%)`);
    }
})().catch(err => {
    console.error('Video optimization failed:', err);
    process.exit(1);
});
