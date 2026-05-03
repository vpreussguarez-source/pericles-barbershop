const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

// ── 1. Manifest: todos os UUIDs e tamanhos ────────────────────────────────────
const manifestMatch = bundle.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const manifest = JSON.parse(manifestMatch[1]);

console.log('═══════════════════════════════════════════════════');
console.log(' IMAGENS NO MANIFEST (bundle)');
console.log('═══════════════════════════════════════════════════');
for (const [uuid, entry] of Object.entries(manifest)) {
  const kb = (Buffer.from(entry.data, 'base64').length / 1024).toFixed(1);
  console.log(`  ${uuid}  |  ${entry.mime}  |  ${kb} KB`);
}

// ── 2. Template: onde cada UUID é usado ──────────────────────────────────────
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const t = JSON.parse(bundle.slice(tplStart, jsonEnd));

console.log('\n═══════════════════════════════════════════════════');
console.log(' USO NO TEMPLATE (onde aparece cada UUID)');
console.log('═══════════════════════════════════════════════════');

const uuids = Object.keys(manifest);
for (const uuid of uuids) {
  // Pega o contexto ao redor de cada UUID no template
  const idx = t.indexOf(uuid);
  if (idx === -1) { console.log(`  ${uuid}  → não encontrado no template`); continue; }

  // Tenta extrair o atributo alt ou o uso (src="", url(""), background-image)
  const snippet = t.slice(Math.max(0, idx - 120), idx + uuid.length + 60);

  // Alt text
  const altMatch = snippet.match(/alt="([^"]+)"/);
  const classMatch = snippet.match(/class="([^"]+)"/);
  const bgMatch = snippet.match(/background-image/);

  let uso = '';
  if (bgMatch) uso = '[hero background-image]';
  else if (altMatch) uso = `alt="${altMatch[1]}"` + (classMatch ? `  class="${classMatch[1]}"` : '');
  else if (classMatch) uso = `class="${classMatch[1]}"`;
  else uso = snippet.trim().slice(0, 80);

  console.log(`  ${uuid}`);
  console.log(`    → ${uso}`);
}
