const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// 1. Remover o div da imagem IMG_0096 (linha panorâmica)
const oldItem = `\n      <!-- Linha 4: panorâmica full width -->
      <div class="gal-item full">
        <img src="IMG_0096.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 40%;">
      </div>`;

if (!t.includes(oldItem)) { console.error('❌ Item IMG_0096 não encontrado'); process.exit(1); }
t = t.replace(oldItem, '');
console.log('✅ HTML: IMG_0096.JPEG removido');

// 2. Remover a 4ª linha do grid-template-rows (160px)
const oldRows = `  grid-template-rows: 280px 200px 220px 160px;`;
const newRows = `  grid-template-rows: 280px 200px 220px;`;
if (!t.includes(oldRows)) { console.error('❌ grid-template-rows não encontrado'); process.exit(1); }
t = t.replace(oldRows, newRows);
console.log('✅ CSS: grid-template-rows removida 4ª linha (160px)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
