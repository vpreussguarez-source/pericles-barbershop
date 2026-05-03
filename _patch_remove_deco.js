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
// 1. Remover HTML das decorações do hero
// ═══════════════════════════════════════════════════════
const oldDecoHTML = `\n  <!-- Decorações douradas -->
  <div class="hero-border"></div>
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>`;
if (!t.includes(oldDecoHTML)) { console.error('❌ HTML decorações não encontrado'); process.exit(1); }
t = t.replace(oldDecoHTML, '');
console.log('✅ HTML: hero-border e hero-corners removidos');

// ═══════════════════════════════════════════════════════
// 2. Remover bloco CSS hero-border + comentário
// ═══════════════════════════════════════════════════════
const oldHBBlock = `/* ── gold border & corners ── */
.hero-border {
  position: absolute; top: -95px; left: 12px; right: 12px; bottom: 12px;
  border: 1px solid rgba(196,146,42,0.4);
  z-index: 9999; pointer-events: none;
}
/* hero-border decorative lines removed */`;
if (!t.includes(oldHBBlock)) { console.error('❌ CSS hero-border não encontrado'); process.exit(1); }
t = t.replace(oldHBBlock, '');
console.log('✅ CSS: .hero-border removido');

// ═══════════════════════════════════════════════════════
// 3. Remover CSS hero-corner (base + 4 variantes)
// ═══════════════════════════════════════════════════════
const oldCornerCSS = `.hero-corner {
  position: absolute; width: 32px; height: 32px;
  border-color: var(--gold); border-style: solid; z-index: 6; pointer-events: none;
}
.hero-corner.tl { top: 88px; left: 20px; border-width: 2px 0 0 2px; }
.hero-corner.tr { top: 88px; right: 20px; border-width: 2px 2px 0 0; }
.hero-corner.bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.hero-corner.br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }`;
if (!t.includes(oldCornerCSS)) { console.error('❌ CSS hero-corner não encontrado'); process.exit(1); }
t = t.replace(oldCornerCSS, '');
console.log('✅ CSS: .hero-corner (tl/tr/bl/br) removido');

// ═══════════════════════════════════════════════════════
// 4. Remover hero-border/corner dentro de media query
// ═══════════════════════════════════════════════════════
const oldMediaDeco = `  .hero-border { z-index: 5; }
  .hero-corner { z-index: 5; }`;
if (!t.includes(oldMediaDeco)) { console.error('❌ media query hero deco não encontrado'); process.exit(1); }
t = t.replace(oldMediaDeco, '');
console.log('✅ CSS: media query hero-border/corner removido');

// ═══════════════════════════════════════════════════════
// 5. Remover nav::after e nav.scrolled::after
// ═══════════════════════════════════════════════════════
const oldNavAfter = `nav::after {
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
if (!t.includes(oldNavAfter)) { console.error('❌ nav::after CSS não encontrado'); process.exit(1); }
t = t.replace(oldNavAfter, '');
console.log('✅ CSS: nav::after e nav.scrolled::after removidos');

// ═══════════════════════════════════════════════════════
// 6. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
