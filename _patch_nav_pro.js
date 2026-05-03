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
// 1. Nav CSS completo: padding 10px, border-bottom 0.3, + ::after frame decorativo
//    Nav height = 10px + 110px logo + 10px = 130px
// ═══════════════════════════════════════════════════════
const oldNavCSS = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 12px 52px !important; min-height: 80px !important;
  margin: 0 !important; outline: none !important;
  border: none !important; border-bottom: 1px solid transparent !important;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: none;
  border-bottom: 1px solid rgba(196,146,42,0.4) !important;
}`;

const newNavCSS = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 10px 52px !important; min-height: 0 !important;
  margin: 0 !important; outline: none !important;
  border: none !important; border-bottom: 1px solid transparent !important;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: none;
  border-bottom: 1px solid rgba(196,146,42,0.3) !important;
}
nav::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-left: 1px solid rgba(196,146,42,0.15);
  border-right: 1px solid rgba(196,146,42,0.15);
  transition: border-color 0.4s ease;
}
nav.scrolled::after {
  border-left-color: rgba(196,146,42,0.2);
  border-right-color: rgba(196,146,42,0.2);
}`;

if (!t.includes(oldNavCSS)) { console.error('❌ Nav CSS não encontrado'); process.exit(1); }
t = t.replace(oldNavCSS, newNavCSS);
console.log('✅ Nav CSS: padding 10px 52px, border-bottom 0.3, ::after decorativo com inset:0');

// ═══════════════════════════════════════════════════════
// 2. Nav inline style: padding:12px 52px → 10px 52px
// ═══════════════════════════════════════════════════════
const oldInline = `<nav style="min-height:80px;padding:12px 52px;">`;
const newInline = `<nav style="padding:10px 52px;">`;
if (!t.includes(oldInline)) { console.error('❌ Nav inline não encontrado'); process.exit(1); }
t = t.replace(oldInline, newInline);
console.log('✅ Nav inline: padding 10px 52px, min-height removido');

// ═══════════════════════════════════════════════════════
// 3. Media query mobile: 12px 20px → 10px 20px
// ═══════════════════════════════════════════════════════
const oldMob = `nav { padding: 12px 20px !important; min-height: 80px !important; }`;
const newMob = `nav { padding: 10px 20px !important; }`;
if (!t.includes(oldMob)) { console.error('❌ Media query nav não encontrada'); process.exit(1); }
t = t.replace(oldMob, newMob);
console.log('✅ Mobile media query: padding 10px 20px');

// ═══════════════════════════════════════════════════════
// 4. Hero padding-top: 134px → 130px (10+110+10)
// ═══════════════════════════════════════════════════════
const oldHero = `  padding-top: 134px;`;
const newHero = `  padding-top: 130px;`;
if (!t.includes(oldHero)) { console.error('❌ Hero padding-top não encontrado'); process.exit(1); }
t = t.replace(oldHero, newHero);
console.log('✅ Hero padding-top: 134px → 130px');

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
