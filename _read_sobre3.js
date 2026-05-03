const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// CSS: end of sobre-imgs block
const idxC = t.indexOf('/* gold frame accent no canto');
console.log(t.slice(idxC, idxC + 300));

// HTML: full sobre-imgs div
const idxH = t.indexOf('<div class="sobre-imgs">');
console.log('\n=== FULL HTML ===');
console.log(t.slice(idxH, idxH + 900));
