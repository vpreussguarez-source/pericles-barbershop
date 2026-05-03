const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ── Replace hero-bg CSS block ─────────────────────────────────────────────────
const oldHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: cover;
  background-position: center 35%;
  filter: brightness(0.38) saturate(0.8);
  transform: scale(1.06);
  transition: transform 10s ease;
  image-rendering: auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}
.hero:hover .hero-bg { transform: scale(1); }`;

const newHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: cover;
  background-position: center 30%;
  filter: brightness(0.38) saturate(0.8);
}
@media (max-width: 768px) {
  .hero-bg { background-position: center center; }
}`;

if (!t.includes(oldHeroCSS)) {
  console.error('❌ Bloco CSS hero não encontrado — verifique o conteúdo exato');
  process.exit(1);
}

t = t.replace(oldHeroCSS, newHeroCSS);
console.log('✅ CSS hero atualizado: center 30% desktop, center center mobile, sem zoom');

// ── Save ──────────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
