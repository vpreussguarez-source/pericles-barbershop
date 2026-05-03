const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Hero CSS - full block until next section
const cssIdx = t.indexOf('.hero {');
const nextSection = t.indexOf('/* ── SOBRE ──', cssIdx);
console.log(t.slice(cssIdx, nextSection));
