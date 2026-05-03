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
// 1. Substituir .hero-right CSS: remover ::before, adicionar mask
// ═══════════════════════════════════════════════════════
const oldRight = `.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
}
.hero-right::before {
  content: '';
  position: absolute; top: 0; left: 0; bottom: 0;
  width: 80px;
  background: linear-gradient(to right, rgba(13,12,10,0.35), transparent);
  z-index: 1; pointer-events: none;
}`;

const newRight = `.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, black 60%, transparent 100%);
  mask-image: linear-gradient(to right, black 60%, transparent 100%);
}`;

if (!t.includes(oldRight)) { console.error('❌ .hero-right CSS não encontrado'); process.exit(1); }
t = t.replace(oldRight, newRight);
console.log('✅ .hero-right: ::before removido, mask-image adicionado');

// ═══════════════════════════════════════════════════════
// 2. Remover bloco CSS do .hero-fade
// ═══════════════════════════════════════════════════════
const oldFadeCSS = `
/* ── fade de transição centro ── */
.hero-fade {
  position: absolute;
  top: 0; bottom: 0;
  left: calc(60% - 100px);
  width: 260px;
  background: linear-gradient(to right, var(--black) 0%, rgba(13,12,10,0.75) 45%, transparent 100%);
  z-index: 3; pointer-events: none;
}`;

if (!t.includes(oldFadeCSS)) { console.error('❌ .hero-fade CSS não encontrado'); process.exit(1); }
t = t.replace(oldFadeCSS, '');
console.log('✅ CSS do .hero-fade removido');

// ═══════════════════════════════════════════════════════
// 3. Remover <div class="hero-fade"> do HTML
// ═══════════════════════════════════════════════════════
const oldFadeHTML = `
  <!-- Fade gradiente de transição -->
  <div class="hero-fade"></div>
`;
if (!t.includes(oldFadeHTML)) { console.error('❌ div.hero-fade HTML não encontrado'); process.exit(1); }
t = t.replace(oldFadeHTML, '\n');
console.log('✅ <div class="hero-fade"> removido do HTML');

// ═══════════════════════════════════════════════════════
// 4. Mobile: overflow:hidden no .hero-left + reduzir font-size do título
// ═══════════════════════════════════════════════════════
const oldMobileLeft = `  .hero-left {
    flex: unset;
    position: absolute; inset: 0;
    width: 100%; background: transparent;
    padding: 0 24px;
    align-items: center; justify-content: center;
    z-index: 4;
  }`;

const newMobileLeft = `  .hero-left {
    flex: unset;
    position: absolute; inset: 0;
    width: 100%; background: transparent;
    padding: 0 24px;
    align-items: center; justify-content: center;
    z-index: 4;
    overflow: hidden;
  }`;

if (!t.includes(oldMobileLeft)) { console.error('❌ .hero-left mobile CSS não encontrado'); process.exit(1); }
t = t.replace(oldMobileLeft, newMobileLeft);
console.log('✅ .hero-left mobile: overflow:hidden adicionado');

// Reduzir font-size do título no mobile
const oldH1Mobile = `  .hero-h1 { font-size: clamp(60px, 11vw, 128px); }`;
const newH1Mobile = `  .hero-h1 { font-size: clamp(36px, 9vw, 56px); }`;

if (!t.includes(oldH1Mobile)) { console.error('❌ .hero-h1 mobile CSS não encontrado'); process.exit(1); }
t = t.replace(oldH1Mobile, newH1Mobile);
console.log('✅ .hero-h1 mobile: font-size reduzido para clamp(36px, 9vw, 56px)');

// Remover linha .hero-fade { display: none; } do mobile (não existe mais)
const oldFadeMobile = `\n  .hero-fade { display: none; }`;
if (t.includes(oldFadeMobile)) {
  t = t.replace(oldFadeMobile, '');
  console.log('✅ .hero-fade display:none removido do mobile');
}

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
