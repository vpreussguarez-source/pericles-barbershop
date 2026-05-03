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
// 1. Remover hero-border::before e ::after (linha dourada 1px explícita)
// ═══════════════════════════════════════════════════════
const oldHBPseudo = `.hero-border::before, .hero-border::after {
  content: ''; position: absolute; background: var(--gold);
}
.hero-border::before { top: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }
.hero-border::after  { bottom: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }`;
if (!t.includes(oldHBPseudo)) { console.error('❌ hero-border pseudo-elements não encontrados'); process.exit(1); }
t = t.replace(oldHBPseudo, `/* hero-border decorative lines removed */`);
console.log('✅ hero-border::before e ::after removidos');

// ═══════════════════════════════════════════════════════
// 2. Mover topo do hero-border para abaixo da navbar (88px)
// ═══════════════════════════════════════════════════════
const oldHB = `.hero-border {
  position: absolute; inset: 28px; border: 1px solid rgba(201,168,76,0.18);
  z-index: 6; pointer-events: none;
}`;
const newHB = `.hero-border {
  position: absolute; top: 88px; right: 28px; bottom: 28px; left: 28px;
  border: 1px solid rgba(201,168,76,0.18);
  z-index: 6; pointer-events: none;
}`;
if (!t.includes(oldHB)) { console.error('❌ .hero-border não encontrado'); process.exit(1); }
t = t.replace(oldHB, newHB);
console.log('✅ hero-border: top movido de 28px → 88px (abaixo da navbar)');

// ═══════════════════════════════════════════════════════
// 3. Mover hero-corner.tl e .tr para abaixo da navbar (88px)
// ═══════════════════════════════════════════════════════
const oldCornerTL = `.hero-corner.tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }`;
const newCornerTL = `.hero-corner.tl { top: 88px; left: 20px; border-width: 2px 0 0 2px; }`;
if (!t.includes(oldCornerTL)) { console.error('❌ .hero-corner.tl não encontrado'); process.exit(1); }
t = t.replace(oldCornerTL, newCornerTL);
console.log('✅ hero-corner.tl: top 20px → 88px');

const oldCornerTR = `.hero-corner.tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }`;
const newCornerTR = `.hero-corner.tr { top: 88px; right: 20px; border-width: 2px 2px 0 0; }`;
if (!t.includes(oldCornerTR)) { console.error('❌ .hero-corner.tr não encontrado'); process.exit(1); }
t = t.replace(oldCornerTR, newCornerTR);
console.log('✅ hero-corner.tr: top 20px → 88px');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
