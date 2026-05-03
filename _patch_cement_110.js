const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// CSS rule: 140px → 110px
const old140 =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 140px !important;\n' +
'    height: 140px !important;\n' +
'    max-width: 140px !important;\n' +
'    max-height: 140px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n';
const new110 =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 110px !important;\n' +
'    height: 110px !important;\n' +
'    max-width: 110px !important;\n' +
'    max-height: 110px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n';
if (!t.includes(old140)) { console.error('❌ Regra CSS não encontrada'); process.exit(1); }
t = t.replace(old140, new110);
console.log('✅ CSS: 140px → 110px');

// Inline style on <img>
const oldStyle = 'style="width:140px!important;height:140px!important;max-width:140px!important;max-height:140px!important;object-fit:contain!important;"';
const newStyle = 'style="width:110px!important;height:110px!important;max-width:110px!important;max-height:110px!important;object-fit:contain!important;"';
if (!t.includes(oldStyle)) { console.error('❌ Inline style não encontrado'); process.exit(1); }
t = t.replace(oldStyle, newStyle);
console.log('✅ Inline style: 140px → 110px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
