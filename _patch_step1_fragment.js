const fs = require('fs');
const bundlePath = 'C:/Users/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Current step 1: two adjacent JSX elements inside the conditional — no wrapper
const oldStep1 =
'            {step===1 && (\n' +
'              <div className="cards-grid cards-grid-2">\n' +
'                {DEMO_MODE && (\n' +
'                  <div className="demo-banner" style={{gridColumn:\'1/-1\'}}>\n' +
'                    <strong>Modo demonstração</strong> — Supabase não configurado. Os agendamentos não serão salvos. Configure as variáveis <code>supabaseUrl</code> e <code>supabaseKey</code> no arquivo HTML.\n' +
'                  </div>\n' +
'                )}\n' +
'                {ATTENDANTS.map(a=>(\n' +
'                  <div key={a.id}\n' +
'                    className={`card${booking.attendant?.id===a.id?\' selected\':\'\'}`}\n' +
'                    onClick={()=>{ set(\'attendant\',a); set(\'services\',[]); setTimeout(()=>go(2),120); }}\n' +
'                  >\n' +
'                    <div className="card-name">{a.name}</div>\n' +
'                    <div className="card-role">{a.role}</div>\n' +
'                    <div className="card-desc">{a.desc}</div>\n' +
'                  </div>\n' +
'                ))}\n' +
'              </div>\n' +
'              <div className="btn-row" style={{marginTop:\'24px\'}}>\n' +
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                  document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                }}>← Voltar</button>\n' +
'              </div>\n' +
'            )}';

const newStep1 =
'            {step===1 && (\n' +
'              <>\n' +
'              <div className="cards-grid cards-grid-2">\n' +
'                {DEMO_MODE && (\n' +
'                  <div className="demo-banner" style={{gridColumn:\'1/-1\'}}>\n' +
'                    <strong>Modo demonstração</strong> — Supabase não configurado. Os agendamentos não serão salvos. Configure as variáveis <code>supabaseUrl</code> e <code>supabaseKey</code> no arquivo HTML.\n' +
'                  </div>\n' +
'                )}\n' +
'                {ATTENDANTS.map(a=>(\n' +
'                  <div key={a.id}\n' +
'                    className={`card${booking.attendant?.id===a.id?\' selected\':\'\'}`}\n' +
'                    onClick={()=>{ set(\'attendant\',a); set(\'services\',[]); setTimeout(()=>go(2),120); }}\n' +
'                  >\n' +
'                    <div className="card-name">{a.name}</div>\n' +
'                    <div className="card-role">{a.role}</div>\n' +
'                    <div className="card-desc">{a.desc}</div>\n' +
'                  </div>\n' +
'                ))}\n' +
'              </div>\n' +
'              <div className="btn-row" style={{marginTop:\'24px\'}}>\n' +
'                <button className="btn btn-ghost" onClick={(e)=>{\n' +
'                  e.preventDefault();\n' +
'                  document.getElementById(\'booking-modal-overlay\').style.display = \'none\';\n' +
'                  document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});\n' +
'                }}>← Voltar</button>\n' +
'              </div>\n' +
'              </>\n' +
'            )}';

if (!t.includes(oldStep1)) {
  console.error('❌ Step 1 JSX não encontrado — mostrando contexto atual:');
  const idx = t.indexOf('cards-grid cards-grid-2');
  if (idx !== -1) console.log(JSON.stringify(t.slice(idx - 60, idx + 600)));
  process.exit(1);
}

t = t.replace(oldStep1, newStep1);
console.log('✅ Step 1 envolvido em fragmento React <>...</>');

// Audit
console.log('\nAudit:');
console.log('  Fragment opening <>:', t.includes('step===1 && (\n              <>\n') ? '✅' : '❌');
console.log('  Fragment closing </>:', t.includes('              </>\n            )}') ? '✅' : '❌');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
