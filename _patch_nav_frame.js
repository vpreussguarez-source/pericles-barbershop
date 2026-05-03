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
// 1. Mover hero-border do hero para dentro do <nav>
// ═══════════════════════════════════════════════════════

// Remove do hero (com a linha de comentário que o acompanha)
const oldHeroDecoDivs = `  <!-- Decorações douradas -->
  <div class="hero-border"></div>
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>`;

const newHeroDecoDivs = `  <!-- Decorações douradas -->
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>`;

if (!t.includes(oldHeroDecoDivs)) { console.error('❌ hero-border div no hero não encontrado'); process.exit(1); }
t = t.replace(oldHeroDecoDivs, newHeroDecoDivs);
console.log('✅ hero-border removido do hero');

// Insere dentro do <nav> como último filho (antes de </nav>)
const oldNavClose = `  </ul>
</nav>`;
const newNavClose = `  </ul>
  <div class="hero-border"></div>
</nav>`;

if (!t.includes(oldNavClose)) { console.error('❌ fechamento do nav não encontrado'); process.exit(1); }
t = t.replace(oldNavClose, newNavClose);
console.log('✅ hero-border inserido dentro do <nav>');

// ═══════════════════════════════════════════════════════
// 2. Atualizar CSS do hero-border: reposicionar para cobrir o nav (inset 0)
//    Mantém border e pointer-events; só muda top/right/bottom/left e z-index
// ═══════════════════════════════════════════════════════
const oldHBCSS = `.hero-border {
  position: absolute; top: 88px; right: 28px; bottom: 28px; left: 28px;
  border: 1px solid rgba(201,168,76,0.18);
  z-index: 6; pointer-events: none;
}`;

const newHBCSS = `.hero-border {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  border: 1px solid rgba(201,168,76,0.18);
  z-index: 0; pointer-events: none;
}`;

if (!t.includes(oldHBCSS)) { console.error('❌ .hero-border CSS não encontrado'); process.exit(1); }
t = t.replace(oldHBCSS, newHBCSS);
console.log('✅ .hero-border CSS: position absolute top/left/right/bottom: 0, z-index: 0');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
