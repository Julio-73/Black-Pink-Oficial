// Deep code review: finds real issues a linter would catch
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const issues = [];
const warn = (cat, msg, where = '') => issues.push({ sev: '⚠️', cat, msg, where });
const err  = (cat, msg, where = '') => issues.push({ sev: '🚨', cat, msg, where });
const ok   = (cat, msg) => issues.push({ sev: '✓', cat, msg });

// ===== 1. HTML =====
const html = read('index.html');

// Inline scripts (security)
if (/<script(?![^>]*src=)(?![^>]*type="application\/ld\+json")/.test(html)) {
    err('security', 'inline <script> blocks (use external files)', 'index.html');
}

// External scripts without SRI
const externalScripts = [...html.matchAll(/<script\s+src="(https:\/\/[^"]+)"([^>]*)>/g)];
for (const m of externalScripts) {
    if (m[1].includes('youtube.com/iframe_api')) continue;
    if (!m[2].includes('integrity=')) {
        err('security', `external script without SRI: ${m[1]}`, 'index.html');
    }
}

// External stylesheets without SRI
const externalCSS = [...html.matchAll(/<link[^>]+href="(https:\/\/[^"]+)"[^>]*rel="stylesheet"/g)];
for (const m of externalCSS) {
    if (!html.includes(`href="${m[1]}"`)) continue;
    if (!new RegExp(`href="${m[1].replace(/[/]/g, '\\/')}"[^>]*integrity=`).test(html)) {
        err('security', `external stylesheet without SRI: ${m[1]}`, 'index.html');
    }
}

// Target=_blank without rel="noopener"
const blanks = [...html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)];
let badBlanks = 0;
for (const m of blanks) {
    if (!/rel="[^"]*noopener/.test(m[0])) badBlanks++;
}
if (badBlanks) err('a11y/security', `${badBlanks} target="_blank" without rel="noopener"`, 'index.html');

// Images without alt
const imgs = [...html.matchAll(/<img\s+([^>]*)>/g)];
let noAlt = 0, altEmpty = 0;
for (const m of imgs) {
    if (!/alt=/.test(m[1])) noAlt++;
    else if (/alt=""/.test(m[1]) && !m[1].includes('aria-hidden') && !m[1].includes('loading="lazy"')) {
        // alt="" is OK for decorative; only warn if no role
    }
}
if (noAlt) err('a11y', `${noAlt} <img> without alt`, 'index.html');

// Inputs without label
const inputs = [...html.matchAll(/<(input|select|textarea)\s+([^>]*)/g)];
let unlabeled = 0;
for (const m of inputs) {
    const id = m[2].match(/id="([^"]+)"/)?.[1];
    const aria = /aria-label=/.test(m[2]);
    if (!id && !aria) unlabeled++;
    else if (id) {
        const labelRe = new RegExp(`<label[^>]+for="${id}"`);
        if (!labelRe.test(html) && !aria) unlabeled++;
    }
}
if (unlabeled) err('a11y', `${unlabeled} inputs without associated label`, 'index.html');

// Forms without action
const forms = [...html.matchAll(/<form\s+([^>]*)>/g)];
let noAction = 0;
for (const m of forms) {
    if (!/action=/.test(m[1])) noAction++;
}
if (noAction) warn('ux', `${noAction} form(s) without action attribute (JS-only OK)`, 'index.html');

// Broken anchors (#href that doesn't exist)
const hashLinks = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(x => x !== '');
const broken = hashLinks.filter(h => !new RegExp(`id="${h}"`).test(html));
if (broken.length) warn('ux', `broken in-page anchors: ${[...new Set(broken)].join(', ')}`, 'index.html');

// lang attribute
if (!/<html\s+lang=/.test(html)) err('a11y', '<html> missing lang attribute', 'index.html');

// Charset
if (!/charset=/.test(html)) err('a11y', 'missing charset', 'index.html');

// Viewport
if (!/viewport/.test(html)) err('a11y', 'missing viewport meta', 'index.html');

// ===== 2. CSS =====
const cssDir = join(ROOT, 'css');
const cssFiles = readdirSync(cssDir).filter(f => f.endsWith('.css'));
const css = cssFiles.map(f => readFileSync(join(cssDir, f), 'utf8')).join('\n');

// outline:none usage
const outlineNone = [...css.matchAll(/outline:\s*none/g)];
if (outlineNone.length > 0) {
    warn('a11y', `${outlineNone.length} "outline: none" found in CSS (verify intentional)`, 'css/');
}

// z-index confusion
const zIndexes = [...css.matchAll(/z-index:\s*(\d+)/g)].map(m => +m[1]);
const maxZ = Math.max(...zIndexes, 0);
if (maxZ > 9999) warn('css', `unusually high z-index: ${maxZ}`, 'css/');

