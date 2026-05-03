const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find the inline script that has agendarServico calls via onclick
// Look for the main site JS block
const idx = t.indexOf('function go(');
console.log('go() at:', idx);

// Find navLinks / smooth scroll JS
const idx2 = t.indexOf('navLinks');
console.log('navLinks at:', idx2, t.slice(idx2 - 20, idx2 + 80));

// Find the script block with site JS
const allScripts = [];
let pos = 0;
while ((pos = t.indexOf('<script>', pos)) !== -1) {
  allScripts.push(pos);
  pos++;
}
console.log('\nAll <script> positions:', allScripts);
allScripts.forEach(p => console.log(p, '->', t.slice(p, p+60)));
