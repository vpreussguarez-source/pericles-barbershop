const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Show all booking-system CSS classes: .main, .main-header, .main-body, .main-title
const classes = ['.main {', '.main-header', '.main-body', '.main-title', '.main-subtitle', '#booking-modal-root'];
classes.forEach(cls => {
  const idx = t.indexOf(cls);
  if (idx === -1) { console.log('NOT FOUND:', cls); return; }
  console.log('=== ' + cls + ' ===');
  console.log(t.slice(idx, idx + 200));
  console.log();
});

// Also show the full <main className="main"> JSX and its style prop if any
const mainJSX = t.indexOf('<main className="main">');
console.log('=== JSX <main> tag ===');
console.log(t.slice(mainJSX, mainJSX + 60));
