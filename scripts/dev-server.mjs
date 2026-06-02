// Ultra-fast static server using Node built-ins (no dependencies)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = process.env.PORT || 5173;
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.mjs':  'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webm': 'video/webm',
    '.mp4':  'video/mp4',
    '.woff2':'font/woff2',
    '.woff': 'font/woff',
    '.txt':  'text/plain; charset=utf-8',
    '.xml':  'application/xml; charset=utf-8'
};

const send = (res, status, body, headers = {}) => {
    res.writeHead(status, { 'X-Content-Type-Options': 'nosniff', ...headers });
    res.end(body);
};

const server = http.createServer(async (req, res) => {
    const start = Date.now();
    try {
        let urlPath = decodeURIComponent(req.url.split('?')[0]);
        if (urlPath === '/') urlPath = '/index.html';

        // SPA-style fallback for paths without extension: try .html
        let filePath = join(ROOT, urlPath);
        if (!extname(filePath)) {
            try {
                const s = await stat(filePath + '.html');
                if (s.isFile()) filePath = filePath + '.html';
            } catch { /* fall through */ }
        }

        // Security: prevent path traversal
        if (!filePath.startsWith(ROOT + sep) && filePath !== ROOT) {
            return send(res, 403, 'Forbidden');
        }

        const data = await readFile(filePath);
        const ext = extname(filePath).toLowerCase();
        const type = MIME[ext] || 'application/octet-stream';

        // Cache headers
        const cache = ext === '.html' || ext === '.json' || urlPath === '/sw.js'
            ? 'no-cache'
            : 'public, max-age=3600';

        send(res, 200, data, {
            'Content-Type': type,
            'Content-Length': data.length,
            'Cache-Control': cache
        });
        const ms = Date.now() - start;
        if (process.env.VERBOSE) console.log(`${req.method} ${urlPath}  ${data.length}B  ${ms}ms`);
    } catch (e) {
        if (e.code === 'ENOENT') {
            try {
                const data = await readFile(join(ROOT, '404.html'));
                return send(res, 404, data, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': data.length });
            } catch {
                return send(res, 404, 'Not Found', { 'Content-Type': 'text/plain' });
            }
        }
        send(res, 500, 'Internal Error', { 'Content-Type': 'text/plain' });
        console.error(e);
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ BLACKPINK Fan Hub running at:`);
    console.log(`  → http://localhost:${PORT}/`);
    console.log(`  → http://127.0.0.1:${PORT}/`);
    console.log(`  Press Ctrl+C to stop`);
});
