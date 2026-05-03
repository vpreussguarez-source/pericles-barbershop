const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: cover;
  background-position: center 30%;
  filter: brightness(0.38) saturate(0.8);
}
@media (max-width: 768px) {
  .hero-bg { background-position: center center; }
}`;

// entrada.JPEG é retrato (portrait), então escalar pela largura (85%) preserva os lados.
// background-position: center center centraliza.
// Para mobile (portrait screen), cover fica melhor.
const newHeroCSS = `.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: 85%;
  background-repeat: no-repeat;
  background-position: center center;
  filter: brightness(0.42) saturate(0.8);
}
@media (max-width: 768px) {
  .hero-bg {
    background-size: cover;
    background-position: center center;
  }
}`;

if (!t.includes(oldHeroCSS)) {
  console.error('❌ Bloco CSS hero não encontrado');
  process.exit(1);
}

t = t.replace(oldHeroCSS, newHeroCSS);
console.log('✅ CSS hero atualizado: background-size 85%, no-repeat, center center');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
