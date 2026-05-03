const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldBlock =
'.prod-img-wrap img {\n' +
'    max-width: 100%;\n' +
'    max-height: 100%;\n' +
'    width: auto;\n' +
'    height: auto;\n' +
'    object-fit: contain;\n' +
'    display: block;\n' +
'  }';

const newBlock =
'.prod-img-wrap img {\n' +
'    max-width: 150px;\n' +
'    max-height: 150px;\n' +
'    width: auto;\n' +
'    height: auto;\n' +
'    object-fit: contain;\n' +
'    display: block;\n' +
'  }';

if (!t.includes(oldBlock)) { console.error('❌ Bloco não encontrado'); process.exit(1); }
t = t.replace(oldBlock, newBlock);
console.log('✅ max-width/max-height: 100% → 150px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
