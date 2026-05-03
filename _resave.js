const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

// ── Extract the REAL full template ──────────────────────────────────────────
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;

// The template JSON string ends with: </body></html>"</script>
// where " is the closing quote of the JSON string
// and </script> closes the outer script tag
const endMarker = '</body></html>"</script>';
const realEndIdx = bundle.indexOf(endMarker, tplStart);

// JSON content: from tplStart to and including the closing " of the JSON string
// That's: tplStart ... realEndIdx + length of '</body></html>"'
const JSON_CLOSE_LEN = ('</body></html>"').length; // 15 chars
const jsonEnd = realEndIdx + JSON_CLOSE_LEN;

// The </script> that closes the template script tag starts right after the JSON string
const scriptCloseStart = jsonEnd; // points to </script>

const fullJSON = bundle.slice(tplStart, jsonEnd);
console.log('JSON first 10:', JSON.stringify(fullJSON.slice(0, 10)));
console.log('JSON last 20:', JSON.stringify(fullJSON.slice(-20)));

const t = JSON.parse(fullJSON);
console.log('Template extracted OK, length:', t.length);

// ── Verify key sections ───────────────────────────────────────────────────
const checks = [
  ['Agendamento section', t.includes('id="agendamento"')],
  ['Localização section', t.includes('id="localizacao"')],
  ['Google Maps',         t.includes('maps.google.com')],
  ['Booking JS go()',     t.includes('function go(step)')],
  ['Webhook URL',         t.includes('hook.us2.make.com')],
  ['Nav Agendamento',     t.includes('href="#agendamento">Agendamento')],
  ['Serv-agendar btn',    t.includes('agendarServico')],
];
checks.forEach(([n, ok]) => console.log((ok ? '✅' : '❌') + ' ' + n));

// ── Re-encode safely, escaping </script> ─────────────────────────────────
// Escape </script> → <\/script> so it doesn't break the outer HTML script tag
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
console.log('Safe JSON length:', safeJSON.length);

// ── Rebuild: before + safeJSON + the closing </script> + rest of bundle ──
const before = bundle.slice(0, tplStart);           // up to and excluding the JSON content
const after  = bundle.slice(scriptCloseStart);       // starts with </script>...
console.log('Before ends with:', JSON.stringify(bundle.slice(tplStart - 10, tplStart)));
console.log('After starts with:', JSON.stringify(after.slice(0, 30)));

const newBundle = before + safeJSON + after;
console.log('New bundle length:', newBundle.length);

// ── Verify the rebuilt bundle ─────────────────────────────────────────────
const newTplMatch = newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!newTplMatch) {
  console.error('ERROR: template tag not found after rebuild');
  console.log('Searching around template area...');
  const idx = newBundle.indexOf('<script type="__bundler/template">');
  console.log('Tag at:', idx);
  if (idx > -1) console.log('Content after tag:', JSON.stringify(newBundle.slice(idx + TAG.length, idx + TAG.length + 100)));
  process.exit(1);
}
try {
  const verified = JSON.parse(newTplMatch[1]);
  console.log('✅ Bundle JSON valid! Template length:', verified.length);
} catch(e) {
  console.error('❌ Bundle JSON invalid:', e.message);
  process.exit(1);
}

fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle saved! Size:', newBundle.length, 'bytes');
