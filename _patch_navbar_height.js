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
// 1. Aumentar altura da navbar: remover height fixo, usar padding vertical
//    Logo 48px + 20px top + 20px bottom = ~88px de altura total
// ═══════════════════════════════════════════════════════
const oldNavCSS = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px; height: 76px;
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}`;

const newNavCSS = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px;
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}`;

if (!t.includes(oldNavCSS)) { console.error('❌ CSS da nav não encontrado'); process.exit(1); }
t = t.replace(oldNavCSS, newNavCSS);
console.log('✅ Navbar: height fixo removido, padding: 20px 52px aplicado');

// ═══════════════════════════════════════════════════════
// 2. Adicionar scroll-padding-top ao html (para âncoras não ficarem
//    escondidas atrás da navbar ao clicar nos links do menu)
//    e body padding-top para que seções não-hero não fiquem sob a nav
// ═══════════════════════════════════════════════════════
const oldHtmlCSS = `html { scroll-behavior: smooth; }`;
const newHtmlCSS = `html { scroll-behavior: smooth; scroll-padding-top: 88px; }`;

if (!t.includes(oldHtmlCSS)) { console.error('❌ html CSS não encontrado'); process.exit(1); }
t = t.replace(oldHtmlCSS, newHtmlCSS);
console.log('✅ scroll-padding-top: 88px adicionado ao html');

// ═══════════════════════════════════════════════════════
// 3. O hero é height:100vh e cobre toda a tela — a navbar flutua sobre
//    ele corretamente. O body não precisa de padding-top porque o hero
//    ocupa 100vh. Para as demais seções, o scroll-padding-top já resolve
//    o posicionamento das âncoras. Nada mais a fazer.
// ═══════════════════════════════════════════════════════
console.log('ℹ️  Hero é 100vh — não precisa de padding-top no body');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
