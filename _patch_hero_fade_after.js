const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Substituir .hero-right: remover mask-image, adicionar ::after
const oldRight = `.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%);
  mask-image: linear-gradient(to right, transparent 0%, black 15%);
}`;

const newRight = `.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
}
.hero-right::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 40%; height: 100%;
  background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
  z-index: 2; pointer-events: none;
}`;

if (!t.includes(oldRight)) { console.error('❌ .hero-right CSS não encontrado'); process.exit(1); }
t = t.replace(oldRight, newRight);
console.log('✅ mask-image removido, ::after com gradient adicionado ao .hero-right');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
