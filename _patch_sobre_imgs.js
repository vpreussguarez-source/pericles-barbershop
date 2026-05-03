const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Localizar o bloco de imagens da seção sobre
const oldFotos = `      <!-- Fotos -->
      <div class="sobre-fotos">
        <img class="sobre-foto-principal" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles">
        <img class="sobre-foto-esquerda"  src="5f95b8a6-f34b-4820-aefd-7d557d50a7b4" alt="Sala de espera">
        <img class="sobre-foto-direita"   src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada">
        <img class="sobre-foto-extra"     src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada extra">
      </div>`;

const newFotos = `      <!-- Fotos -->
      <div class="sobre-fotos">
        <img class="sobre-foto-principal" src="entrada.JPEG"   alt="Entrada Pericles Barbershop">
        <img class="sobre-foto-esquerda"  src="café.jpeg"      alt="Café Pericles Barbershop">
        <img class="sobre-foto-direita"   src="IMG_0099.JPEG"  alt="Espaço Pericles Barbershop">
        <img class="sobre-foto-extra"     src="IMG_0096.JPEG"  alt="Espaço Pericles Barbershop">
      </div>`;

if (!t.includes(oldFotos)) { console.error('❌ Bloco de fotos não encontrado'); process.exit(1); }
t = t.replace(oldFotos, newFotos);
console.log('✅ sobre-foto-principal → entrada.JPEG');
console.log('✅ sobre-foto-esquerda  → café.jpeg');
console.log('✅ sobre-foto-direita   → IMG_0099.JPEG');
console.log('✅ sobre-foto-extra     → IMG_0096.JPEG');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
