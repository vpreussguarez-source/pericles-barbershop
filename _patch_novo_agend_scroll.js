const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldBtn =
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

const newBtn =
'<button className="btn btn-ghost" onClick={(e)=>{\n' +
'                    e.preventDefault();\n' +
'                    document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                    document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                  }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

if (!t.includes(oldBtn)) {
  console.error('❌ Botão não encontrado — mostrando contexto atual:');
  const idx = t.indexOf('Novo Agendamento');
  if (idx !== -1) console.log(JSON.stringify(t.slice(idx - 350, idx + 60)));
  process.exit(1);
}

t = t.replace(oldBtn, newBtn);
console.log('✅ Botão "Novo Agendamento" atualizado:');
console.log('   → fecha modal via display=none');
console.log('   → scrollIntoView({behavior:"smooth"}) para #agendamento');

// Audit
const hasOld = t.includes('window.openBookingModal()');
// Only the definition itself should remain
const openModalCalls = (t.match(/window\.openBookingModal\(\)/g) || []).length;
console.log('\nAudit:');
console.log('  window.openBookingModal() calls remaining:', openModalCalls, '(1 expected — the definition)');
console.log('  scrollIntoView present:', t.includes("scrollIntoView({behavior:'smooth'})") ? '✅' : '❌');
console.log('  booking-modal-overlay reference:', t.includes("'booking-modal-overlay'") ? '✅' : '❌');

// Save
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
