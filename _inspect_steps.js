const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find the .main-body and show its full contents to see step wrappers
const bodyIdx = t.indexOf('<div className="main-body">');
console.log('=== <div className="main-body"> found at', bodyIdx, '===');
// Show 3000 chars from main-body to capture all steps
console.log(t.slice(bodyIdx, bodyIdx + 4000));
