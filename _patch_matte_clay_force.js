const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Add !important to the existing CSS rule
const oldRule =
'\n  .prod-img-wrap img[src="baboon-matte-clay.png"] {\n' +
'    width: 170px;\n' +
'    height: 170px;\n' +
'    object-fit: contain;\n' +
'  }\n';
const newRule =
'\n  .prod-img-wrap img[src="baboon-matte-clay.png"] {\n' +
'    width: 170px !important;\n' +
'    height: 170px !important;\n' +
'    max-width: 170px !important;\n' +
'    max-height: 170px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n';
if (!t.includes(oldRule)) { console.error('❌ Regra CSS não encontrada'); process.exit(1); }
t = t.replace(oldRule, newRule);
console.log('✅ CSS rule: !important adicionado');

// 2. Add inline style directly on the <img> tag
const oldImg = '<img src="baboon-matte-clay.png" alt="Matte Clay Hair Pomade" loading="lazy">';
const newImg = '<img src="baboon-matte-clay.png" alt="Matte Clay Hair Pomade" loading="lazy" style="width:170px!important;height:170px!important;max-width:170px!important;max-height:170px!important;object-fit:contain!important;">';
if (!t.includes(oldImg)) { console.error('❌ Tag img não encontrada'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ Inline style adicionado na tag <img>');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
