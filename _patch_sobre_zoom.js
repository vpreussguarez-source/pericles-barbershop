const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Adicionar transition e overflow: hidden + cursor ao bloco compartilhado,
// e hover com scale combinado com a rotação de cada imagem
const oldShared = `.sobre-foto-principal,
.sobre-foto-esquerda,
.sobre-foto-direita,
.sobre-foto-extra {
  border: 2px solid rgba(212,175,55,0.6);
  outline: 1px solid rgba(212,175,55,0.2);
  outline-offset: 4px;
}`;

const newShared = `.sobre-foto-principal,
.sobre-foto-esquerda,
.sobre-foto-direita,
.sobre-foto-extra {
  border: 2px solid rgba(212,175,55,0.6);
  outline: 1px solid rgba(212,175,55,0.2);
  outline-offset: 4px;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  cursor: pointer;
  overflow: hidden;
}
.sobre-foto-principal:hover {
  transform: scale(1.05);
  box-shadow: 0 28px 70px rgba(0,0,0,0.55);
  z-index: 10;
}
.sobre-foto-esquerda:hover {
  transform: rotate(-3deg) scale(1.05);
  box-shadow: 0 22px 55px rgba(0,0,0,0.6);
  z-index: 10;
}
.sobre-foto-direita:hover {
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 22px 55px rgba(0,0,0,0.6);
  z-index: 10;
}
.sobre-foto-extra:hover {
  transform: rotate(2.5deg) scale(1.05);
  box-shadow: 0 22px 55px rgba(0,0,0,0.6);
  z-index: 10;
}`;

if (!t.includes(oldShared)) { console.error('❌ Bloco CSS compartilhado não encontrado'); process.exit(1); }
t = t.replace(oldShared, newShared);
console.log('✅ Zoom hover adicionado às 4 imagens do Sobre');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
