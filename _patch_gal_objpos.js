const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// IMG_0098: center bottom (já aplicado anteriormente, garante o estado correto)
const old98 = `<img src="IMG_0098.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center bottom;">`;
if (t.includes(old98)) {
  console.log('✅ IMG_0098: já está em center bottom, sem alteração');
} else {
  // tenta versão alternativa caso tenha mudado
  const alt98 = `<img src="IMG_0098.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 40%;">`;
  if (!t.includes(alt98)) { console.error('❌ IMG_0098 não encontrado'); process.exit(1); }
  t = t.replace(alt98, old98);
  console.log('✅ IMG_0098: → center bottom');
}

// IMG_0095: center top
const old95 = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 35%;">`;
const new95 = `<img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center top;">`;
if (!t.includes(old95)) { console.error('❌ IMG_0095 não encontrado'); process.exit(1); }
t = t.replace(old95, new95);
console.log('✅ IMG_0095: center 35% → center top');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
