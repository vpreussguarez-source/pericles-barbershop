const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Frame: 15px → 50px
const oldFrame = `.hero-frame {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
const newFrame = `.hero-frame {
  position: absolute; top: 50px; left: 50px; right: 50px; bottom: 50px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
if (!t.includes(oldFrame)) { console.error('❌ .hero-frame CSS não encontrado'); process.exit(1); }
t = t.replace(oldFrame, newFrame);
console.log('✅ .hero-frame: inset 15px → 50px');

// Corners: 15px → 50px
const oldTL = `.hero-corner-tl { top: 15px; left: 15px; }`;
const newTL = `.hero-corner-tl { top: 50px; left: 50px; }`;
if (!t.includes(oldTL)) { console.error('❌ hero-corner-tl não encontrado'); process.exit(1); }
t = t.replace(oldTL, newTL);

const oldTR = `.hero-corner-tr { top: 15px; right: 15px; }`;
const newTR = `.hero-corner-tr { top: 50px; right: 50px; }`;
if (!t.includes(oldTR)) { console.error('❌ hero-corner-tr não encontrado'); process.exit(1); }
t = t.replace(oldTR, newTR);

const oldBL = `.hero-corner-bl { bottom: 15px; left: 15px; }`;
const newBL = `.hero-corner-bl { bottom: 50px; left: 50px; }`;
if (!t.includes(oldBL)) { console.error('❌ hero-corner-bl não encontrado'); process.exit(1); }
t = t.replace(oldBL, newBL);

const oldBR = `.hero-corner-br { bottom: 15px; right: 15px; }`;
const newBR = `.hero-corner-br { bottom: 50px; right: 50px; }`;
if (!t.includes(oldBR)) { console.error('❌ hero-corner-br não encontrado'); process.exit(1); }
t = t.replace(oldBR, newBR);
console.log('✅ Cantos tl/tr/bl/br: 15px → 50px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
