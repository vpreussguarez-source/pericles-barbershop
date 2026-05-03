const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// 1. hero-frame: adicionar mask-image fade topo → fundo
const oldFrame = `.hero-frame {
  position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
const newFrame = `.hero-frame {
  position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 32%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 32%);
}`;
if (!t.includes(oldFrame)) { console.error('❌ .hero-frame CSS não encontrado'); process.exit(1); }
t = t.replace(oldFrame, newFrame);
console.log('✅ .hero-frame: fade topo → opaco em 32%');

// 2. Ocultar cantos superiores (tl e tr)
const oldTL = `.hero-corner-tl { top: 15px; left: 15px; }`;
const newTL = `.hero-corner-tl { top: 15px; left: 15px; opacity: 0; }`;
if (!t.includes(oldTL)) { console.error('❌ hero-corner-tl não encontrado'); process.exit(1); }
t = t.replace(oldTL, newTL);
console.log('✅ hero-corner-tl: opacity 0 (oculto)');

const oldTR = `.hero-corner-tr { top: 15px; right: 15px; }`;
const newTR = `.hero-corner-tr { top: 15px; right: 15px; opacity: 0; }`;
if (!t.includes(oldTR)) { console.error('❌ hero-corner-tr não encontrado'); process.exit(1); }
t = t.replace(oldTR, newTR);
console.log('✅ hero-corner-tr: opacity 0 (oculto)');

// 3. Salvar
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
