const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Find the extra img-main CSS added later
const idx = t.indexOf('img-main: zoom');
console.log('--- Extra CSS block ---');
console.log(JSON.stringify(t.slice(idx - 5, idx + 200)));

// Also find end of style block
const styleEnd = t.indexOf('</style>\n</head>');
console.log('\n--- End of style block ---');
console.log(JSON.stringify(t.slice(styleEnd - 300, styleEnd + 20)));
