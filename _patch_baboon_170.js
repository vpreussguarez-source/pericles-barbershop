const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Update baboon-cement: 180px → 170px
const oldCement =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 180px;\n' +
'    height: 180px;\n' +
'    object-fit: contain;\n' +
'  }\n';
const newCement =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 170px;\n' +
'    height: 170px;\n' +
'    object-fit: contain;\n' +
'  }\n';
if (!t.includes(oldCement)) { console.error('❌ Regra baboon-cement não encontrada'); process.exit(1); }
t = t.replace(oldCement, newCement);
console.log('✅ baboon-cement: 180px → 170px');

// 2. Remove baboon-oleo-barba override (volta para o padrão 150px)
const oldOleo =
'\n  .prod-img-wrap img[src="baboon-oleo-barba.png?v=2"] {\n' +
'    width: 180px;\n' +
'    height: 180px;\n' +
'    object-fit: contain;\n' +
'  }\n';
if (!t.includes(oldOleo)) { console.error('❌ Regra baboon-oleo-barba não encontrada'); process.exit(1); }
t = t.replace(oldOleo, '\n');
console.log('✅ baboon-oleo-barba: override removido (volta a 150px)');

// 3. Add baboon-matte-clay: 170px
const styleClose = t.lastIndexOf('</style>');
const newMatte =
'\n  .prod-img-wrap img[src="baboon-matte-clay.png"] {\n' +
'    width: 170px;\n' +
'    height: 170px;\n' +
'    object-fit: contain;\n' +
'  }\n';
t = t.slice(0, styleClose) + newMatte + t.slice(styleClose);
console.log('✅ baboon-matte-clay: 170px adicionado');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
