const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldImg = `<img class="sobre-foto-extra"     src="IMG_0096.JPEG"  alt="Espaço Pericles Barbershop">`;
const newImg = `<img class="sobre-foto-extra"     src="IMG_0094.JPEG"  alt="Espaço Pericles Barbershop">`;

if (!t.includes(oldImg)) { console.error('❌ Imagem IMG_0096 não encontrada'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ sobre-foto-extra: IMG_0096.JPEG → IMG_0094.JPEG');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
