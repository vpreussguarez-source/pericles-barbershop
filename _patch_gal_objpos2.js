const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// IMG_0098: center bottom → center 70%
const old98 = `<img src="IMG_0098.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center bottom;">`;
const new98 = `<img src="IMG_0098.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 70%;">`;
if (!t.includes(old98)) { console.error('❌ IMG_0098 não encontrado'); process.exit(1); }
t = t.replace(old98, new98);
console.log('✅ IMG_0098: center bottom → center 70%');

// IMG_0095: center top → 80% top
const old95 = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center top;">`;
const new95 = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:80% top;">`;
if (!t.includes(old95)) { console.error('❌ IMG_0095 não encontrado'); process.exit(1); }
t = t.replace(old95, new95);
console.log('✅ IMG_0095: center top → 80% top');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
