const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Remove orphan #agendamento-root scoped CSS block ───────────────────────
// It starts at the comment and runs to the end of booking-css </style>
const orphanStart = t.indexOf('/* ── Scoping do sistema de agendamento embutido ── */');
if (orphanStart !== -1) {
  // The block ends just before </style>
  const styleCloseAfter = t.indexOf('</style>', orphanStart);
  const removed = t.slice(orphanStart, styleCloseAfter);
  console.log('Removing orphan CSS block (' + removed.length + ' chars):', removed.slice(0, 80) + '...');
  t = t.slice(0, orphanStart) + t.slice(styleCloseAfter);
  console.log('✅ Orphan #agendamento-root scoped CSS removed');
} else {
  console.log('ℹ️  Orphan CSS block not found (already clean)');
}

// ── 2. Remove #agendamento-root from shared selectors ─────────────────��───────
// e.g. "#agendamento-root, #booking-modal-root { ..." → "#booking-modal-root { ..."
let replaced = 0;
t = t.replace(/#agendamento-root,\s*#booking-modal-root/g, () => { replaced++; return '#booking-modal-root'; });
t = t.replace(/#booking-modal-root,\s*#agendamento-root/g, () => { replaced++; return '#booking-modal-root'; });
// Also any standalone #agendamento-root references in @media blocks
t = t.replace(/\s*#agendamento-root\s+\.main-header,\s*/g, '  ');
t = t.replace(/\s*#agendamento-root\s+\.main-header::after,\s*/g, '  ');
t = t.replace(/\s*#agendamento-root\s+\.main-body,\s*/g, '  ');
console.log('✅ #agendamento-root removed from ' + replaced + ' shared selectors + media query refs');

// ── 3. Simplify Novo Agendamento button ─────────────────────��──────────────────
const oldBtn =
'<button className="btn btn-ghost" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); window.location.href=\'#profissionais\'; window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

const newBtn =
'<button className="btn btn-ghost" onClick={()=>{ window.openBookingModal(); }}>\n' +
'                    Novo Agendamento\n' +
'                  </button>';

if (!t.includes(oldBtn)) {
  console.error('❌ Botão exato não encontrado — tentando variação...');
  // Show what's actually there
  const novoPos = t.indexOf('Novo Agendamento');
  if (novoPos !== -1) console.log('Current button:', JSON.stringify(t.slice(novoPos-250, novoPos+80)));
  process.exit(1);
}
t = t.replace(oldBtn, newBtn);
console.log('✅ Botão Novo Agendamento: apenas window.openBookingModal()');

// ── 4. Remove stopPropagation from WhatsApp <a> (no longer needed) ────────────
const oldWaAnchor = '<a href={buildWhatsApp(bookingRec)} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>';
const newWaAnchor = '<a href={buildWhatsApp(bookingRec)} target="_blank" rel="noopener noreferrer">';
if (t.includes(oldWaAnchor)) {
  t = t.replace(oldWaAnchor, newWaAnchor);
  console.log('✅ WhatsApp <a>: stopPropagation extra removido');
}
const oldWaBtn = '<button className="btn btn-whatsapp" onClick={(e)=>e.stopPropagation()}>';
const newWaBtn = '<button className="btn btn-whatsapp">';
if (t.includes(oldWaBtn)) {
  t = t.replace(oldWaBtn, newWaBtn);
  console.log('✅ WhatsApp button: stopPropagation extra removido');
}

// ── 5. Final audit ─────────────────────────────────────────────────────────────
const agendRootCount = (t.match(/#agendamento-root/g) || []).length;
console.log('\nAudit:');
console.log('  #agendamento-root remaining:', agendRootCount === 0 ? '✅ none' : '⚠️  ' + agendRootCount + ' refs');
console.log('  window.location.href in button:', !t.includes("location.href='#profission") ? '✅ removed' : '⚠️  still present');
console.log('  window.openBookingModal in button:', t.includes('window.openBookingModal()') ? '✅ present' : '❌ missing');

// ── 6. Save ────────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
