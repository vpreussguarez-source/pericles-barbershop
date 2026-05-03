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
// 1. Restaurar hero-border no HTML do hero
// ═══════════════════════════════════════════════════════
const oldHeroDeco = `  <!-- Decorações douradas -->
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>`;

const newHeroDeco = `  <!-- Decorações douradas -->
  <div class="hero-border"></div>
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>`;

if (!t.includes(oldHeroDeco)) { console.error('❌ Decorações do hero não encontradas'); process.exit(1); }
t = t.replace(oldHeroDeco, newHeroDeco);
console.log('✅ hero-border restaurado no HTML do hero');

// ═══════════════════════════════════════════════════════
// 2. Atualizar CSS do hero-border: inset 20px, border dourado 0.4
// ═══════════════════════════════════════════════════════
const oldHBCSS = `.hero-border {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  border: 1px solid rgba(201,168,76,0.18);
  z-index: 0; pointer-events: none;
}`;

const newHBCSS = `.hero-border {
  position: absolute; inset: 20px;
  border: 1px solid rgba(196,146,42,0.4);
  z-index: 6; pointer-events: none;
}`;

if (!t.includes(oldHBCSS)) { console.error('❌ .hero-border CSS não encontrado'); process.exit(1); }
t = t.replace(oldHBCSS, newHBCSS);
console.log('✅ .hero-border CSS: inset 20px, border rgba(196,146,42,0.4)');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
