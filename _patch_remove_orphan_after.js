const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Show context around the orphan ::after to find exact string
const idx = t.indexOf('.main-header::after { left: 24px; }');
console.log('Context:', JSON.stringify(t.slice(idx - 80, idx + 80)));

// Remove only the orphan responsive override
const oldOrphan = '.main-header::after { left: 24px; }\n    ';
if (!t.includes(oldOrphan)) {
  // Try without trailing newline/spaces
  const oldOrphan2 = '.main-header::after { left: 24px; }';
  if (!t.includes(oldOrphan2)) { console.error('❌ Orphan ::after não encontrado'); process.exit(1); }
  t = t.replace(oldOrphan2, '');
  console.log('✅ Orphan .main-header::after removido (variante sem trailing whitespace)');
} else {
  t = t.replace(oldOrphan, '');
  console.log('✅ Orphan .main-header::after { left: 24px; } removido da media query');
}

// Final audit
console.log('\nAudit final:');
console.log('  .main-header::after remaining:', (t.match(/\.main-header::after/g)||[]).length === 0 ? '✅ none' : '⚠️  still present');
console.log('  .summary-row border-bottom intact:', t.includes('border-bottom: 1px solid rgba(196,146,42,0.1); font-size: 13px') ? '✅' : '⚠️');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
