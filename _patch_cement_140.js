const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Update CSS rule
const oldRule =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 170px;\n' +
'    height: 170px;\n' +
'    object-fit: contain;\n' +
'  }\n';
const newRule =
'\n  .prod-img-wrap img[src="baboon-cement.png?v=2"] {\n' +
'    width: 140px !important;\n' +
'    height: 140px !important;\n' +
'    max-width: 140px !important;\n' +
'    max-height: 140px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n';
if (!t.includes(oldRule)) { console.error('❌ Regra CSS baboon-cement não encontrada'); process.exit(1); }
t = t.replace(oldRule, newRule);
console.log('✅ CSS rule: 170px → 140px com !important');

// 2. Update inline style on <img> tag (if present)
const oldInline = /(<img src="baboon-cement\.png\?v=2"[^>]*?)(\s*style="[^"]*")?([^>]*>)/;
const match = t.match(oldInline);
if (match) {
  const newTag = match[1] + ' style="width:140px!important;height:140px!important;max-width:140px!important;max-height:140px!important;object-fit:contain!important;"' + match[3];
  t = t.replace(match[0], newTag);
  console.log('✅ Inline style atualizado na tag <img>');
} else {
  console.log('ℹ️  Tag img não encontrada com esse padrão — apenas CSS atualizado');
}

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
