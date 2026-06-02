// One-shot HTML refactor: applies asset paths, video multi-source, rel=noopener,
// preconnect, footer year span, and replaces inline handlers with data-action.
// Uses Node.js fs (UTF-8 native — avoids PowerShell encoding issues).
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'index.html';
let html = readFileSync(path, 'utf8');

// ---- 1. Asset path swaps (PNG -> WebP under img/) ----
html = html.replace(/(?<=["'])pink\.png(?=["'])/g,  'img/pink.webp');
html = html.replace(/(?<=["'])jisoo\.png(?=["'])/g, 'img/jisoo.webp');
html = html.replace(/(?<=["'])jenny\.png(?=["'])/g, 'img/jenny.webp');
html = html.replace(/(?<=["'])rose\.png(?=["'])/g,  'img/rose.webp');
html = html.replace(/(?<=["'])lisa\.png(?=["'])/g,  'img/lisa.webp');

// Favicon type
html = html.replace(/<link rel="icon" href="img\/pink\.webp" type="image\/png">/g,
                    '<link rel="icon" href="img/pink.webp" type="image/webp">');

// ---- 2. Add preconnect links after stylesheets in <head> ----
const preconnects = `
    <link rel="preconnect" href="https://unpkg.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://i.ytimg.com" crossorigin>
    <link rel="preconnect" href="https://img.youtube.com" crossorigin>`;
if (!html.includes('rel="preconnect"')) {
    html = html.replace(
        /(<link rel="stylesheet" href="https:\/\/unpkg\.com\/leaflet[^>]+\/>)/,
        `$1${preconnects}`
    );
}

// ---- 3. Hero video multi-source + poster ----
html = html.replace(
    /<video class="hero-video-bg"[^>]*>\s*<source src="loveluna\.mp4"[^>]*>\s*<\/video>/,
    `<video class="hero-video-bg" playsinline autoplay loop muted preload="metadata" poster="video/loveluna-poster.webp" aria-hidden="true">
        <source src="video/loveluna.webm" type="video/webm">
        <source src="video/loveluna.mp4" type="video/mp4">
    </video>`
);

// ---- 4. Tour video multi-source + poster ----
html = html.replace(
    /<video playsinline autoplay loop muted preload="auto">\s*<source src="amor\.mp4"[^>]*>\s*<\/video>/,
    `<video playsinline autoplay loop muted preload="metadata" poster="video/amor-poster.webp" aria-hidden="true">
        <source src="video/amor.webm" type="video/webm">
        <source src="video/amor.mp4" type="video/mp4">
    </video>`
);

// ---- 5. og:image -> webp absolute hint kept relative ----
html = html.replace(/property="og:image" content="img\/pink\.webp"/g,
                    'property="og:image" content="img/pink.webp"');

// ---- 6. rel=noopener noreferrer for every target=_blank without rel ----
html = html.replace(/target="_blank"(?![^>]*\brel=)/g, 'target="_blank" rel="noopener noreferrer"');

// ---- 7. Footer year dynamic ----
html = html.replace(/&copy; 2026 BLACKPINK/g,
                    '&copy; <span id="footer-year">2026</span> BLACKPINK');

// ---- 8. Inline handlers -> data-action ----
const replacements = [
    [/ onclick="openMobileMenu\(\)"/g, ' data-action="open-mobile-menu"'],
    [/ onclick="document\.getElementById\('tour-map'\)\.scrollIntoView\(\{behavior:'smooth'\}\)"/g,
        ' data-action="scroll-to" data-target="#tour-map"'],
    [/ onclick="openMemberModal\('(\w+)'\)"/g,
        ' data-action="open-member-modal" data-member="$1"'],
    [/ onclick="closeMemberModal\('(\w+)'\)"/g,
        ' data-action="close-member-modal" data-member="$1"'],
    [/ onclick="showVideoTab\('([\w-]+)', this\)"/g,
        ' data-action="show-video-tab" data-tab="$1"'],
    [/ onclick="openVideoModal\('([\w-]+)'\)"/g,
        ' data-action="open-video-modal" data-video-id="$1"'],
    [/ onclick="closeVideoModal\(\)"/g, ' data-action="close-video-modal"'],
    [/ onsubmit="handleJoinForm\(event\)"/g, ''],
    [/ onclick="selectLang\(this\)"/g, ' data-action="select-lang"'],
    [/ onclick="addToCart\('([^']+)', (\d+)\)"/g,
        ' data-action="add-to-cart" data-product="$1" data-price="$2"'],
    [/ onclick="loadMoreProducts\(\)"/g, ' data-action="load-more-products"'],
    [/ onclick="closeMobileMenu\(\)"/g, ' data-action="close-mobile-menu"']
];

for (const [pattern, replacement] of replacements) {
    html = html.replace(pattern, replacement);
}

// ---- 9. Make video cards keyboard-accessible (role + tabindex) ----
html = html.replace(
    /<div class="video-card" data-action="open-video-modal"/g,
    '<div class="video-card" role="button" tabindex="0" data-action="open-video-modal"'
);

// ---- 10. Swap script tag to ES module ----
html = html.replace(/<script src="page\.js"><\/script>/,
                    '<script type="module" src="js/main.js"></script>');

writeFileSync(path, html, 'utf8');

// Summary
const remaining = (html.match(/onclick=|onsubmit=/g) || []).length;
console.log(`Done. Remaining inline handlers: ${remaining}`);
console.log(`data-action count: ${(html.match(/data-action=/g) || []).length}`);
console.log(`target=_blank without rel: ${(html.match(/target="_blank"(?![^>]*\brel=)/g) || []).length}`);
