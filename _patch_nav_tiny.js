const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// 1. Padding CSS: 8px → 4px
const oldPadCSS = `  padding: 8px 52px !important; min-height: 0 !important;`;
const newPadCSS = `  padding: 4px 52px !important; min-height: 0 !important;`;
if (!t.includes(oldPadCSS)) { console.error('❌ padding CSS não encontrado'); process.exit(1); }
t = t.replace(oldPadCSS, newPadCSS);
console.log('✅ CSS: padding 8px → 4px 52px');

// 2. Padding inline: 8px → 4px
const oldPadInline = `<nav style="padding:8px 52px;">`;
const newPadInline = `<nav style="padding:4px 52px;">`;
if (!t.includes(oldPadInline)) { console.error('❌ padding inline não encontrado'); process.exit(1); }
t = t.replace(oldPadInline, newPadInline);
console.log('✅ Inline: padding 8px → 4px 52px');

// 3. Mobile media query: 8px → 4px
const oldMob = `nav { padding: 8px 20px !important; }`;
const newMob = `nav { padding: 4px 20px !important; }`;
if (!t.includes(oldMob)) { console.error('❌ media query padding não encontrado'); process.exit(1); }
t = t.replace(oldMob, newMob);
console.log('✅ Mobile: padding 8px → 4px 20px');

// 4. Logo CSS: 110px → 45px
const oldLogoCSS = `.nav-logo img { height: 110px !important; width: auto !important; object-fit: contain; }`;
const newLogoCSS = `.nav-logo img { height: 45px !important; width: auto !important; object-fit: contain; }`;
if (!t.includes(oldLogoCSS)) { console.error('❌ logo CSS não encontrado'); process.exit(1); }
t = t.replace(oldLogoCSS, newLogoCSS);
console.log('✅ CSS: logo 110px → 45px');

// 5. Logo inline: 110px → 45px
const oldLogoInline = `style="height:110px;width:auto;"`;
const newLogoInline = `style="height:45px;width:auto;"`;
if (!t.includes(oldLogoInline)) { console.error('❌ logo inline não encontrado'); process.exit(1); }
t = t.replace(oldLogoInline, newLogoInline);
console.log('✅ Inline: logo 110px → 45px');

// 6. Salvar
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
