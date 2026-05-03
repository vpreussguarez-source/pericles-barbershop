const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldBtn =
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                  document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                }}>← Voltar</button>';

const newBtn =
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  e.stopPropagation();\n' +
'                  document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                  setTimeout(()=>{\n' +
'                    document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                  }, 100);\n' +
'                }}>← Voltar</button>';

if (!t.includes(oldBtn)) {
  console.error('❌ Botão não encontrado — contexto atual:');
  const idx = t.indexOf('← Voltar');
  if (idx !== -1) console.log(JSON.stringify(t.slice(idx - 200, idx + 20)));
  process.exit(1);
}

t = t.replace(oldBtn, newBtn);
console.log('✅ Botão "← Voltar" step 1: stopPropagation + setTimeout(scroll, 100ms) adicionados');

// Audit
console.log('\nAudit:');
console.log('  stopPropagation:', t.includes('e.stopPropagation()') ? '✅' : '❌');
console.log('  setTimeout scroll:', t.includes("setTimeout(()=>{\n                    document.getElementById('agendamento')") ? '✅' : '❌');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
