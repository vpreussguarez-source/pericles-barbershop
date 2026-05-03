const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Trocar src da logo na navbar
const oldNavImg = `<img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop">`;
const newNavImg = `<img src="logo.png" alt="Pericles Barbershop">`;
if (!t.includes(oldNavImg)) { console.error('❌ img da navbar não encontrado'); process.exit(1); }
t = t.replace(oldNavImg, newNavImg);
console.log('✅ src da logo: UUID → logo.png');

// 2. Remover mix-blend-mode: lighten do CSS
const oldLogoCSS = `.nav-logo img { height: 55px !important; width: auto !important; object-fit: contain; mix-blend-mode: lighten; }`;
const newLogoCSS = `.nav-logo img { height: 55px !important; width: auto !important; object-fit: contain; }`;
if (!t.includes(oldLogoCSS)) { console.error('❌ .nav-logo img CSS não encontrado'); process.exit(1); }
t = t.replace(oldLogoCSS, newLogoCSS);
console.log('✅ mix-blend-mode: lighten removido de .nav-logo img');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
