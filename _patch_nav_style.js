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
// 1. Atualizar CSS completo da nav
//    - padding 20px → 18px
//    - font-size 13px → 14px, letter-spacing 3px → 3.5px
//    - logo 48px → 52px
//    - adicionar ::before e ::after como cantos decorativos
// ═══════════════════════════════════════════════════════
const oldNavBlock = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px;
  background: transparent;
  backdrop-filter: none;
  border-bottom: 1px solid transparent;
  box-shadow: none;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
}
nav.scrolled {
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  box-shadow: 0 2px 24px rgba(0,0,0,0.4);
}
.nav-logo img { height: 48px; width: auto; object-fit: contain; }
.nav-links { display: flex; gap: 40px; list-style: none; }
.nav-links a {
  color: var(--white); text-decoration: none;
  font-family: var(--sf); font-size: 13px; font-weight: 500;
  letter-spacing: 3px; text-transform: uppercase;
  opacity: 0.65; transition: opacity .2s, color .2s;
}
.nav-links a:hover { opacity: 1; color: var(--gold); }
.nav-cta {
  background: var(--gold); color: var(--black);
  padding: 11px 28px;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
  text-decoration: none; transition: background .2s;
}
.nav-cta:hover { background: var(--gold2); }`;

const newNavBlock = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 52px;
  background: transparent;
  backdrop-filter: none;
  border-bottom: 1px solid transparent;
  box-shadow: none;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
}
nav.scrolled {
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  box-shadow: 0 2px 24px rgba(0,0,0,0.4);
}
nav::before, nav::after {
  content: '';
  position: absolute;
  width: 22px;
  top: 10px; bottom: 10px;
  border-color: rgba(201,168,76,0.45);
  border-style: solid;
  pointer-events: none;
  transition: border-color 0.4s ease;
}
nav::before { left: 18px; border-width: 1px 0 1px 1px; }
nav::after  { right: 18px; border-width: 1px 1px 1px 0; }
nav.scrolled::before, nav.scrolled::after {
  border-color: rgba(201,168,76,0.3);
}
.nav-logo img { height: 52px; width: auto; object-fit: contain; mix-blend-mode: lighten; }
.nav-links { display: flex; gap: 40px; list-style: none; }
.nav-links a {
  color: var(--white); text-decoration: none;
  font-family: var(--sf); font-size: 14px; font-weight: 500;
  letter-spacing: 3.5px; text-transform: uppercase;
  opacity: 0.65; transition: opacity .2s, color .2s;
}
.nav-links a:hover { opacity: 1; color: var(--gold); }
.nav-cta {
  background: var(--gold); color: var(--black);
  padding: 11px 28px;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
  text-decoration: none; transition: background .2s;
}
.nav-cta:hover { background: var(--gold2); }`;

if (!t.includes(oldNavBlock)) { console.error('❌ Bloco CSS da nav não encontrado'); process.exit(1); }
t = t.replace(oldNavBlock, newNavBlock);
console.log('✅ CSS da nav atualizado (padding 18px, font 14px, logo 52px, cantos decorativos)');

// ═══════════════════════════════════════════════════════
// 2. Garantir mix-blend-mode:lighten no img do navbar
//    (já estava via inline style, mas agora está no CSS também)
// ═══════════════════════════════════════════════════════
// O CSS já tem mix-blend-mode: lighten via .nav-logo img
// Remove o inline style do img para não duplicar (opcional mas limpo)
const oldNavImg = `<img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;">`;
const newNavImg = `<img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop">`;
if (t.includes(oldNavImg)) {
  t = t.replace(oldNavImg, newNavImg);
  console.log('✅ Inline style mix-blend-mode removido do img (agora controlado pelo CSS)');
}

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
