const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldLogoCSS = `.nav-logo img { height: 75px !important; width: auto !important; object-fit: contain; }`;
const newLogoCSS = `.nav-logo img { height: 95px !important; width: auto !important; object-fit: contain; }`;
if (!t.includes(oldLogoCSS)) { console.error('❌ logo CSS não encontrado'); process.exit(1); }
t = t.replace(oldLogoCSS, newLogoCSS);
console.log('✅ CSS: logo 75px → 95px');

const oldLogoInline = `style="height:75px;width:auto;"`;
const newLogoInline = `style="height:95px;width:auto;"`;
if (!t.includes(oldLogoInline)) { console.error('❌ logo inline não encontrado'); process.exit(1); }
t = t.replace(oldLogoInline, newLogoInline);
console.log('✅ Inline: logo 75px → 95px');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
