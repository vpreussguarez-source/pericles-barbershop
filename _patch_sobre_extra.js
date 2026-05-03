const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Adicionar CSS da .sobre-foto-extra
const oldCSS = `.sobre-foto-direita {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 38%;
  height: 240px;
  object-fit: cover;
  object-position: center 25%;
  border-radius: 4px;
  transform: rotate(2deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}`;

const newCSS = `.sobre-foto-direita {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 38%;
  height: 240px;
  object-fit: cover;
  object-position: center 25%;
  border-radius: 4px;
  transform: rotate(2deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}

.sobre-foto-extra {
  position: absolute;
  top: 0;
  right: 0;
  width: 36%;
  height: 240px;
  object-fit: cover;
  border-radius: 4px;
  transform: rotate(2.5deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}`;

if (!t.includes(oldCSS)) { console.error('❌ .sobre-foto-direita CSS não encontrado'); process.exit(1); }
t = t.replace(oldCSS, newCSS);
console.log('✅ CSS .sobre-foto-extra adicionado');

// 2. Adicionar <img> no HTML do collage
const oldHTML = `        <img class="sobre-foto-direita"   src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada">
      </div>`;

const newHTML = `        <img class="sobre-foto-direita"   src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada">
        <img class="sobre-foto-extra"     src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada extra">
      </div>`;

if (!t.includes(oldHTML)) { console.error('❌ HTML do collage não encontrado'); process.exit(1); }
t = t.replace(oldHTML, newHTML);
console.log('✅ <img class="sobre-foto-extra"> adicionada ao HTML');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
