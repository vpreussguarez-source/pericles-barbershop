const fs = require('fs');
const path = require('path');

const dir        = 'C:/Users/vpreu/Desktop/Natan';
const bundlePath = path.join(dir, 'Pericles Barbershop.html');
const bundle     = fs.readFileSync(bundlePath, 'utf8');

// ── Mapeamento UUID → arquivo ─────────────────────────────────────────────────
const MAP = {
  'b8933d8f-884d-449f-9af6-33596df1af79': 'entrada.JPEG',        // hero bg
  '0d429c38-1c10-4533-9fe1-270e21a094e6': 'IMG_0098.JPEG',       // sobre destaque
  '5f95b8a6-f34b-4820-aefd-7d557d50a7b4': 'IMG_0095.JPEG',       // sobre menor esq
  '172171e5-1dce-40b5-af30-11ac62cd2392': 'IMG_0092.JPEG',       // sobre menor dir
  'fc4e6959-69fc-421d-91f5-082557f3dc6d': 'IMG_0099.JPEG',       // espaço foto 1
  '2f354bae-f634-48f2-ac57-864b01589014': 'IMG_0093.JPEG',       // espaço foto 2
};

// ── Substituir no manifest ────────────────────────────────────────────────────
const manifestMatch = bundle.match(/(<script type="__bundler\/manifest">)([\s\S]*?)(<\/script>)/);
if (!manifestMatch) { console.error('❌ Manifest não encontrado'); process.exit(1); }

const manifest = JSON.parse(manifestMatch[2]);

for (const [uuid, filename] of Object.entries(MAP)) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filename}`);
    process.exit(1);
  }
  const imgBuf = fs.readFileSync(filePath);
  const oldKB  = (Buffer.from(manifest[uuid].data, 'base64').length / 1024).toFixed(1);
  const newKB  = (imgBuf.length / 1024).toFixed(1);
  manifest[uuid] = {
    mime: 'image/jpeg',
    compressed: false,
    data: imgBuf.toString('base64'),
  };
  console.log(`✅ ${uuid.slice(0,8)}… → ${filename}  (${oldKB} KB → ${newKB} KB)`);
}

const newBundle = bundle.replace(
  manifestMatch[0],
  manifestMatch[1] + JSON.stringify(manifest) + manifestMatch[3]
);
console.log('\n✅ Manifest atualizado');

// ── Template: não precisa alterar (UUIDs já são as referências) ──────────────
// Apenas reprocessar com o novo manifest embutido
// Verificar JSON do template intacto
const TAG = '<script type="__bundler/template">';
const tplStart = newBundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd   = newBundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
JSON.parse(newBundle.slice(tplStart, jsonEnd));
console.log('✅ Template JSON intacto');

fs.writeFileSync(bundlePath, newBundle, 'utf8');
const sizeMB = (newBundle.length / 1024 / 1024).toFixed(1);
console.log(`✅ Bundle salvo! Tamanho total: ${sizeMB} MB`);
