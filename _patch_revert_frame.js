const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Frame: 50px → 15px
const oldFrame = `.hero-frame {
  position: absolute; top: 50px; left: 50px; right: 50px; bottom: 50px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
const newFrame = `.hero-frame {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
if (!t.includes(oldFrame)) { console.error('❌ .hero-frame CSS não encontrado'); process.exit(1); }
t = t.replace(oldFrame, newFrame);
console.log('✅ .hero-frame: 50px → 15px');

// Corners: 50px → 15px
const pairs = [
  [`.hero-corner-tl { top: 50px; left: 50px; }`,   `.hero-corner-tl { top: 15px; left: 15px; }`],
  [`.hero-corner-tr { top: 50px; right: 50px; }`,  `.hero-corner-tr { top: 15px; right: 15px; }`],
  [`.hero-corner-bl { bottom: 50px; left: 50px; }`,`.hero-corner-bl { bottom: 15px; left: 15px; }`],
  [`.hero-corner-br { bottom: 50px; right: 50px; }`,`.hero-corner-br { bottom: 15px; right: 15px; }`],
];
for (const [oldCSS, newCSS] of pairs) {
  if (!t.includes(oldCSS)) { console.error('❌ Canto não encontrado:', oldCSS); process.exit(1); }
  t = t.replace(oldCSS, newCSS);
}
console.log('✅ Cantos tl/tr/bl/br: 50px → 15px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
