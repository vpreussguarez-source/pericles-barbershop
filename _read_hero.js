const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Hero CSS
const cssIdx = t.indexOf('.hero {');
console.log('=== HERO CSS ===');
console.log(t.slice(cssIdx, cssIdx + 2000));

// Hero HTML
const htmlIdx = t.indexOf('<!-- HERO -->');
console.log('\n=== HERO HTML ===');
console.log(t.slice(htmlIdx, htmlIdx + 1500));
