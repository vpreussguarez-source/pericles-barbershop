const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const realEndIdx = bundle.indexOf(endMarker, tplStart);
const jsonEnd = realEndIdx + ('</body></html>"').length;
const scriptCloseStart = jsonEnd;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// Fix hero background-position
const before = 'background-position: center 20%;';
const after  = 'background-position: center 55%;';

if (!t.includes(before)) {
  console.error('Pattern not found:', before);
  process.exit(1);
}

t = t.replace(before, after);
console.log('✅ background-position updated: center 20% → center 55%');

// Re-save with proper </script> escaping
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(scriptCloseStart);

// Verify
const m = newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON valid after save');

fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle saved!');
