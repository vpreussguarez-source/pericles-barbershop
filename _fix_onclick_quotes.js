const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// The bug: JSON.stringify produced double-quoted id inside a double-quoted HTML attribute.
// Fix: replace var id="xxx" with var id='xxx' (single quotes safe inside onclick="...").

const attendants = ['pericles', 'betina', 'mary', 'vitoria', 'thayna'];

attendants.forEach(id => {
  // Bad: var id="pericles"
  const badStr  = 'var id="' + id + '"';
  // Good: var id=\'pericles\' — single quotes are safe inside onclick="..."
  const goodStr = "var id='" + id + "'";

  if (!t.includes(badStr)) {
    console.error('❌ Não encontrado:', badStr);
    process.exit(1);
  }
  t = t.replace(badStr, goodStr);
  console.log('✅ Fixed quotes for', id, ':', JSON.stringify(badStr), '→', JSON.stringify(goodStr));
});

// Verify: no double-quoted id strings remain inside onclick attributes
const remaining = (t.match(/var id="[^"]+"/g) || []);
console.log('\nAudit — double-quoted id values remaining:', remaining.length === 0 ? '✅ none' : '❌ ' + JSON.stringify(remaining));

// Verify all 5 fixed strings are present
let allGood = true;
attendants.forEach(id => {
  const expected = "var id='" + id + "'";
  if (!t.includes(expected)) { console.error('❌ Missing after fix:', expected); allGood = false; }
});
if (allGood) console.log('✅ All 5 safe-guard onclick strings use single-quoted IDs');

// Save
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
