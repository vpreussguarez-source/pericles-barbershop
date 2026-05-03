const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Add "← Voltar" button to step 1 ───────────────────────────────────────
// Step 1 currently ends with the attendant cards grid and no btn-row.
// We add a btn-row with a single close+scroll button at the bottom.
const oldStep1 =
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
'            )}';

const newStep1 =
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

if (!t.includes(oldStep1)) { console.error('❌ Step 1 JSX não encontrado'); process.exit(1); }
t = t.replace(oldStep1, newStep1);
console.log('✅ Step 1: botão "← Voltar" adicionado (fecha modal + scroll para #agendamento)');

// ── 2. Remove border-bottom from .main-header ─────────────────────────────────
const oldMHCSS =
'.main-header {\n' +
'    padding: 32px 0 24px;\n' +
'    border-bottom: 1px solid rgba(196,146,42,0.1);\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; position: relative;\n' +
'  }';

const newMHCSS =
'.main-header {\n' +
'    padding: 32px 0 24px;\n' +
'    max-width: 600px; width: 100%; margin: 0 auto; position: relative;\n' +
'  }';

if (!t.includes(oldMHCSS)) { console.error('❌ .main-header CSS não encontrado'); process.exit(1); }
t = t.replace(oldMHCSS, newMHCSS);
console.log('✅ .main-header: border-bottom removido');

// ── 3. Remove .main-header::after decorative gold bar ────────────────────────
const oldAfter =
'  .main-header::after {\n' +
'    content: \'\'; position: absolute; bottom: -1px; left: 56px;\n' +
'    width: 48px; height: 2px; background: var(--gold); border-radius: 1px;\n' +
'  }';

if (!t.includes(oldAfter)) { console.error('❌ .main-header::after não encontrado'); process.exit(1); }
t = t.replace(oldAfter, '');
console.log('✅ .main-header::after: bloco removido (linha dourada decorativa eliminada)');

// ── 4. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  Step 1 btn-row present:',       t.includes("document.getElementById('agendamento').scrollIntoView") ? '✅' : '❌');
console.log('  border-bottom in .main-header:', t.includes('border-bottom: 1px solid rgba(196,146,42,0.1)') ? '⚠️  ainda presente' : '✅ removido');
console.log('  ::after block present:',         t.includes('.main-header::after') ? '⚠️  ainda presente' : '✅ removido');

// ── 5. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
