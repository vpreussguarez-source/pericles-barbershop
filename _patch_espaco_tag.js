const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldTag = `    <div class="sec-tag" style="text-align:center;">NOSSO ESPAÇO</div>
    <h2 class="sec-h2" style="text-align:center;">`;
const newTag = `    <h2 class="sec-h2" style="text-align:center;">`;

if (!t.includes(oldTag)) { console.error('❌ sec-tag não encontrado'); process.exit(1); }
t = t.replace(oldTag, newTag);
console.log('✅ Subtítulo "NOSSO ESPAÇO" removido');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
