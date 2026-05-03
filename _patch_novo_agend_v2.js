const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// ── 1. Replace Novo Agendamento onClick ──────────────────────────────────────
const oldBtn =
'<button className="btn btn-ghost" onClick={()=>{ window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

// New: stopPropagation stops any click bubbling to parent <a>,
// location.href scrolls to the section, openBookingModal() resets the flow.
const newBtn =
'<button className="btn btn-ghost" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); window.location.href=\'#profissionais\'; window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

if (!t.includes(oldBtn)) { console.error('❌ Botão não encontrado'); process.exit(1); }
t = t.replace(oldBtn, newBtn);
console.log('✅ Novo Agendamento: stopPropagation + location.href + openBookingModal()');

// ── 2. Wrap the WhatsApp <a> button to also stop propagation ─────────────────
// Replace <a href={buildWhatsApp...}> with an onClick version to avoid
// any accidental anchor bubbling affecting sibling elements
const oldWaAnchor =
'<a href={buildWhatsApp(bookingRec)} target="_blank" rel="noopener noreferrer">\n' +
'                    <button className="btn btn-whatsapp">';
const newWaAnchor =
'<a href={buildWhatsApp(bookingRec)} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>\n' +
'                    <button className="btn btn-whatsapp" onClick={(e)=>e.stopPropagation()}>';

if (!t.includes(oldWaAnchor)) { console.error('❌ Âncora WhatsApp não encontrada'); process.exit(1); }
t = t.replace(oldWaAnchor, newWaAnchor);
console.log('✅ WhatsApp <a>: stopPropagation adicionado (isola cliques do botão Novo Agendamento)');

// ── 3. Audit: confirm no window.location / window.open / external href in steps 1-5 ──
const babelStart = t.indexOf('<script type="text/babel">');
const babelScript = t.slice(babelStart);
const badPatterns = ['window.location.href', 'window.location.replace', 'window.location.assign', 'window.open('];
let clean = true;
badPatterns.forEach(pat => {
  let p = 0;
  while(true) {
    let idx = babelScript.indexOf(pat, p);
    if(idx === -1) break;
    const ctx = babelScript.slice(idx, idx+100);
    // Allow only if it's in our new Novo Agendamento button
    if (!ctx.includes('#profissionais')) {
      console.warn('⚠️  Encontrado:', pat, 'em:', ctx);
      clean = false;
    }
    p = idx + 1;
  }
});
if (clean) console.log('✅ Auditoria: nenhuma navegação externa em steps 1-5');

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
