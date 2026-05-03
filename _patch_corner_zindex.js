const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Subir z-index de 2 para 10 (acima do hero-left z-index:4 e hero-right)
const oldCornerBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 60px; height: 60px;
  pointer-events: none; z-index: 2;
}`;

const newCornerBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 60px; height: 60px;
  pointer-events: none; z-index: 10;
}`;

if (!t.includes(oldCornerBase)) { console.error('❌ CSS base dos cantos não encontrado'); process.exit(1); }
t = t.replace(oldCornerBase, newCornerBase);
console.log('✅ z-index dos cantos: 2 → 10 (acima do hero-left z-index:4)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
