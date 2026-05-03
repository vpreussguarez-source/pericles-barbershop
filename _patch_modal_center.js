const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. .main-body ─────────────────────────────────────────────────────────────
const oldBody =
'.main-body {\n' +
'    padding: 40px 0 64px; flex: 1; overflow-y: auto;\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; box-sizing: border-box;\n' +
'  }';

const newBody =
'.main-body {\n' +
'    padding: 0 20px; flex: 1; overflow-y: auto;\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; box-sizing: border-box;\n' +
'  }';

if (!t.includes(oldBody)) { console.error('❌ .main-body não encontrado'); process.exit(1); }
t = t.replace(oldBody, newBody);
console.log('✅ .main-body: max-width:600px, margin:0 auto, width:100%, padding:0 20px');

// ── 2. .fade-enter ────────────────────────────────────────────────────────────
const oldFade = '.fade-enter { animation: fadeIn 0.25s ease forwards; }';
const newFade = '.fade-enter { animation: fadeIn 0.25s ease forwards; width: 100%; }';

if (!t.includes(oldFade)) { console.error('❌ .fade-enter não encontrado'); process.exit(1); }
t = t.replace(oldFade, newFade);
console.log('✅ .fade-enter: width:100% adicionado');

// ── 3. .modal-container ───────────────────────────────────────────────────────
const oldContainer =
'.modal-container {\n' +
'  position: relative;\n' +
'  background: #111111;\n' +
'  border: 1px solid rgba(201,168,76,0.3);\n' +
'  border-radius: 12px;\n' +
'  width: 100%; max-width: 860px;\n' +
'  max-height: 90vh;\n' +
'  overflow-y: auto;\n' +
'  box-shadow: 0 25px 60px rgba(0,0,0,0.8);\n' +
'  padding: 40px 60px;\n' +
'  box-sizing: border-box;\n' +
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
'  padding: 40px;\n' +
'  box-sizing: border-box;\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  align-items: center;\n' +
'}';

if (!t.includes(oldContainer)) { console.error('❌ .modal-container não encontrado'); process.exit(1); }
t = t.replace(oldContainer, newContainer);
console.log('✅ .modal-container: display:flex, flex-direction:column, align-items:center, padding:40px');

// ── 4. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  .main-body max-width:600px present:',   t.includes('max-width: 600px; width: 100%; margin: 0 auto') ? '✅' : '❌');
console.log('  .fade-enter width:100% present:',       t.includes('width: 100%; }') ? '✅' : '❌');
console.log('  .modal-container align-items:center:',  t.includes('align-items: center;') ? '✅' : '❌');
console.log('  .modal-container padding:40px:',        t.includes('padding: 40px;') ? '✅' : '❌');

// ── 5. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
