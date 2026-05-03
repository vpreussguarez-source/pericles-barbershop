const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// End of servicos section
const idxServEnd = t.indexOf('<!-- ESPAÇO -->');
console.log('=== FIM DA SEÇÃO SERVIÇOS ===');
console.log(t.slice(idxServEnd - 400, idxServEnd));

// Booking CSS (style id="booking-css")
const idxCSS = t.indexOf('<style id="booking-css">');
console.log('\n=== BOOKING CSS (primeiros 1200 chars) ===');
console.log(t.slice(idxCSS, idxCSS + 1200));
