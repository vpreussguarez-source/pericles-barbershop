const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

// ── Manifest (images) ──────────────────────────────────────────────────────
const MANIFEST_TAG = '<script type="__bundler/manifest">';
const manifestStart = bundle.indexOf(MANIFEST_TAG) + MANIFEST_TAG.length;
const manifestEnd = bundle.indexOf('</script>', manifestStart);
const manifest = JSON.parse(bundle.slice(manifestStart, manifestEnd));

const logoUUID = '991810e6-4e0d-40f6-a49a-8a8a715bfcf0';
const logoB64 = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/logo.jpeg').toString('base64');
manifest[logoUUID] = { mime: 'image/jpeg', compressed: false, data: logoB64 };
console.log('✅ logo.jpeg injetado no manifest');

const newManifest = bundle.slice(0, manifestStart) + JSON.stringify(manifest) + bundle.slice(manifestEnd);

// ── Template (HTML/CSS) ────────────────────────────────────────────────────
const TAG = '<script type="__bundler/template">';
const tplStart = newManifest.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = newManifest.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(newManifest.slice(tplStart, jsonEnd));
console.log('Template OK');

// ═══════════════════════════════════════════════════════
// 1. Ajustar tamanho do logo no navbar (48px) e footer (60px)
// ═══════════════════════════════════════════════════════
const oldNavLogoCSS = `.nav-logo img { height: 46px; }`;
const newNavLogoCSS = `.nav-logo img { height: 48px; width: auto; object-fit: contain; }`;
if (!t.includes(oldNavLogoCSS)) { console.error('❌ CSS nav-logo img não encontrado'); process.exit(1); }
t = t.replace(oldNavLogoCSS, newNavLogoCSS);
console.log('✅ nav-logo img: 48px');

// ═══════════════════════════════════════════════════════
// 2. CSS do footer — alinhar ao topo, espaçamento, logo 60px
// ═══════════════════════════════════════════════════════
// Encontrar o bloco .foot-brand img se existir, ou adicionar junto ao .foot-brand
const idxFBI = t.indexOf('.foot-brand img');
if (idxFBI !== -1) {
  const lineEnd = t.indexOf('}', idxFBI);
  const oldFBI = t.slice(idxFBI, lineEnd + 1);
  t = t.replace(oldFBI, `.foot-brand img { height: 60px; width: auto; object-fit: contain; margin-bottom: 16px; display: block; }`);
  console.log('✅ .foot-brand img existente atualizado');
} else {
  // Inserir antes de .foot-brand {
  const fbAnchor = `.foot-brand {`;
  if (!t.includes(fbAnchor)) { console.error('❌ .foot-brand CSS não encontrado'); process.exit(1); }
  t = t.replace(fbAnchor, `.foot-brand img { height: 60px; width: auto; object-fit: contain; margin-bottom: 16px; display: block; }\n.foot-brand {`);
  console.log('✅ .foot-brand img CSS adicionado (60px)');
}

// ═══════════════════════════════════════════════════════
// 3. Ajustar .foot-top para alinhar ao topo com espaçamento uniforme
// ═══════════════════════════════════════════════════════
const idxFT = t.indexOf('.foot-top {');
if (idxFT !== -1) {
  const ftEnd = t.indexOf('}', idxFT);
  const oldFT = t.slice(idxFT, ftEnd + 1);
  const newFT = `.foot-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; padding: 48px 0 40px; }`;
  t = t.replace(oldFT, newFT);
  console.log('✅ .foot-top: align-items:flex-start, gap:48px');
} else {
  console.log('ℹ️ .foot-top não encontrado no CSS, pulando');
}

// ═══════════════════════════════════════════════════════
// 4. Garantir que .foot-loc-row alinhe ao centro
// ═══════════════════════════════════════════════════════
const oldLocRow = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 0;
}`;
const newLocRow = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}`;
if (t.includes(oldLocRow)) {
  t = t.replace(oldLocRow, newLocRow);
  console.log('✅ .foot-loc-row margin-top ajustado');
} else {
  console.log('ℹ️ .foot-loc-row não alterado');
}

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = newManifest.slice(0, tplStart) + safeJSON + newManifest.slice(jsonEnd);
// Validate template JSON
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
