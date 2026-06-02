import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const m = html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
if (!m) { console.log('NO JSON-LD'); process.exit(1); }
const json = JSON.parse(m[1]);
console.log('JSON-LD: VALID');
console.log('Context:  ' + json['@context']);
console.log('Graph:    ' + json['@graph'].length + ' nodes');
for (const n of json['@graph']) {
  console.log('  - ' + n['@type'] + ' :: ' + n.name + (n.url ? ' :: ' + n.url : ''));
}
const mg = json['@graph'].find(n => n['@type'] === 'MusicGroup');
console.log('Members:  ' + mg.member.map(m => m.name).join(', '));
console.log('Births:   ' + mg.member.map(m => m.name + '(' + m.birthDate + ')').join(', '));
console.log('SameAs:   ' + mg.sameAs.length + ' URLs');
console.log('altNames: ' + JSON.stringify(mg.alternateName));

const mf = JSON.parse(readFileSync('manifest.json', 'utf8'));
console.log('\nManifest: VALID');
console.log('Name:     ' + mf.name);
console.log('Theme:    ' + mf.theme_color);
console.log('Icons:    ' + mf.icons.length);
console.log('Shortcuts:' + mf.shortcuts.length);

const robots = readFileSync('robots.txt', 'utf8');
console.log('\nrobots.txt: ' + robots.split('\n').length + ' lines, has Sitemap: ' + robots.includes('Sitemap:'));

const sm = readFileSync('sitemap.xml', 'utf8');
console.log('sitemap.xml: ' + (sm.includes('<urlset') && sm.includes('<loc>') ? 'VALID' : 'INVALID') + ' (' + sm.length + ' bytes)');

const sw = readFileSync('sw.js', 'utf8');
const precacheMatches = sw.match(/['"]\.\/[^'"]+['"]/g) || [];
console.log('sw.js:    ' + sw.length + ' bytes, precaches ' + precacheMatches.length + ' assets');

console.log('\n=== Head meta count ===');
const head = html.split('</head>')[0];
const metaCount = (head.match(/<meta\s/g) || []).length;
const linkCount = (head.match(/<link\s/g) || []).length;
console.log('Meta tags: ' + metaCount);
console.log('Link tags: ' + linkCount);
console.log('JSON-LD:   ' + (head.includes('application/ld+json') ? 'yes' : 'NO'));
console.log('Canonical: ' + (head.includes('rel="canonical"') ? 'yes' : 'NO'));
console.log('Manifest:  ' + (head.includes('rel="manifest"') ? 'yes' : 'NO'));
console.log('Twitter:   ' + (head.match(/name="twitter:/g) || []).length);
console.log('OG:        ' + (head.match(/property="og:/g) || []).length);
