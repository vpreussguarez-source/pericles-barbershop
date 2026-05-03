const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Remove o transform inline da img-main, mantém só object-position e transform-origin
const oldImg = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 30%;transform:scale(1.2);transform-origin:center 30%;">`;
const newImg = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 30%;transform-origin:center 30%;">`;

if (!t.includes(oldImg)) { console.error('❌ img-main não encontrada'); process.exit(1); }
t = t.replace(oldImg, newImg);
console.log('✅ transform inline removido da img-main');

// 2. Adiciona CSS: base scale(1.2) via classe + hover scale(1.25) para combinar com as outras
const extraCSS = `
/* ── img-main: zoom base + hover animado igual às demais da grade ── */
.sobre-imgs .img-main { transform: scale(1.2); }
.sobre-imgs .img-main:hover { transform: scale(1.25); }
`;

t = t.replace('</style>\n</head>', extraCSS + '</style>\n</head>');
console.log('✅ CSS com scale base 1.2 e hover 1.25 adicionado');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

JSON.parse(newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle salvo!');
