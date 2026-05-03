const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Show full step 1 JSX (from comment to next step comment)
const s1Start = t.indexOf('{/* ─── STEP 1');
const s1End   = t.indexOf('{/* ─── STEP 2');
console.log('=== STEP 1 JSX ===');
console.log(t.slice(s1Start, s1End));

// 2. Show .main-header JSX and any back/close button in the header
const mhJSX = t.indexOf('<div className="main-header">');
console.log('\n=== <div className="main-header"> JSX ===');
console.log(t.slice(mhJSX, mhJSX + 600));

// 3. Find the decorative line — look for border-bottom in main-header CSS and ::after
const mhCSS = t.indexOf('.main-header {');
console.log('\n=== .main-header CSS ===');
console.log(t.slice(mhCSS, mhCSS + 400));

// 4. Also look for <hr or any decorative element after subtitle
const subIdx = t.indexOf('main-subtitle');
console.log('\n=== Around main-subtitle ===');
console.log(t.slice(subIdx - 50, subIdx + 300));
