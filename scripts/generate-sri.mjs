// Generate Subresource Integrity hashes for external CDN assets
import { createHash } from 'node:crypto';
import https from 'node:https';

const URLS = {
    'boxicons-css':  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
    'leaflet-css':   'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'leaflet-js':    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'fonts-outfit':  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap'
};

function fetch(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetch(res.headers.location).then(resolve, reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`${url} -> ${res.statusCode}`));
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    });
}

function sriBase64(buf) {
    return 'sha384-' + createHash('sha384').update(buf).digest('base64');
}

const results = {};
for (const [name, url] of Object.entries(URLS)) {
    try {
        const buf = await fetch(url);
        results[name] = { url, hash: sriBase64(buf), bytes: buf.length };
        console.log(`OK   ${name.padEnd(14)} ${buf.length}B  ${results[name].hash}`);
    } catch (e) {
        console.log(`FAIL ${name.padEnd(14)} ${e.message}`);
    }
}

console.log('\n=== Hashes for HTML ===');
for (const [name, r] of Object.entries(results)) {
    console.log(`${name}: integrity="${r.hash}" crossorigin="anonymous"`);
}
