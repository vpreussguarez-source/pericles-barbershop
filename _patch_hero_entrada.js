const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const HERO_UUID = 'b8933d8f-884d-449f-9af6-33596df1af79';

// ── Replace image in manifest ─────────────────────────────────────────────────
const manifestMatch = bundle.match(/(<script type="__bundler\/manifest">)([\s\S]*?)(<\/script>)/);
if (!manifestMatch) { console.error('❌ Manifest não encontrado'); process.exit(1); }

const manifest = JSON.parse(manifestMatch[2]);
const oldEntry = manifest[HERO_UUID];
console.log('Imagem atual no bundle: ' + (Buffer.from(oldEntry.data, 'base64').length / 1024).toFixed(1) + ' KB');

const newImg = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/entrada.jpeg');
console.log('Nova imagem (entrada.jpeg): ' + (newImg.length / 1024).toFixed(1) + ' KB');

manifest[HERO_UUID] = {
  mime: 'image/jpeg',
  compressed: false,
  data: newImg.toString('base64'),
};

const newBundle = bundle.replace(
  manifestMatch[0],
  manifestMatch[1] + JSON.stringify(manifest) + manifestMatch[3]
);

console.log('✅ Imagem hero substituída por entrada.jpeg');

// ── Also update CSS hero: adjust background-position for this portrait shot ──
const TAG = '<script type="__bundler/template">';
const tplStart = newBundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = newBundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(newBundle.slice(tplStart, jsonEnd));

// Update background-position to show upper portion of the room (chairs + door)
const oldPos = 'background-position: center center;';
const newPos = 'background-position: center 35%;';
if (t.includes(oldPos)) {
  t = t.replace(oldPos, newPos);
  console.log('✅ background-position ajustado para center 35%');
} else {
  console.log('ℹ️  background-position já diferente, mantendo');
}

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = newBundle.slice(0, tplStart) + safeJSON + newBundle.slice(jsonEnd);

// Verify JSON
const m = finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo! Tamanho total: ' + (finalBundle.length / 1024 / 1024).toFixed(1) + ' MB');
