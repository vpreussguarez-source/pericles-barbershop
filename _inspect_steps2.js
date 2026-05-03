const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Show steps 4 onwards — continue from where step 4 starts
const step4 = t.indexOf('{/* ─── STEP 4');
console.log('=== STEP 4 onwards (4000 chars) ===');
console.log(t.slice(step4, step4 + 5000));
