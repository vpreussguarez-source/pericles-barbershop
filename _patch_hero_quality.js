const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
const scriptCloseStart = jsonEnd;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ── 1. Corrigir CSS do hero ───────────────────────────────────────────────────
const oldHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: cover;
  background-position: center 55%;
  filter: brightness(0.38) saturate(0.8);
  transform: scale(1.06);
  transition: transform 10s ease;
}`;

const newHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: cover;
  background-position: center center;
  filter: brightness(0.38) saturate(0.8);
  transform: scale(1.06);
  transition: transform 10s ease;
  image-rendering: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}`;

if (!t.includes(oldHeroCSS)) { console.error('❌ CSS hero não encontrado'); process.exit(1); }
t = t.replace(oldHeroCSS, newHeroCSS);
console.log('✅ CSS do hero atualizado: center center + will-change + backface-visibility');

// ── 2. Substituir imagem no manifest pelo original em alta resolução ──────────
const HERO_UUID = 'b8933d8f-884d-449f-9af6-33596df1af79';
const manifestMatch = bundle.match(/(<script type="__bundler\/manifest">)([\s\S]*?)(<\/script>)/);
if (!manifestMatch) { console.error('❌ Manifest não encontrado'); process.exit(1); }

const manifest = JSON.parse(manifestMatch[2]);
const oldEntry = manifest[HERO_UUID];
console.log('Imagem atual no bundle: ' + (Buffer.from(oldEntry.data, 'base64').length / 1024).toFixed(1) + ' KB');

// Ler a imagem original
const origImg = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/fundo jpeg.jpg');
console.log('Imagem original: ' + (origImg.length / 1024).toFixed(1) + ' KB, ' +
  getJpegDimensions(origImg).width + 'x' + getJpegDimensions(origImg).height + 'px');

manifest[HERO_UUID] = {
  mime: 'image/jpeg',
  compressed: false,
  data: origImg.toString('base64'),
};

const newManifestJSON = JSON.stringify(manifest);
const newBundle_step1 = bundle.replace(
  manifestMatch[0],
  manifestMatch[1] + newManifestJSON + manifestMatch[3]
);
console.log('✅ Imagem hero substituída pelo original 3024×4032 px');

// ── 3. Re-salvar template com CSS atualizado ─────────────────────────────────
// Precisamos re-extrair do bundle já com o manifest novo
const tplStart2 = newBundle_step1.indexOf(TAG) + TAG.length;
const realEndIdx2 = newBundle_step1.indexOf(endMarker, tplStart2);
const jsonEnd2 = realEndIdx2 + ('</body></html>"').length;

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = newBundle_step1.slice(0, tplStart2) + safeJSON + newBundle_step1.slice(jsonEnd2);

// Verificar JSON
const m = finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo! Tamanho total: ' + (finalBundle.length / 1024 / 1024).toFixed(1) + ' MB');

function getJpegDimensions(buf) {
  let i = 0;
  if (buf[i++] !== 0xFF || buf[i++] !== 0xD8) return null;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) return null;
    const marker = buf[i+1];
    if (marker >= 0xC0 && marker <= 0xC3) {
      return { height: buf.readUInt16BE(i+5), width: buf.readUInt16BE(i+7) };
    }
    const len = buf.readUInt16BE(i+2);
    i += 2 + len;
  }
  return null;
}
