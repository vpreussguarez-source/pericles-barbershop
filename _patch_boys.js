const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Fix product name: Strong Bold → Strong Hold (in card name + img alt)
t = t.split('Strong Bold').join('Strong Hold');
console.log('✅ "Strong Bold" → "Strong Hold"');

// 2. CSS rules for boys-matte.png and boys-strong.png
const styleClose = t.lastIndexOf('</style>');
const rules =
'\n  .prod-img-wrap img[src="boys-matte.png"] {\n' +
'    width: 120px !important;\n' +
'    height: 120px !important;\n' +
'    max-width: 120px !important;\n' +
'    max-height: 120px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n' +
'  .prod-img-wrap img[src="boys-strong.png"] {\n' +
'    width: 120px !important;\n' +
'    height: 120px !important;\n' +
'    max-width: 120px !important;\n' +
'    max-height: 120px !important;\n' +
'    object-fit: contain !important;\n' +
'  }\n';
t = t.slice(0, styleClose) + rules + t.slice(styleClose);
console.log('✅ CSS 120px !important para boys-matte e boys-strong');

// 3. Inline style on both <img> tags
[
  '<img src="boys-matte.png" alt="Matte Strong Hold" loading="lazy">',
  '<img src="boys-strong.png" alt="Strong Hold" loading="lazy">',
].forEach(oldTag => {
  const newTag = oldTag.replace(' loading="lazy">', ' loading="lazy" style="width:120px!important;height:120px!important;max-width:120px!important;max-height:120px!important;object-fit:contain!important;">');
  if (!t.includes(oldTag)) { console.error('❌ Tag não encontrada:', oldTag); process.exit(1); }
  t = t.replace(oldTag, newTag);
  console.log('✅ Inline style em', oldTag.slice(10, 35));
});

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
