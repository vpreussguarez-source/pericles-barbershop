const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Add window.closeAndScrollToAgendamento to the plain <script> block ─────
// Find the closing of the first plain <script> block (the main JS)
const scriptOpen = '<script>';
const scriptClose = '</script>';
const firstScriptStart = t.indexOf(scriptOpen);
const firstScriptEnd   = t.indexOf(scriptClose, firstScriptStart);

if (firstScriptStart === -1) { console.error('❌ Plain <script> not found'); process.exit(1); }

// Insert just before the closing </script>
const fnDef =
'\nwindow.closeAndScrollToAgendamento = function() {\n' +
'  var overlay = document.getElementById(\'booking-modal-overlay\');\n' +
'  if (overlay) overlay.style.display = \'none\';\n' +
'  setTimeout(function() {\n' +
'    var section = document.getElementById(\'agendamento\');\n' +
'    if (section) section.scrollIntoView({behavior: \'smooth\'});\n' +
'  }, 150);\n' +
'};\n';

t = t.slice(0, firstScriptEnd) + fnDef + t.slice(firstScriptEnd);
console.log('✅ window.closeAndScrollToAgendamento adicionado ao <script> principal');

// ── 2. Update "← Voltar" button in step 1 ─────────────────────────────────────
const oldBtn =
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  e.stopPropagation();\n' +
'                  document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                  setTimeout(()=>{\n' +
'                    document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                  }, 100);\n' +
'                }}>← Voltar</button>';

const newBtn =
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  e.stopPropagation();\n' +
'                  window.closeAndScrollToAgendamento();\n' +
'                }}>← Voltar</button>';

if (!t.includes(oldBtn)) {
  console.error('❌ Botão "← Voltar" não encontrado — contexto:');
  const idx = t.indexOf('← Voltar');
  if (idx !== -1) console.log(JSON.stringify(t.slice(idx - 250, idx + 20)));
  process.exit(1);
}

t = t.replace(oldBtn, newBtn);
console.log('✅ Botão "← Voltar" step 1: chama window.closeAndScrollToAgendamento()');

// ── 3. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  closeAndScrollToAgendamento defined:', t.includes('window.closeAndScrollToAgendamento = function()') ? '✅' : '❌');
console.log('  Button calls it:', t.includes('window.closeAndScrollToAgendamento()') ? '✅' : '❌');
console.log('  No direct DOM in button:', !t.includes("getElementById('booking-modal-overlay').style.display") ? '✅' : '⚠️  still present');

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
