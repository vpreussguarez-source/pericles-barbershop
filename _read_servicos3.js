const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find actual end of servicos section closing tag
const idxServicos = t.indexOf('<!-- SERVIÇOS -->');
// find </section> after servicos section starts
let i = idxServicos;
let depth = 0;
while (i < t.length) {
  if (t.slice(i, i+8) === '<section') depth++;
  if (t.slice(i, i+10) === '</section>') { depth--; if (depth === 0) { i += 10; break; } }
  i++;
}
console.log('=== CLOSING OF SERVICOS SECTION ===');
console.log(t.slice(i - 300, i + 50));

// Find the serv-card CSS for reference
const idxServCard = t.indexOf('.serv-card {');
console.log('\n=== .serv-card CSS ===');
console.log(t.slice(idxServCard, idxServCard + 500));
