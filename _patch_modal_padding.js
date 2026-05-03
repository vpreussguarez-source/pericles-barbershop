const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Add padding to .modal-container ───────────────────────────────────────
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
'  padding: 40px 60px;\n' +
'  box-sizing: border-box;\n' +
'}';

if (!t.includes(oldContainer)) { console.error('❌ .modal-container não encontrado'); process.exit(1); }
t = t.replace(oldContainer, newContainer);
console.log('✅ .modal-container: padding: 40px 60px + box-sizing: border-box');

// ── 2. Update .main-header — max-width 960px → 600px + margin: 0 auto ────────
const oldHeader =
'.main-header {\n' +
'    padding: 48px 56px 32px;\n' +
'    border-bottom: 1px solid rgba(196,146,42,0.1);\n' +
'    max-width: 960px; width: 100%; position: relative;\n' +
'  }';

const newHeader =
'.main-header {\n' +
'    padding: 32px 0 24px;\n' +
'    border-bottom: 1px solid rgba(196,146,42,0.1);\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; position: relative;\n' +
'  }';

if (!t.includes(oldHeader)) { console.error('❌ .main-header não encontrado'); process.exit(1); }
t = t.replace(oldHeader, newHeader);
console.log('✅ .main-header: max-width 960→600, margin: 0 auto, padding lateral removido (já vem do container)');

// ── 3. Update .main-body — max-width 960px → 600px + margin: 0 auto ──────────
// Note: .main-body appears twice in the template (duplicate definition) — replace all
const oldBody =
'.main-body {\n' +
'    padding: 40px 56px 64px; flex: 1; overflow-y: auto;\n' +
'    max-width: 960px; width: 100%; box-sizing: border-box;\n' +
'  }';

const newBody =
'.main-body {\n' +
'    padding: 40px 0 64px; flex: 1; overflow-y: auto;\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; box-sizing: border-box;\n' +
'  }';

const bodyCount = t.split(oldBody).length - 1;
if (bodyCount === 0) { console.error('❌ .main-body não encontrado'); process.exit(1); }
t = t.split(oldBody).join(newBody);
console.log('✅ .main-body: max-width 960→600, margin: 0 auto, padding lateral removido (' + bodyCount + ' ocorrência(s))');

// ── 4. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  padding: 40px 60px in .modal-container:', t.includes('padding: 40px 60px') ? '✅' : '❌');
console.log('  max-width: 600px in .main-header:',       t.includes('max-width: 600px; width: 100%; margin: 0 auto; position') ? '✅' : '❌');
console.log('  max-width: 600px in .main-body:',         t.includes('max-width: 600px; width: 100%; margin: 0 auto; box-sizing') ? '✅' : '❌');
console.log('  960px remaining:',                        (t.match(/max-width: 960px/g) || []).length === 0 ? '✅ none' : '⚠️  still present');

// ── 5. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
