const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const old = `.hero-right::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 50%; height: 100%;
  background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
  z-index: 2; pointer-events: none;
}`;

const neu = `.hero-right::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 60%; height: 100%;
  background: linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.85) 20%, rgba(10,10,10,0.4) 50%, transparent 100%);
  z-index: 2; pointer-events: none;
}`;

if (!t.includes(old)) { console.error('❌ .hero-right::after não encontrado'); process.exit(1); }
t = t.replace(old, neu);
console.log('✅ ::after: width 60%, gradiente multi-stop aplicado');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
