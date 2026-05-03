const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Remove padding-top do hero — navbar é transparente e sobreposta, não precisa de offset
const oldHero = `.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; flex-direction: row; align-items: stretch;
  overflow: hidden;
  background: var(--black);
  padding-top: 130px;
}`;

const newHero = `.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; flex-direction: row; align-items: stretch;
  overflow: hidden;
  background: var(--black);
}`;

if (!t.includes(oldHero)) { console.error('❌ .hero CSS não encontrado'); process.exit(1); }
t = t.replace(oldHero, newHero);
console.log('✅ Hero: padding-top removido (navbar é transparente e sobreposta)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
