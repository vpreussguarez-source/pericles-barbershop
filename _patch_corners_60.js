const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Container: 80px → 60px
const oldBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 80px; height: 80px;
  pointer-events: none; z-index: 10;
}`;
const newBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 60px; height: 60px;
  pointer-events: none; z-index: 10;
}`;
if (!t.includes(oldBase)) { console.error('❌ CSS base não encontrado'); process.exit(1); }
t = t.replace(oldBase, newBase);
console.log('✅ Container: 80px → 60px');

// ::before/::after: 80px → 60px
const oldPseudo = `.hero-corner-tl::before { top: 0; left: 0; width: 80px; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px;  height: 80px; }
.hero-corner-tr::before { top: 0; right: 0; width: 80px; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px;  height: 80px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 80px; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px;  height: 80px; }
.hero-corner-br::before { bottom: 0; right: 0; width: 80px; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px;  height: 80px; }`;
const newPseudo = `.hero-corner-tl::before { top: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-tr::before { top: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px;  height: 60px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-br::before { bottom: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px;  height: 60px; }`;
if (!t.includes(oldPseudo)) { console.error('❌ CSS ::before/::after não encontrado'); process.exit(1); }
t = t.replace(oldPseudo, newPseudo);
console.log('✅ Braços L: 80px → 60px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
