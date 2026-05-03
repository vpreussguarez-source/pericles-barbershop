const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Helper: build safe HTML onclick string for a given attendant ID
function safeOnclick(id) {
  return (
    'onclick="(function(){' +
    'var id=' + JSON.stringify(id) + ';' +
    'if(typeof window.openBookingModal===\'function\'){' +
    'window.openBookingModal(id);' +
    '}else{' +
    'setTimeout(function(){if(typeof window.openBookingModal===\'function\')window.openBookingModal(id);},100);' +
    '}})()"'
  );
}

// ── 1. Prof-card onclick attributes (plain HTML) ──────────────────────────────
const profCards = [
  { id: 'pericles',  old: "onclick=\"window.openBookingModal('pericles')\"" },
  { id: 'betina',    old: "onclick=\"window.openBookingModal('betina')\"" },
  { id: 'mary',      old: "onclick=\"window.openBookingModal('mary')\"" },
  { id: 'vitoria',   old: "onclick=\"window.openBookingModal('vitoria')\"" },
  { id: 'thayna',    old: "onclick=\"window.openBookingModal('thayna')\"" },
];

profCards.forEach(({ id, old }) => {
  if (!t.includes(old)) {
    console.error('❌ Não encontrado:', old);
    process.exit(1);
  }
  t = t.replace(old, safeOnclick(id));
  console.log('✅ prof-card', id, '→ safe guard');
});

// ── 2. JSX "Novo Agendamento" button ─────────────────────────────────────────
const oldJSX =
'<button className="btn btn-ghost" onClick={()=>{ window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

const newJSX =
'<button className="btn btn-ghost" onClick={()=>{\n' +
'                    if(typeof window.openBookingModal===\'function\'){\n' +
'                      window.openBookingModal();\n' +
'                    }else{\n' +
'                      setTimeout(()=>{\n' +
'                        if(typeof window.openBookingModal===\'function\') window.openBookingModal();\n' +
'                      },100);\n' +
'                    }\n' +
'                  }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

if (!t.includes(oldJSX)) { console.error('❌ Botão JSX não encontrado'); process.exit(1); }
t = t.replace(oldJSX, newJSX);
console.log('✅ Botão JSX "Novo Agendamento" → safe guard');

// ── 3. Audit: confirm no bare window.openBookingModal() calls remain ──────────
const bare = t.match(/onclick="window\.openBookingModal/g) || [];
const bareJSX = t.match(/onClick=\{[^}]*window\.openBookingModal\(\)/g) || [];
console.log('\nAudit:');
console.log('  Bare HTML onclick calls remaining:', bare.length === 0 ? '✅ none' : '⚠️  ' + bare.length);
console.log('  Bare JSX onClick calls remaining:', bareJSX.length === 0 ? '✅ none' : '⚠️  ' + bareJSX.length);

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
