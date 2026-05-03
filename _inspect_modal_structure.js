const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Show current .modal-container CSS block
const mcIdx = t.indexOf('.modal-container {');
console.log('=== .modal-container CSS ===');
console.log(t.slice(mcIdx, mcIdx + 300));

// 2. Find all step return() JSX wrappers — look for main/div with className="main-*"
console.log('\n=== Step wrapper divs/mains ===');
const wrapperPatterns = ['<main className', '<div className="main-', 'className="step-', 'className="booking-'];
wrapperPatterns.forEach(pat => {
  let pos = 0;
  while (true) {
    const idx = t.indexOf(pat, pos);
    if (idx === -1) break;
    console.log('--- Pattern:', JSON.stringify(pat), 'at', idx, '---');
    console.log(t.slice(idx, idx + 180));
    console.log();
    pos = idx + 1;
  }
});
