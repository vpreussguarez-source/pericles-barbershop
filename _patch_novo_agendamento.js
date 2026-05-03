const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Locate the button precisely in the decoded template
const anchor = 'setBookingRec(null); setSubmitErr(\'\'); go(1);';
const anchorPos = t.indexOf(anchor);
if (anchorPos === -1) { console.error('❌ Âncora não encontrada'); process.exit(1); }
console.log('Anchor found at:', anchorPos);

// Show surrounding context
const ctx = t.slice(anchorPos - 150, anchorPos + 100);
console.log('Context:', JSON.stringify(ctx));

// Build old and new strings from the decoded template
const oldBtn =
'<button className="btn btn-ghost" onClick={()=>{\n' +
'                    setBooking({attendant:null,services:[],date:null,time:null,clientName:\'\',clientPhone:\'\'});\n' +
'                    setBookingRec(null); setSubmitErr(\'\'); go(1);\n' +
'                  }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

if (!t.includes(oldBtn)) {
  // Show actual indentation around anchor
  const raw = t.slice(anchorPos - 200, anchorPos + 150);
  console.error('❌ String exata não bate. Raw context:', JSON.stringify(raw));
  process.exit(1);
}

const newBtn =
'<button className="btn btn-ghost" onClick={()=>{ window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

t = t.replace(oldBtn, newBtn);
console.log('✅ onClick substituído por window.openBookingModal()');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
