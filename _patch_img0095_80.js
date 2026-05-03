const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldImg = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:80% top;">`;
const newImg = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 80%;">`;

if (!t.includes(oldImg)) { console.error('❌ IMG_0095 não encontrado'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ IMG_0095: 80% top → center 80%');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
