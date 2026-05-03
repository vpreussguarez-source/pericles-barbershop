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
// 1. Adicionar CSS dos 4 cantos em L antes do bloco /* ── HERO */
// ═══════════════════════════════════════════════════════
const heroCSS = `/* ── HERO (full-screen bg, estilo v1 + elementos v`;
if (!t.includes(heroCSS)) { console.error('❌ Âncora do bloco HERO CSS não encontrada'); process.exit(1); }

const cornerCSS = `/* ── HERO CORNERS ── */
.hero-corner-tl,
.hero-corner-tr,
.hero-corner-bl,
.hero-corner-br {
  position: absolute;
  width: 60px; height: 60px;
  pointer-events: none; z-index: 2;
}
.hero-corner-tl { top: 15px; left: 15px; }
.hero-corner-tr { top: 15px; right: 15px; }
.hero-corner-bl { bottom: 15px; left: 15px; }
.hero-corner-br { bottom: 15px; right: 15px; }
.hero-corner-tl::before, .hero-corner-tl::after,
.hero-corner-tr::before, .hero-corner-tr::after,
.hero-corner-bl::before, .hero-corner-bl::after,
.hero-corner-br::before, .hero-corner-br::after {
  content: ''; position: absolute;
  background: rgba(196,146,42,0.7);
}
.hero-corner-tl::before { top: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-tr::before { top: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px;  height: 60px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 60px; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px;  height: 60px; }
.hero-corner-br::before { bottom: 0; right: 0; width: 60px; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px;  height: 60px; }

`;

t = t.replace(heroCSS, cornerCSS + heroCSS);
console.log('✅ CSS: 4 cantos em L adicionados');

// ═══════════════════════════════════════════════════════
// 2. Adicionar os 4 divs no HTML do hero (antes de </section>)
// ═══════════════════════════════════════════════════════
const oldHeroEnd = `</section>

<!-- SOBRE -->`;
const newHeroEnd = `
  <!-- Cantos decorativos dourados -->
  <div class="hero-corner-tl"></div>
  <div class="hero-corner-tr"></div>
  <div class="hero-corner-bl"></div>
  <div class="hero-corner-br"></div>

</section>

<!-- SOBRE -->`;

if (!t.includes(oldHeroEnd)) { console.error('❌ Fim da seção hero não encontrado'); process.exit(1); }
t = t.replace(oldHeroEnd, newHeroEnd);
console.log('✅ HTML: 4 divs de canto inseridos no hero');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
