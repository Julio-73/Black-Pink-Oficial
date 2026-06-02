import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');

console.log('=== A11Y POST-REFACTOR AUDIT ===\n');

const count = (re) => (html.match(re) || []).length;
const has = (re) => re.test(html);

console.log('Landmarks:');
console.log('  <main>:     ' + (has(/<main[^>]*id="main"/) ? 'YES' : 'NO'));
console.log('  <header>:   ' + count(/<header/g));
console.log('  <nav>:      ' + count(/<nav/g));
console.log('  <footer>:   ' + count(/<footer/g));
console.log('  <section>:  ' + count(/<section/g));

console.log('\nSkip link:');
console.log('  .skip-link: ' + (has(/class="skip-link"/) ? 'YES' : 'NO'));
console.log('  target #main: ' + (has(/href="#main"/) ? 'YES' : 'NO'));

console.log('\nForms:');
console.log('  labels:     ' + count(/<label/g));
console.log('  with for= : ' + count(/<label[^>]+for=/g));
console.log('  aria-required: ' + count(/aria-required="true"/g));
console.log('  with id:    ' + count(/<(input|select)[^>]+id="/g));

console.log('\nModals (a11y):');
console.log('  role="dialog":     ' + count(/role="dialog"/g));
console.log('  aria-modal="true": ' + count(/aria-modal="true"/g));
console.log('  aria-labelledby:   ' + count(/aria-labelledby=/g));
console.log('  aria-hidden="true" (init): ' + count(/aria-hidden="true"/g));

console.log('\nQuiz:');
console.log('  aria-live on result: ' + (has(/quiz-result-member[^>]*aria-live="polite"/) ? 'YES' : 'NO'));

console.log('\nAria attributes total:');
['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'aria-required', 'aria-live', 'aria-modal', 'aria-expanded', 'aria-hidden', 'aria-controls', 'aria-current', 'aria-selected', 'aria-pressed'].forEach(a => {
    const c = count(new RegExp(a, 'g'));
    if (c > 0) console.log('  ' + a + ': ' + c);
});
