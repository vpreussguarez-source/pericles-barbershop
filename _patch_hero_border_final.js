const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldHBCSS = `.hero-border {
  position: absolute; inset: 8px;
  border: 1px solid rgba(196,146,42,0.4);
  z-index: 201; pointer-events: none;
}`;

const newHBCSS = `.hero-border {
  position: absolute; inset: 12px;
  border: 1px solid rgba(196,146,42,0.4);
  z-index: 9999; pointer-events: none;
}`;

if (!t.includes(oldHBCSS)) { console.error('❌ .hero-border CSS não encontrado'); process.exit(1); }
t = t.replace(oldHBCSS, newHBCSS);
console.log('✅ hero-border: inset 12px, z-index 9999');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
