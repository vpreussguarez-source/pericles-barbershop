const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Logo: 55px → 110px in CSS
const oldLogoCSS = `.nav-logo img { height: 55px !important; width: auto !important; object-fit: contain; }`;
const newLogoCSS = `.nav-logo img { height: 110px !important; width: auto !important; object-fit: contain; }`;
if (!t.includes(oldLogoCSS)) { console.error('❌ .nav-logo img CSS não encontrado'); process.exit(1); }
t = t.replace(oldLogoCSS, newLogoCSS);
console.log('✅ CSS: logo height 55px → 110px');

// 2. Logo: update inline style on the <img> tag
const oldImgInline = `style="height:55px;width:auto;"`;
const newImgInline = `style="height:110px;width:auto;"`;
if (!t.includes(oldImgInline)) { console.error('❌ inline style da img não encontrado'); process.exit(1); }
t = t.replace(oldImgInline, newImgInline);
console.log('✅ Inline: logo height 55px → 110px');

// 3. Menu font-size: 15px → 18px
const oldFont = `font-size: 15px !important;`;
const newFont = `font-size: 18px !important;`;
if (!t.includes(oldFont)) { console.error('❌ font-size 15px não encontrado'); process.exit(1); }
t = t.replace(oldFont, newFont);
console.log('✅ Menu: font-size 15px → 18px !important');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
