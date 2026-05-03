const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Replace window.closeAndScrollToAgendamento with closing-flag version ───
const oldFn =
'window.closeAndScrollToAgendamento = function() {\n' +
'  var overlay = document.getElementById(\'booking-modal-overlay\');\n' +
'  if (overlay) overlay.style.display = \'none\';\n' +
'  setTimeout(function() {\n' +
'    var section = document.getElementById(\'agendamento\');\n' +
'    if (section) section.scrollIntoView({behavior: \'smooth\'});\n' +
'  }, 150);\n' +
'};';

const newFn =
'window.closeAndScrollToAgendamento = function() {\n' +
'  var overlay = document.getElementById(\'booking-modal-overlay\');\n' +
'  if (!overlay) return;\n' +
'  overlay.dataset.closing = \'true\';\n' +
'  overlay.style.display = \'none\';\n' +
'  setTimeout(function() {\n' +
'    delete overlay.dataset.closing;\n' +
'    var section = document.getElementById(\'agendamento\');\n' +
'    if (section) section.scrollIntoView({behavior: \'smooth\'});\n' +
'  }, 300);\n' +
'};';

if (!t.includes(oldFn)) { console.error('❌ closeAndScrollToAgendamento não encontrado'); process.exit(1); }
t = t.replace(oldFn, newFn);
console.log('✅ window.closeAndScrollToAgendamento: closing flag adicionado');

// ── 2. Update overlay onclick to check closing flag ───────────────────────────
const oldOverlayOnclick =
  'onclick="if(event.target===this)window.closeBookingModal()"';

const newOverlayOnclick =
  'onclick="if(this.dataset.closing)return;if(event.target===this)window.closeBookingModal()"';

if (!t.includes(oldOverlayOnclick)) { console.error('❌ Overlay onclick não encontrado'); process.exit(1); }
t = t.replace(oldOverlayOnclick, newOverlayOnclick);
console.log('✅ Overlay onclick: verificação dataset.closing adicionada');

// ── 3. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  overlay.dataset.closing set:',    t.includes("overlay.dataset.closing = 'true'") ? '✅' : '❌');
console.log('  delete overlay.dataset.closing:',  t.includes('delete overlay.dataset.closing') ? '✅' : '❌');
console.log('  overlay onclick guard:',           t.includes('if(this.dataset.closing)return;') ? '✅' : '❌');

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
