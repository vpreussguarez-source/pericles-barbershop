const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find end of servicos HTML section (closing </section> before <!-- ESPAÇO -->)
const idxEspaco = t.indexOf('\n<!-- ESPAÇO -->');
console.log('=== ANTES DO ESPAÇO (500 chars) ===');
console.log(t.slice(idxEspaco - 500, idxEspaco));

// Find serv-category-label blocks to understand structure
const idxFem = t.indexOf('Feminino');
console.log('\n=== CATEGORIA FEMININO ===');
console.log(t.slice(idxFem - 100, idxFem + 100));

// Find booking CSS closing tag
const idxBookEnd = t.indexOf('</style>', t.indexOf('<style id="booking-css">'));
console.log('\n=== BOOKING CSS FINAL (200 chars antes do </style>) ===');
console.log(t.slice(idxBookEnd - 200, idxBookEnd + 10));
