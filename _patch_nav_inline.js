const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ═══════════════════════════════════════════════════════
// 1. Corrigir a media query que zera o padding da nav
// ═══════════════════════════════════════════════════════
const oldMediaNav = `  nav { padding: 0 20px; }`;
const newMediaNav = `  nav { padding: 20px !important; min-height: 80px !important; }`;
if (!t.includes(oldMediaNav)) { console.error('❌ media query nav não encontrada'); process.exit(1); }
t = t.replace(oldMediaNav, newMediaNav);
console.log('✅ @media (max-width:700px): nav padding/min-height corrigidos com !important');

// ═══════════════════════════════════════════════════════
// 2. Adicionar style inline no elemento <nav>
// ═══════════════════════════════════════════════════════
const oldNavEl = `<nav>`;
const newNavEl = `<nav style="min-height:80px;padding:20px 52px;">`;
if (!t.includes(oldNavEl)) { console.error('❌ <nav> não encontrado'); process.exit(1); }
t = t.replace(oldNavEl, newNavEl);
console.log('✅ style inline adicionado ao <nav>');

// ═══════════════════════════════════════════════════════
// 3. Adicionar style inline na <img> da logo
// ═══════════════════════════════════════════════════════
const oldLogoImg = `<img src="logo.png" alt="Pericles Barbershop">`;
const newLogoImg = `<img src="logo.png" alt="Pericles Barbershop" style="height:55px;width:auto;">`;
if (!t.includes(oldLogoImg)) { console.error('❌ img logo.png não encontrado'); process.exit(1); }
t = t.replace(oldLogoImg, newLogoImg);
console.log('✅ style inline adicionado ao <img> da logo (height:55px)');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
