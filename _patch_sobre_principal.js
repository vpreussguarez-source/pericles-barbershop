const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldImg = `<img class="sobre-foto-principal" src="entrada.JPEG"   alt="Entrada Pericles Barbershop">`;
const newImg = `<img class="sobre-foto-principal" src="IMG_0092.JPEG"  alt="Espaço Pericles Barbershop">`;

if (!t.includes(oldImg)) { console.error('❌ Imagem entrada.JPEG não encontrada'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ sobre-foto-principal: entrada.JPEG → IMG_0092.JPEG');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
