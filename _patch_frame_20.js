const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldFrame = `.hero-frame {
  position: absolute; top: 97px; left: 97px; right: 97px; bottom: 97px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
const newFrame = `.hero-frame {
  position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}`;
if (!t.includes(oldFrame)) { console.error('❌ .hero-frame CSS não encontrado'); process.exit(1); }
t = t.replace(oldFrame, newFrame);
console.log('✅ .hero-frame: 97px → 20px (5px de gap dos L\'s em 15px)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
