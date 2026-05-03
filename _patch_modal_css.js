const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Replace .modal-overlay block ──────────────────────────────────────────
const oldOverlay =
'.modal-overlay {\n' +
'  display: none;\n' +
'  position: fixed; inset: 0;\n' +
'  background: rgba(0,0,0,0.85);\n' +
'  z-index: 1000;\n' +
'  align-items: center; justify-content: center;\n' +
'  padding: 24px;\n' +
'  backdrop-filter: blur(4px);\n' +
'  -webkit-backdrop-filter: blur(4px);\n' +
'}';

const newOverlay =
'.modal-overlay {\n' +
'  display: none;\n' +
'  position: fixed; inset: 0;\n' +
'  background: rgba(0,0,0,0.85);\n' +
'  z-index: 1000;\n' +
'  align-items: center; justify-content: center;\n' +
'  padding: 24px;\n' +
'  backdrop-filter: blur(4px);\n' +
'  -webkit-backdrop-filter: blur(4px);\n' +
'}';

// Already matches — overlay is fine. Skip if identical.
if (t.includes(oldOverlay)) {
  console.log('✅ .modal-overlay já está correto (sem alteração)');
} else {
  console.warn('⚠️  .modal-overlay não encontrado com essa string exata');
}

// ── 2. Replace .modal-container block ────────────────────────────────────────
const oldContainer =
'.modal-container {\n' +
'  position: relative;\n' +
'  background: #0d0d0d;\n' +
'  border: 1px solid rgba(212,175,55,0.3);\n' +
'  border-radius: 4px;\n' +
'  width: 100%; max-width: 860px;\n' +
'  max-height: 90vh;\n' +
'  overflow-y: auto;\n' +
'  box-shadow: 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(212,175,55,0.08);\n' +
'}';

const newContainer =
'.modal-container {\n' +
'  position: relative;\n' +
'  background: #111111;\n' +
'  border: 1px solid rgba(201,168,76,0.3);\n' +
'  border-radius: 12px;\n' +
'  width: 100%; max-width: 860px;\n' +
'  max-height: 90vh;\n' +
'  overflow-y: auto;\n' +
'  box-shadow: 0 25px 60px rgba(0,0,0,0.8);\n' +
'}';

if (!t.includes(oldContainer)) { console.error('❌ .modal-container não encontrado'); process.exit(1); }
t = t.replace(oldContainer, newContainer);
console.log('✅ .modal-container atualizado');
console.log('   background: #111111');
console.log('   border: 1px solid rgba(201,168,76,0.3)');
console.log('   border-radius: 12px');
console.log('   box-shadow: 0 25px 60px rgba(0,0,0,0.8)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
