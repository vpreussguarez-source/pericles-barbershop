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
// 1. Remover hero-frame CSS (retângulo conector)
// ═══════════════════════════════════════════════════════
const oldFrameCSS = `.hero-frame {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}
`;
if (!t.includes(oldFrameCSS)) { console.error('❌ .hero-frame CSS não encontrado'); process.exit(1); }
t = t.replace(oldFrameCSS, '');
console.log('✅ CSS .hero-frame removido');

// ═══════════════════════════════════════════════════════
// 2. Remover hero-frame HTML
// ═══════════════════════════════════════════════════════
const oldFrameHTML = `  <!-- Moldura decorativa dourada -->
  <div class="hero-frame"></div>
  <!-- Cantos decorativos dourados -->`;
const newFrameHTML = `  <!-- Cantos decorativos dourados -->`;
if (!t.includes(oldFrameHTML)) { console.error('❌ .hero-frame HTML não encontrado'); process.exit(1); }
t = t.replace(oldFrameHTML, newFrameHTML);
console.log('✅ HTML .hero-frame removido');

// ═══════════════════════════════════════════════════════
// 3. Aumentar braços dos L: 60px → 80px (tamanho do div container)
// ═══════════════════════════════════════════════════════
const oldCornerBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 60px; height: 60px;
  pointer-events: none; z-index: 10;
}`;
const newCornerBase = `.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 80px; height: 80px;
  pointer-events: none; z-index: 10;
}`;
if (!t.includes(oldCornerBase)) { console.error('❌ CSS base dos cantos não encontrado'); process.exit(1); }
t = t.replace(oldCornerBase, newCornerBase);
console.log('✅ Container dos cantos: 60px → 80px');

// ═══════════════════════════════════════════════════════
// 4. Aumentar braços dos L nos ::before e ::after: 60px → 80px
// ═══════════════════════════════════════════════════════
const oldPseudo = `.hero-corner-tl::before { top: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-tr::before { top: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px;  height: 60px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-br::before { bottom: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px;  height: 60px; }`;

const newPseudo = `.hero-corner-tl::before { top: 0; left: 0; width: 80px; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px;  height: 80px; }
.hero-corner-tr::before { top: 0; right: 0; width: 80px; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px;  height: 80px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 80px; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px;  height: 80px; }
.hero-corner-br::before { bottom: 0; right: 0; width: 80px; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px;  height: 80px; }`;

if (!t.includes(oldPseudo)) { console.error('❌ CSS ::before/::after não encontrado'); process.exit(1); }
t = t.replace(oldPseudo, newPseudo);
console.log('✅ Braços dos L (::before/::after): 60px → 80px');

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
