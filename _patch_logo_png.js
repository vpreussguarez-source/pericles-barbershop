const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

// ── 1. Substituir imagem no manifest ────────────────────────────────────────
const MANIFEST_TAG = '<script type="__bundler/manifest">';
const manifestStart = bundle.indexOf(MANIFEST_TAG) + MANIFEST_TAG.length;
const manifestEnd = bundle.indexOf('</script>', manifestStart);
const manifest = JSON.parse(bundle.slice(manifestStart, manifestEnd));

const logoUUID = '991810e6-4e0d-40f6-a49a-8a8a715bfcf0';
const logoB64 = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/logo.png').toString('base64');
manifest[logoUUID] = { mime: 'image/png', compressed: false, data: logoB64 };
console.log('✅ logo.png injetado no manifest (image/png)');

const newBundle = bundle.slice(0, manifestStart) + JSON.stringify(manifest) + bundle.slice(manifestEnd);

// ── 2. Remover mix-blend-mode do CSS (.nav-logo img e .foot-brand img) ───────
const TAG = '<script type="__bundler/template">';
const tplStart = newBundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = newBundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(newBundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Nav logo CSS
const oldNavLogoCSS = `.nav-logo img { height: 52px; width: auto; object-fit: contain; mix-blend-mode: lighten; }`;
const newNavLogoCSS = `.nav-logo img { height: 52px; width: auto; object-fit: contain; }`;
if (!t.includes(oldNavLogoCSS)) { console.error('❌ CSS .nav-logo img não encontrado'); process.exit(1); }
t = t.replace(oldNavLogoCSS, newNavLogoCSS);
console.log('✅ mix-blend-mode removido de .nav-logo img');

// Footer brand img CSS
const oldFootCSS = `.foot-brand img { height: 70px; width: auto; object-fit: contain; margin-bottom: 20px; display: block; mix-blend-mode: lighten; }`;
const newFootCSS = `.foot-brand img { height: 70px; width: auto; object-fit: contain; margin-bottom: 20px; display: block; }`;
if (!t.includes(oldFootCSS)) { console.error('❌ CSS .foot-brand img não encontrado'); process.exit(1); }
t = t.replace(oldFootCSS, newFootCSS);
console.log('✅ mix-blend-mode removido de .foot-brand img');

// Também limpar inline style do footer img caso exista
const oldFootImg = `<img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;">`;
const newFootImg = `<img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop">`;
if (t.includes(oldFootImg)) {
  t = t.replace(oldFootImg, newFootImg);
  console.log('✅ Inline mix-blend-mode removido do img do footer');
} else {
  console.log('ℹ️  Sem inline mix-blend-mode no footer img');
}

// ── 3. Salvar ────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = newBundle.slice(0, tplStart) + safeJSON + newBundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
