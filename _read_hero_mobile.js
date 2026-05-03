const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// hero-right CSS
const idx1 = t.indexOf('.hero-right {');
console.log('=== .hero-right CSS ===');
console.log(t.slice(idx1, idx1 + 300));

// mobile media query
const idx2 = t.indexOf('/* ── MOBILE: volta ao layout full-screen ── */');
console.log('\n=== MOBILE SECTION ===');
console.log(t.slice(idx2, idx2 + 700));
