const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. After window.openBookingModal definition ───────────────────────────────
const defAnchor = "window.openBookingModal = function(attendantId) {";
const defIdx = t.indexOf(defAnchor);
if (defIdx === -1) { console.error('❌ openBookingModal definition not found'); process.exit(1); }

// Find the closing }; of the function definition
const closingIdx = t.indexOf('\n};\nwindow.closeBookingModal', defIdx);
if (closingIdx === -1) { console.error('❌ closing }; not found'); process.exit(1); }

const insertAfterDef = '\nconsole.log(\'[diag] openBookingModal definida:\', typeof window.openBookingModal);';
t = t.slice(0, closingIdx + 3) + insertAfterDef + t.slice(closingIdx + 3);
console.log('✅ console.log adicionado após definição de window.openBookingModal');

// ── 2. At start of Pericles card onclick ──────────────────────────────────────
const oldOnclick =
  'onclick="if(typeof window.openBookingModal===\'function\'){window.openBookingModal(\'pericles\');' +
  '}else{setTimeout(function(){if(typeof window.openBookingModal===\'function\')' +
  'window.openBookingModal(\'pericles\');},100);}"';

const newOnclick =
  'onclick="console.log(\'[diag] clique detectado, openBookingModal:\', typeof window.openBookingModal);' +
  'if(typeof window.openBookingModal===\'function\'){window.openBookingModal(\'pericles\');' +
  '}else{setTimeout(function(){if(typeof window.openBookingModal===\'function\')' +
  'window.openBookingModal(\'pericles\');},100);}"';

if (!t.includes(oldOnclick)) { console.error('❌ Pericles div onclick not found'); process.exit(1); }
t = t.replace(oldOnclick, newOnclick);
console.log('✅ console.log adicionado no início do onclick do card Pericles');

// Save
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo! Abra no navegador, F12 → Console, clique em AGENDAR no Pericles.');
