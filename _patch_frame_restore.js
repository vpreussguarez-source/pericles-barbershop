const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// 1. Restaurar CSS hero-frame antes do bloco HERO CORNERS
const anchor = `/* ── HERO CORNERS ── */`;
if (!t.includes(anchor)) { console.error('❌ âncora CSS não encontrada'); process.exit(1); }
const frameCSS = `.hero-frame {
  position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
  border: 1px solid rgba(196,146,42,0.35);
  pointer-events: none; z-index: 10;
}
`;
t = t.replace(anchor, frameCSS + anchor);
console.log('✅ CSS .hero-frame restaurado');

// 2. Restaurar HTML hero-frame
const oldDeco = `  <!-- Cantos decorativos dourados -->`;
const newDeco = `  <!-- Moldura decorativa dourada -->
  <div class="hero-frame"></div>
  <!-- Cantos decorativos dourados -->`;
if (!t.includes(oldDeco)) { console.error('❌ âncora HTML não encontrada'); process.exit(1); }
t = t.replace(oldDeco, newDeco);
console.log('✅ HTML .hero-frame restaurado');

// 3. Salvar
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
