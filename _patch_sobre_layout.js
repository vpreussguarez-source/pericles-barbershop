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
// 1. Substituir CSS antigo do .sobre-imgs
// ═══════════════════════════════════════════════════════
const oldImgsCSS = `.sobre-imgs {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  position: relative; overflow: hidden;
}
.sobre-imgs img {
  width: 100%; display: block; object-fit: cover;
  filter: brightness(0.88) saturate(0.85);
  transition: filter .4s, transform .4s ease;
}
.sobre-imgs img:hover { transform: scale(1.05); }
/* foto principal ocupa linha inteira */
.sobre-imgs .img-main { grid-column: 1 / -1; aspect-ratio: 16/8; object-position: center 45%; }
/* foto secundária esq */
.sobre-imgs .img-sec1 { aspect-ratio: 4/5; object-position: center center; }
/* foto secundária dir */
.sobre-imgs .img-sec2 { aspect-ratio: 4/5; object-position: center 30%; }
/* gold frame accent */
.sobre-imgs::after {
  content: ''; position: absolute;
  bottom: -14px; right: -14px;
  width: 55%; height: 55%;
  border: 2px solid var(--gold3); z-index: -1;
}`;

const newImgsCSS = `/* ── SOBRE: foto destaque + duo escalonado ── */
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

if (!t.includes(oldImgsCSS)) {
  console.error('❌ CSS antigo do .sobre-imgs não encontrado');
  process.exit(1);
}
t = t.replace(oldImgsCSS, newImgsCSS);
console.log('✅ CSS do .sobre-imgs substituído');

// ═══════════════════════════════════════════════════════
// 2. Remover bloco extra do img-main (scale 1.2 inline)
// ═══════════════════════════════════════════════════════
const oldExtraCSS = `\n\n\n/* ── img-main: zoom base + hover animado igual às demais da grade ── */\n.sobre-imgs .img-main { transform: scale(1.2); }\n.sobre-imgs .img-main:hover { transform: scale(1.25); }`;
if (t.includes(oldExtraCSS)) {
  t = t.replace(oldExtraCSS, '');
  console.log('✅ CSS extra do img-main removido');
} else {
  // Try alternate whitespace
  const alt = `\n\n/* ── img-main: zoom base + hover animado igual às demais da grade ── */\n.sobre-imgs .img-main { transform: scale(1.2); }\n.sobre-imgs .img-main:hover { transform: scale(1.25); }`;
  if (t.includes(alt)) {
    t = t.replace(alt, '');
    console.log('✅ CSS extra do img-main removido (alt)');
  } else {
    console.log('⚠️  CSS extra img-main não encontrado — pode já ter sido removido');
  }
}

// ═══════════════════════════════════════════════════════
// 3. Reorganizar HTML do .sobre-imgs
// ═══════════════════════════════════════════════════════
const oldImgsHTML = `<div class="sobre-imgs">
        <img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 30%;transform-origin:center 30%;">
        <img class="img-sec1" src="5f95b8a6-f34b-4820-aefd-7d557d50a7b4" alt="Sala de espera" style="object-position:center 40%;">
        <img class="img-sec2" src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada" style="object-position:center 25%;">
      </div>`;

const newImgsHTML = `<div class="sobre-imgs">
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

if (!t.includes(oldImgsHTML)) {
  console.error('❌ HTML antigo do .sobre-imgs não encontrado');
  process.exit(1);
}
t = t.replace(oldImgsHTML, newImgsHTML);
console.log('✅ HTML do .sobre-imgs reorganizado');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
