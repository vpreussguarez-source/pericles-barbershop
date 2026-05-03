const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. object-position: 5% center → 25% center
const old1 = `object-fit: cover; object-position: 5% center;`;
const new1 = `object-fit: cover; object-position: 25% center;`;
if (!t.includes(old1)) { console.error('❌ object-position não encontrado'); process.exit(1); }
t = t.replace(old1, new1);
console.log('✅ object-position → 25% center');

// 2. Remover margin-left: -60px do .hero-right
const old2 = `.hero-right {
  flex: 0 0 55%;
  position: relative; overflow: hidden;
  margin-left: -60px;
}`;
const new2 = `.hero-right {
  flex: 0 0 55%;
  position: relative; overflow: hidden;
}`;
if (!t.includes(old2)) { console.error('❌ .hero-right margin-left não encontrado'); process.exit(1); }
t = t.replace(old2, new2);
console.log('✅ margin-left: -60px removido do .hero-right');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
