const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Remove "← Voltar" btn-row from step 1 React fragment ──────────────────
// The fragment wraps cards-grid + btn-row; simplify back to just cards-grid (no fragment needed)
const oldStep1 =
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
'                  e.stopPropagation();\n' +
'                  window.closeAndScrollToAgendamento();\n' +
'                }}>← Voltar</button>\n' +
'              </div>\n' +
'              </>\n' +
'            )}';

const newStep1 =
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
'            )}';

if (!t.includes(oldStep1)) { console.error('❌ Step 1 JSX não encontrado'); process.exit(1); }
t = t.replace(oldStep1, newStep1);
console.log('✅ Botão "← Voltar" removido do step 1 (fragmento React também removido)');

// ── 2. Add "← Ver todos os serviços" link after prof-cards-grid ───────────────
// Insert just before </div>\n</section> that closes the profissionais section
const oldClose =
'      </div>\n' +   // closes thayna card
'    </div>\n' +     // closes prof-cards-grid
'  </div>\n' +       // closes section inner
'</section>\n' +
'<!-- NOSSO ESPAÇO -->';

const newClose =
'      </div>\n' +
'    </div>\n' +
'    <div style="text-align:center; margin-top:32px;">\n' +
'      <a href="#agendamento" onclick="event.preventDefault();document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});" style="color:var(--gold);font-family:var(--sf);font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;opacity:0.8;transition:opacity .2s;" onmouseover="this.style.opacity=\'1\'" onmouseout="this.style.opacity=\'0.8\'">← Ver todos os serviços</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'<!-- NOSSO ESPAÇO -->';

if (!t.includes(oldClose)) { console.error('❌ Fechamento da seção profissionais não encontrado'); process.exit(1); }
t = t.replace(oldClose, newClose);
console.log('✅ Link "← Ver todos os serviços" adicionado abaixo dos cards de profissionais');

// ── 3. Audit ──────────────────────────────────────────────────────────────────
console.log('\nAudit:');
console.log('  Voltar btn absent:', !t.includes('closeAndScrollToAgendamento()') ? '✅ removed' : '⚠️  still present');
console.log('  React fragment absent:', !t.includes('step===1 && (\n              <>') ? '✅ removed' : '⚠️  still present');
console.log('  Link present:', t.includes('← Ver todos os serviços') ? '✅' : '❌');

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