// !important overuse
const important = (css.match(/!important/g) || []).length;
if (important > 30) warn('css', `${important} !important declarations (review for over-specification)`, 'css/');

// Animation performance: animating expensive properties
const badAnims = (css.match(/@keyframes/g) || []).length;
if (badAnims > 50) warn('perf', `${badAnims} @keyframes (consider reducing for low-end devices)`, 'css/');

// Check for missing vendor prefixes on critical properties
const needsPrefix = ['backdrop-filter', 'user-select', 'background-clip'];
needsPrefix.forEach(prop => {
    if (css.includes(prop) && !css.includes(`-webkit-${prop}`)) {
        warn('compat', `${prop} used without -webkit- prefix (Safari may fail)`, 'css/');
    }
});

// ===== 3. JS =====
const jsFiles = readdirSync(join(ROOT, 'js')).filter(f => f.endsWith('.js'));
let totalConsole = 0;
let totalAlert = 0;
let totalTODO = 0;
let hasUseStrict = 0;
jsFiles.forEach(f => {
    const t = readFileSync(join(ROOT, 'js', f), 'utf8');
    totalConsole += (t.match(/console\.(log|error|warn|info|debug)/g) || []).length;
    totalAlert += (t.match(/\balert\s*\(/g) || []).length;
    totalTODO += (t.match(/\bTODO\b|\bFIXME\b|\bXXX\b/gi) || []).length;
});
if (totalConsole > 0) warn('debug', `${totalConsole} console.* calls`, 'js/');
if (totalAlert > 0) err('a11y/ux', `${totalAlert} alert() calls`, 'js/');
if (totalTODO > 0) warn('code', `${totalTODO} TODO/FIXME comments`, 'js/');

// ===== 4. PWA =====
const manifest = JSON.parse(read('manifest.json'));
if (!manifest.start_url) err('pwa', 'manifest missing start_url', 'manifest.json');
if (!manifest.icons || manifest.icons.length < 2) err('pwa', 'manifest should have at least 2 icons', 'manifest.json');
if (manifest.icons && !manifest.icons.some(i => i.purpose === 'maskable')) {
    warn('pwa', 'no maskable icon (Android adaptive may crop)', 'manifest.json');
}

// ===== 5. SEO =====
if (!/og:image:width/.test(html)) warn('seo', 'og:image:width missing (Facebook likes 1200x630)', 'index.html');
if (!/og:image:height/.test(html)) warn('seo', 'og:image:height missing', 'index.html');
if (!/name="twitter:card"/.test(html)) err('seo', 'twitter:card missing', 'index.html');
if (!/<link rel="canonical"/.test(html)) err('seo', 'canonical URL missing', 'index.html');
if (!/application\/ld\+json/.test(html)) err('seo', 'JSON-LD missing', 'index.html');

// ===== 6. Performance =====
const videoCount = (html.match(/<video/g) || []).length;
const autoplayVideos = (html.match(/<video[^>]+autoplay/g) || []).length;
if (autoplayVideos > 2) warn('perf', `${autoplayVideos} autoplay videos (mobile data)`, 'index.html');

const cssSize = css.length;
if (cssSize > 100 * 1024) warn('perf', `CSS is ${Math.round(cssSize/1024)}KB (consider code-splitting or critical CSS)`, 'css/');

// ===== 7. Browser compat =====
// Viewport-fit not used
if (!/viewport-fit=/.test(html)) warn('a11y', 'viewport-fit=cover not set (iPhone notch)', 'index.html');

// Module scripts
const moduleCount = (html.match(/type="module"/g) || []).length;
if (moduleCount > 0) ok('compat', `${moduleCount} ES modules (modern browsers only)`);

// ===== 8. Forms UX =====
const submitButtons = [...html.matchAll(/<button[^>]+type="submit"/g)].length;
const forms_count = (html.match(/<form/g) || []).length;
if (forms_count > submitButtons && submitButtons === 0) {
    err('ux', `${forms_count} forms with no submit button`, 'index.html');
}

// ===== Output =====
console.log('='.repeat(70));
console.log('  DEEP CODE REVIEW REPORT');
console.log('='.repeat(70));
const counts = { '🚨': 0, '⚠️': 0, '✓': 0 };
issues.forEach(i => counts[i.sev]++);
console.log(`\nErrors: ${counts['🚨']}  Warnings: ${counts['⚠️']}  OK: ${counts['✓']}\n`);

const grouped = {};
issues.forEach(i => { (grouped[i.cat] = grouped[i.cat] || []).push(i); });
for (const [cat, items] of Object.entries(grouped)) {
    console.log(`\n── ${cat.toUpperCase()} ──`);
    items.forEach(i => console.log(`  ${i.sev} ${i.msg}${i.where ? '  (' + i.where + ')' : ''}`));
}
