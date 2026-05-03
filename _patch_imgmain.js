const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// Ajusta object-position e adiciona scale(1.1) na img-main
const oldImg = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 40%;">`;
const newImg = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 60%;transform:scale(1.1);transform-origin:center 60%;">`;

if (!t.includes(oldImg)) { console.error('❌ img-main não encontrada'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ object-position → center 60%, scale(1.1) aplicado');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const scriptCloseStart = jsonEnd;
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(scriptCloseStart);

JSON.parse(newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle salvo!');
