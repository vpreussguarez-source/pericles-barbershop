const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Restore 150px for the general rule
const old120 = 'max-width: 120px;\n    max-height: 120px;';
const new150 = 'max-width: 150px;\n    max-height: 150px;';
if (!t.includes(old120)) { console.error('❌ Valores 120px não encontrados'); process.exit(1); }
t = t.replace(old120, new150);
console.log('✅ Geral: 120px → 150px');

// 2. Inject specific override for don-pasta-matte.png before </style>
const styleClose = t.lastIndexOf('</style>');
const override =
'\n  .prod-img-wrap img[src="don-pasta-matte.png"] {\n' +
'    max-width: 120px;\n' +
'    max-height: 120px;\n' +
'  }\n';
t = t.slice(0, styleClose) + override + t.slice(styleClose);
console.log('✅ Override 120px para don-pasta-matte.png injetado');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
