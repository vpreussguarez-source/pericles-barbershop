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
// 1. Atualizar CSS da nav: estado inicial transparente + classe .scrolled
// ═══════════════════════════════════════════════════════
const oldNavCSS = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px;
  background: rgba(13,12,10,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}`;

const newNavCSS = `nav {
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
}`;

if (!t.includes(oldNavCSS)) { console.error('❌ CSS da nav não encontrado'); process.exit(1); }
t = t.replace(oldNavCSS, newNavCSS);
console.log('✅ CSS da nav atualizado (transparente + classe .scrolled)');

// ═══════════════════════════════════════════════════════
// 2. Adicionar JS de scroll no bloco <script> existente
// ═══════════════════════════════════════════════════════
const scriptAnchor = `\n<script>\nfunction filterProd(btn, cat) {`;
const newScriptAnchor = `
<script>
// ── Navbar scroll behaviour ──────────────────────────────────────────────────
(function() {
  var nav = document.querySelector('nav');
  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

function filterProd(btn, cat) {`;

if (!t.includes(scriptAnchor)) { console.error('❌ Âncora do bloco <script> não encontrada'); process.exit(1); }
t = t.replace(scriptAnchor, newScriptAnchor);
console.log('✅ JS de scroll adicionado');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
