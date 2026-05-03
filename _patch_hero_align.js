const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. object-position: 20% center → 5% center
const old1 = `object-fit: cover; object-position: 20% center;`;
const new1 = `object-fit: cover; object-position: 5% center;`;
if (!t.includes(old1)) { console.error('❌ object-position não encontrado'); process.exit(1); }
t = t.replace(old1, new1);
console.log('✅ object-position → 5% center');

// 2. hero-left padding: mover texto mais para direita/centro
// padding: 0 64px 0 88px → padding: 0 48px 0 10% + justify-content: center
const old2 = `  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: flex-start;
  padding: 0 64px 0 88px;
  position: relative; z-index: 4;
  background: var(--black);`;
const new2 = `  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: center;
  padding: 0 56px 0 10%;
  position: relative; z-index: 4;
  background: var(--black);`;
if (!t.includes(old2)) { console.error('❌ hero-left CSS não encontrado'); process.exit(1); }
t = t.replace(old2, new2);
console.log('✅ hero-left: justify-content center + padding-left 10%');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
