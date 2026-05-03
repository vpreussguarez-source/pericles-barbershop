const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));
const idx = t.indexOf('.hero-bg');
console.log(t.slice(idx, idx + 600));
