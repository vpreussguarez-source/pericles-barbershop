const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find .fade-enter CSS
let pos = 0;
while (true) {
  const idx = t.indexOf('.fade-enter', pos);
  if (idx === -1) break;
  console.log('--- .fade-enter at', idx, '---');
  console.log(JSON.stringify(t.slice(idx, idx + 200)));
  console.log();
  pos = idx + 1;
}

// Current .main-body exact string
const mbIdx = t.indexOf('.main-body {');
console.log('--- .main-body at', mbIdx, '---');
console.log(JSON.stringify(t.slice(mbIdx, mbIdx + 160)));

// Current .modal-container exact string
const mcIdx = t.indexOf('.modal-container {');
console.log('\n--- .modal-container at', mcIdx, '---');
console.log(JSON.stringify(t.slice(mcIdx, mcIdx + 300)));
