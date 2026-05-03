const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Show the safe guard onclick for pericles
const idx = t.indexOf('safeOpenModal') !== -1
  ? t.indexOf('safeOpenModal')
  : t.indexOf('typeof window.openBookingModal');

// Find all prof-card-new onclick attributes
let pos = 0;
let count = 0;
while (true) {
  const i = t.indexOf('prof-card-new', pos);
  if (i === -1) break;
  count++;
  console.log('=== prof-card-new #' + count + ' ===');
  console.log(t.slice(i, i + 350));
  console.log();
  pos = i + 1;
}

// Also show the JSX button
const jidx = t.indexOf('Novo Agendamento');
if (jidx !== -1) {
  console.log('=== JSX Novo Agendamento button ===');
  console.log(t.slice(jidx - 300, jidx + 60));
}

// Check all non-babel scripts for balance too
const scripts = [];
let sp = 0;
while (true) {
  const sStart = t.indexOf('<script>', sp);
  if (sStart === -1) break;
  const sEnd = t.indexOf('</script>', sStart);
  scripts.push(t.slice(sStart + '<script>'.length, sEnd));
  sp = sEnd + 1;
}
console.log('\nPlain <script> blocks found:', scripts.length);
scripts.forEach((s, idx) => {
  let b = 0, p = 0;
  let inStr = false, strChar = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) { if (ch === '\\') { i++; continue; } if (ch === strChar) inStr = false; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; continue; }
    if (ch === '{') b++;
    else if (ch === '}') b--;
    else if (ch === '(') p++;
    else if (ch === ')') p--;
  }
  const ok = b === 0 && p === 0;
  console.log('  Script #' + idx + ' len=' + s.length + ' braces=' + b + ' parens=' + p + (ok ? ' ✅' : ' ❌'));
  if (!ok) console.log('  Preview:', JSON.stringify(s.slice(0, 100)));
});
