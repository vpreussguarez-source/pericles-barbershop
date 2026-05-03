const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// The step 2 btn-row is uniquely identified by the "disabled={!booking.services.length}" on the Continuar button.
// Replace only the btn-row that contains that unique marker.
const oldBtnRow =
'                <div className="btn-row">\n' +
'                  <button className="btn btn-ghost" onClick={back}>← Voltar</button>\n' +
'                  <button className="btn btn-primary" disabled={!booking.services.length} onClick={next}>Continuar →</button>\n' +
'                </div>';

const newBtnRow =
'                <div className="btn-row">\n' +
'                  <button className="btn btn-ghost" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); window.closeAndScrollToAgendamento(); }}>← Voltar</button>\n' +
'                  <button className="btn btn-primary" disabled={!booking.services.length} onClick={next}>Continuar →</button>\n' +
'                </div>';

if (!t.includes(oldBtnRow)) { console.error('❌ Step 2 btn-row não encontrado'); process.exit(1); }
t = t.replace(oldBtnRow, newBtnRow);
console.log('✅ Step 2 "← Voltar": onClick substituído por window.closeAndScrollToAgendamento()');

// Audit: confirm steps 3, 4, 5 still use back
const s3back = t.includes('disabled={!booking.date} onClick={next}');
const s4back = t.includes('disabled={!booking.time} onClick={next}');
const s5back = t.includes('onClick={back} disabled={submitting}');
console.log('\nAudit:');
console.log('  Step 2 Voltar → closeAndScrollToAgendamento:', t.includes("window.closeAndScrollToAgendamento(); }}>← Voltar") ? '✅' : '❌');
console.log('  Step 3 Voltar still uses back:', s3back ? '✅' : '❌');
console.log('  Step 4 Voltar still uses back:', s4back ? '✅' : '❌');
console.log('  Step 5 Voltar still uses back:', s5back ? '✅' : '❌');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
