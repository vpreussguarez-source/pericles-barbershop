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
// 1. Remover "nav" da regra residual que aplica margin-top: 8px
//    (sobra de patch anterior do .foot-loc-row)
// ═══════════════════════════════════════════════════════
const oldResidualRule = `section, nav, .foot-loc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}`;
const newResidualRule = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}`;
if (!t.includes(oldResidualRule)) { console.error('❌ Regra residual não encontrada'); process.exit(1); }
t = t.replace(oldResidualRule, newResidualRule);
console.log('✅ "nav" removido da regra residual (margin-top: 8px eliminado da navbar)');

// ═══════════════════════════════════════════════════════
// 2. Atualizar CSS da nav: min-height 80px, logo 60px,
//    font-size 14px, sem borda/linha dourada
// ═══════════════════════════════════════════════════════
const oldNavCSS = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px; min-height: 70px;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(196,146,42,0.2);
}
.nav-logo img { height: 55px; width: auto; object-fit: contain; mix-blend-mode: lighten; }
.nav-links { display: flex; gap: 40px; list-style: none; }
.nav-links a {
  color: #ffffff; text-decoration: none;
  font-family: var(--sf); font-size: 13px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  opacity: 0.8; transition: opacity .2s, color .2s;
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

const newNavCSS = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px; min-height: 80px;
  margin: 0; border: none; outline: none;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(196,146,42,0.2);
}
.nav-logo img { height: 60px; width: auto; object-fit: contain; mix-blend-mode: lighten; }
.nav-links { display: flex; gap: 40px; list-style: none; }
.nav-links a {
  color: #ffffff; text-decoration: none;
  font-family: var(--sf); font-size: 14px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  opacity: 0.8; transition: opacity .2s, color .2s;
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

if (!t.includes(oldNavCSS)) { console.error('❌ CSS da nav não encontrado'); process.exit(1); }
t = t.replace(oldNavCSS, newNavCSS);
console.log('✅ Nav CSS atualizado: min-height 80px, logo 60px, font-size 14px');

// ═══════════════════════════════════════════════════════
// 3. Atualizar scroll-padding-top para bater com nova altura
// ═══════════════════════════════════════════════════════
const oldHtml = `html { scroll-behavior: smooth; scroll-padding-top: 88px; }`;
const newHtml = `html { scroll-behavior: smooth; scroll-padding-top: 100px; }`;
if (!t.includes(oldHtml)) { console.error('❌ html CSS não encontrado'); process.exit(1); }
t = t.replace(oldHtml, newHtml);
console.log('✅ scroll-padding-top atualizado para 100px');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
