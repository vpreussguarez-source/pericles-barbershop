const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const old = `.sobre-foto-extra {
  position: absolute;
  top: 0;
  right: 0;
  width: 36%;
  height: 240px;
  object-fit: cover;
  border-radius: 4px;
  transform: rotate(2.5deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}`;

const neu = `.sobre-foto-extra {
  position: absolute;
  top: 0;
  right: 0;
  width: 36%;
  height: 240px;
  object-fit: cover;
  border-radius: 4px;
  transform: rotate(2.5deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}

.sobre-foto-principal,
.sobre-foto-esquerda,
.sobre-foto-direita,
.sobre-foto-extra {
  border: 2px solid rgba(212,175,55,0.6);
  outline: 1px solid rgba(212,175,55,0.2);
  outline-offset: 4px;
}`;

if (!t.includes(old)) { console.error('❌ .sobre-foto-extra não encontrado'); process.exit(1); }
t = t.replace(old, neu);
console.log('✅ Borda dourada adicionada em todas as fotos do collage');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
