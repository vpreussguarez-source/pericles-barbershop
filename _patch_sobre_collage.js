const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ═══════════════════════════════════════════════════════
// 1. Substituir CSS antigo pelo collage
// ═══════════════════════════════════════════════════════
const oldCSS = `/* ── SOBRE: foto destaque + duo escalonado ── */
.sobre-imgs {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* foto grande em destaque no topo */
.sobre-imgs-feat {
  position: relative;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  box-shadow: 0 16px 56px rgba(0,0,0,0.6);
  z-index: 2;
}
.sobre-imgs-feat img {
  width: 100%; display: block; object-fit: cover;
  aspect-ratio: 4/3;
  filter: brightness(0.9) saturate(0.88);
  transition: transform .65s ease;
}
.sobre-imgs-feat:hover img { transform: scale(1.04); }

/* linha dourada na base da foto destaque */
.sobre-imgs-feat::after {
  content: '';
  position: absolute;
  bottom: 0; left: 10%; right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

/* row das duas fotos menores */
.sobre-imgs-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 10px;
  position: relative;
  z-index: 1;
}

.sobre-imgs-cell {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 36px rgba(0,0,0,0.5);
  position: relative;
}

/* célula direita sobe — efeito de sobreposição escalonada */
.sobre-imgs-cell:last-child {
  margin-top: -28px;
}

.sobre-imgs-cell img {
  width: 100%; display: block; object-fit: cover;
  aspect-ratio: 1/1;
  filter: brightness(0.85) saturate(0.85);
  transition: transform .5s ease;
}
.sobre-imgs-cell:hover img { transform: scale(1.05); }

/* overlay dourado sutil no hover */
.sobre-imgs-cell::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(145deg, rgba(201,168,76,0.1) 0%, transparent 55%);
  z-index: 1; pointer-events: none;
  opacity: 0; transition: opacity .4s;
}
.sobre-imgs-cell:hover::before { opacity: 1; }

/* gold frame accent no canto inferior direito */
.sobre-imgs::after {
  content: ''; position: absolute;
  bottom: -12px; right: -12px;
  width: 42%; height: 38%;
  border: 2px solid var(--gold3); z-index: -1;
  border-radius: 0 0 12px 0;
}`;

const newCSS = `/* ── SOBRE: collage editorial ── */
.sobre-fotos {
  position: relative;
  height: 500px;
}

.sobre-foto-principal {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 420px;
  object-fit: cover;
  object-position: center 30%;
  border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  z-index: 1;
}

.sobre-foto-esquerda {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40%;
  height: 260px;
  object-fit: cover;
  object-position: center 40%;
  border-radius: 4px;
  transform: rotate(-3deg);
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 2;
}

.sobre-foto-direita {
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

if (!t.includes(oldCSS)) { console.error('❌ CSS antigo não encontrado'); process.exit(1); }
t = t.replace(oldCSS, newCSS);
console.log('✅ CSS collage aplicado');

// ═══════════════════════════════════════════════════════
// 2. Substituir HTML
// ═══════════════════════════════════════════════════════
const oldHTML = `<div class="sobre-imgs">
        <!-- foto destaque -->
        <div class="sobre-imgs-feat">
          <img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 30%;">
        </div>
        <!-- duo escalonado -->
        <div class="sobre-imgs-row">
          <div class="sobre-imgs-cell">
            <img class="img-sec1" src="5f95b8a6-f34b-4820-aefd-7d557d50a7b4" alt="Sala de espera" style="object-position:center 40%;">
          </div>
          <div class="sobre-imgs-cell">
            <img class="img-sec2" src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada" style="object-position:center 25%;">
          </div>
        </div>
      </div>`;

const newHTML = `<div class="sobre-fotos">
        <img class="sobre-foto-principal" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles">
        <img class="sobre-foto-esquerda"  src="5f95b8a6-f34b-4820-aefd-7d557d50a7b4" alt="Sala de espera">
        <img class="sobre-foto-direita"   src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada">
      </div>`;

if (!t.includes(oldHTML)) { console.error('❌ HTML antigo não encontrado'); process.exit(1); }
t = t.replace(oldHTML, newHTML);
console.log('✅ HTML collage aplicado');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
