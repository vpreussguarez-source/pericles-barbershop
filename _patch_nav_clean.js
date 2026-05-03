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
// 1. Remover hero-border de dentro do <nav>
// ═══════════════════════════════════════════════════════
const oldNavClose = `  </ul>
  <div class="hero-border"></div>
</nav>`;
const newNavClose = `  </ul>
</nav>`;
if (!t.includes(oldNavClose)) { console.error('❌ hero-border dentro do nav não encontrado'); process.exit(1); }
t = t.replace(oldNavClose, newNavClose);
console.log('✅ hero-border removido do nav');

// ═══════════════════════════════════════════════════════
// 2. Padding: 10px 52px → 8px 52px (CSS)
// ═══════════════════════════════════════════════════════
const oldPadCSS = `  padding: 10px 52px !important; min-height: 0 !important;`;
const newPadCSS = `  padding: 8px 52px !important; min-height: 0 !important;`;
if (!t.includes(oldPadCSS)) { console.error('❌ padding CSS não encontrado'); process.exit(1); }
t = t.replace(oldPadCSS, newPadCSS);
console.log('✅ CSS: padding 10px 52px → 8px 52px');

// ═══════════════════════════════════════════════════════
// 3. Padding: 10px 52px → 8px 52px (inline style)
// ═══════════════════════════════════════════════════════
const oldPadInline = `<nav style="padding:10px 52px;">`;
const newPadInline = `<nav style="padding:8px 52px;">`;
if (!t.includes(oldPadInline)) { console.error('❌ padding inline não encontrado'); process.exit(1); }
t = t.replace(oldPadInline, newPadInline);
console.log('✅ Inline: padding 10px 52px → 8px 52px');

// ═══════════════════════════════════════════════════════
// 4. Mobile media query: 10px 20px → 8px 20px
// ═══════════════════════════════════════════════════════
const oldMob = `nav { padding: 10px 20px !important; }`;
const newMob = `nav { padding: 8px 20px !important; }`;
if (!t.includes(oldMob)) { console.error('❌ media query padding não encontrado'); process.exit(1); }
t = t.replace(oldMob, newMob);
console.log('✅ Mobile: padding 10px 20px → 8px 20px');

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
