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
// 1. Font-size: 18px → 20px
// ═══════════════════════════════════════════════════════
const oldFont = `font-size: 18px !important;`;
const newFont = `font-size: 20px !important;`;
if (!t.includes(oldFont)) { console.error('❌ font-size 18px não encontrado'); process.exit(1); }
t = t.replace(oldFont, newFont);
console.log('✅ Menu: font-size 18px → 20px !important');

// ═══════════════════════════════════════════════════════
// 2a. Nav CSS: padding 20px 52px → 12px 52px
// ═══════════════════════════════════════════════════════
const oldNavPad = `  padding: 20px 52px !important; min-height: 80px !important;`;
const newNavPad = `  padding: 12px 52px !important; min-height: 80px !important;`;
if (!t.includes(oldNavPad)) { console.error('❌ nav padding CSS não encontrado'); process.exit(1); }
t = t.replace(oldNavPad, newNavPad);
console.log('✅ Nav CSS: padding 20px 52px → 12px 52px');

// ═══════════════════════════════════════════════════════
// 2b. Nav inline style: padding:20px 52px → padding:12px 52px
// ═══════════════════════════════════════════════════════
const oldNavInline = `<nav style="min-height:80px;padding:20px 52px;">`;
const newNavInline = `<nav style="min-height:80px;padding:12px 52px;">`;
if (!t.includes(oldNavInline)) { console.error('❌ nav inline style não encontrado'); process.exit(1); }
t = t.replace(oldNavInline, newNavInline);
console.log('✅ Nav inline: padding 20px 52px → 12px 52px');

// ═══════════════════════════════════════════════════════
// 2c. Mobile media query: padding 20px → 12px
// ═══════════════════════════════════════════════════════
const oldMediaPad = `nav { padding: 20px !important; min-height: 80px !important; }`;
const newMediaPad = `nav { padding: 12px 20px !important; min-height: 80px !important; }`;
if (!t.includes(oldMediaPad)) { console.error('❌ media query nav não encontrada'); process.exit(1); }
t = t.replace(oldMediaPad, newMediaPad);
console.log('✅ Media query: nav padding 20px → 12px');

// ═══════════════════════════════════════════════════════
// 3. Hero: adicionar padding-top igual à altura real da navbar
//    Nav height = 12px top + 110px logo + 12px bottom = 134px
// ═══════════════════════════════════════════════════════
const oldHero = `.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; flex-direction: row; align-items: stretch;
  overflow: hidden;
  background: var(--black);
}`;
const newHero = `.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; flex-direction: row; align-items: stretch;
  overflow: hidden;
  background: var(--black);
  padding-top: 134px;
}`;
if (!t.includes(oldHero)) { console.error('❌ .hero CSS não encontrado'); process.exit(1); }
t = t.replace(oldHero, newHero);
console.log('✅ Hero: padding-top: 134px adicionado (= navbar height)');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
