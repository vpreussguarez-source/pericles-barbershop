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
// 1. CSS do frame retangular
// ═══════════════════════════════════════════════════════
const anchor = `/* ── HERO CORNERS ── */`;
if (!t.includes(anchor)) { console.error('❌ âncora CSS não encontrada'); process.exit(1); }

const frameCSS = `.hero-frame {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}
`;

t = t.replace(anchor, frameCSS + anchor);
console.log('✅ CSS .hero-frame adicionado');

// ═══════════════════════════════════════════════════════
// 2. HTML: inserir div antes dos cantos
// ═══════════════════════════════════════════════════════
const oldDeco = `  <!-- Cantos decorativos dourados -->
  <div class="hero-corner-tl"></div>`;
const newDeco = `  <!-- Moldura decorativa dourada -->
  <div class="hero-frame"></div>
  <!-- Cantos decorativos dourados -->
  <div class="hero-corner-tl"></div>`;

if (!t.includes(oldDeco)) { console.error('❌ HTML dos cantos não encontrado'); process.exit(1); }
t = t.replace(oldDeco, newDeco);
console.log('✅ HTML .hero-frame inserido no hero');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
