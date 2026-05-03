const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// HTML da grade de fotos
const idxH = t.indexOf('<div class="sobre-imgs">');
console.log('=== HTML ===');
console.log(t.slice(idxH, idxH + 700));

// CSS do sobre-imgs
const idxC = t.indexOf('/* ── SOBRE: foto destaque + duo escalonado ── */');
console.log('\n=== CSS ===');
console.log(t.slice(idxC, idxC + 1800));
