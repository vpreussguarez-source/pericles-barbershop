const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldRule =
'\n  .prod-img-wrap img[src="baboon-cement.png"] {\n' +
'    max-width: 180px;\n' +
'    max-height: 180px;\n' +
'  }\n';

const newRule =
'\n  .prod-img-wrap img[src="baboon-cement.png"] {\n' +
'    width: 180px;\n' +
'    height: 180px;\n' +
'    object-fit: contain;\n' +
'  }\n';

if (!t.includes(oldRule)) { console.error('❌ Regra baboon-cement não encontrada'); process.exit(1); }
t = t.replace(oldRule, newRule);
console.log('✅ baboon-cement: max-width/max-height → width/height fixos com object-fit:contain');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
