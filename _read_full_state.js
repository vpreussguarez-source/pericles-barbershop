const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Services section full HTML
const idxServ = t.indexOf('<!-- SERVIÇOS -->');
const idxEspaco = t.indexOf('\n<!-- NOSSO ESPAÇO -->');
fs.writeFileSync('_dump_servicos.txt', t.slice(idxServ, idxEspaco));
console.log('Serviços section length:', idxEspaco - idxServ);

// 2. Agendamento section
const idxAgend = t.indexOf('\n<!-- AGENDAMENTO -->');
const idxLoc = t.indexOf('\n<!-- LOCALIZAÇÃO -->');
fs.writeFileSync('_dump_agendamento.txt', t.slice(idxAgend, idxLoc));
console.log('Agendamento section length:', idxLoc - idxAgend);

// 3. Babel script
const idxBabel = t.indexOf('<script type="text/babel">');
const idxBabelEnd = t.indexOf('<\/script>', idxBabel); // note: escaped in JSON
fs.writeFileSync('_dump_babel.txt', t.slice(idxBabel, idxBabelEnd + 9));
console.log('Babel script length:', idxBabelEnd - idxBabel);

// 4. Nav links
const idxNav = t.indexOf('<nav ');
console.log('\n=== NAV ===');
console.log(t.slice(idxNav, idxNav + 600));

// 5. Hero buttons
const idxHeroBtn = t.indexOf('btn-gold');
console.log('\n=== HERO BUTTONS ===');
console.log(t.slice(idxHeroBtn - 20, idxHeroBtn + 200));
