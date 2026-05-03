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
// 1. Substituir CSS do gal-grid
// ═══════════════════════════════════════════════════════
const oldGalCSS = `.gal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 260px 220px;
  gap: 8px; margin-top: 44px;
}
.gal-item { overflow: hidden; position: relative; }
.gal-item img {
  width: 100%; height: 100%; display: block; object-fit: cover;
  filter: saturate(0.55) brightness(0.75);
  transition: filter .5s, transform .5s;
}
.gal-item:hover img { filter: saturate(0.95) brightness(1); transform: scale(1.05); }
.gal-item::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.12) 0%, transparent 60%);
  opacity: 0; transition: opacity .4s; pointer-events: none;
}
.gal-item:hover::after { opacity: 1; }
/* layout: primeira linha — item largo + 2 pequenos */
.gal-item.wide { grid-column: span 2; }`;

const newGalCSS = `.gal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 280px 200px 220px 160px;
  gap: 12px;
  margin-top: 0;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}
.gal-item { overflow: hidden; border-radius: 8px; position: relative; }
.gal-item img {
  width: 100%; height: 100%; display: block; object-fit: cover;
  filter: saturate(0.6) brightness(0.8);
  transition: filter 0.4s ease, transform 0.4s ease;
}
.gal-item:hover img { filter: saturate(1) brightness(1); transform: scale(1.05); }
.gal-item::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.10) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.4s; pointer-events: none;
}
.gal-item:hover::after { opacity: 1; }
.gal-item.wide { grid-column: span 2; }
.gal-item.tall { grid-row: span 2; }
.gal-item.full { grid-column: 1 / -1; }`;

if (!t.includes(oldGalCSS)) { console.error('❌ CSS gal-grid não encontrado'); process.exit(1); }
t = t.replace(oldGalCSS, newGalCSS);
console.log('✅ CSS gal-grid: magazine layout com 4 linhas, border-radius 8px');

// ═══════════════════════════════════════════════════════
// 2. Substituir HTML da seção (título + grid com 8 imagens)
// ═══════════════════════════════════════════════════════
const oldEspacoInner = `    <div class="sec-tag">Nosso Espaço</div>
    <div class="gal-grid">
      <!-- Linha 1: item largo (2 cols) + 1 col -->
      <div class="gal-item wide">
        <img src="b8933d8f-884d-449f-9af6-33596df1af79" alt="Entrada" style="object-position:center 30%;">
      </div>
      <div class="gal-item">
        <img src="172171e5-1dce-40b5-af30-11ac62cd2392" alt="Cadeira dourada" style="object-position:center 20%;">
      </div>
      <!-- Linha 2: 3 itens iguais -->
      <div class="gal-item">
        <img src="5f95b8a6-f34b-4820-aefd-7d557d50a7b4" alt="Sala de espera" style="object-position:center 45%;">
      </div>
      <div class="gal-item">
        <img src="fc4e6959-69fc-421d-91f5-082557f3dc6d" alt="Estante de produtos" style="object-position:center top;">
      </div>
      <div class="gal-item">
        <img src="2f354bae-f634-48f2-ac57-864b01589014" alt="Xbox" style="object-position:center 35%;">
      </div>
    </div>`;

const newEspacoInner = `    <div class="sec-tag" style="text-align:center;">NOSSO ESPAÇO</div>
    <h2 class="sec-h2" style="text-align:center;">Conheça Nosso <em style="color:var(--gold);font-style:normal;">Espaço</em></h2>
    <div class="gold-bar" style="margin:0 auto 40px;"></div>
    <div class="gal-grid">
      <!-- Linha 1: destaque largo (2 cols) + tall (spans 2 linhas) -->
      <div class="gal-item wide">
        <img src="entrada.JPEG" alt="Entrada Pericles Barbershop" style="object-position:center 40%;">
      </div>
      <div class="gal-item tall">
        <img src="IMG_0092.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 30%;">
      </div>
      <!-- Linha 2: 2 itens (coluna 3 ainda ocupada pelo tall) -->
      <div class="gal-item">
        <img src="café.jpeg" alt="Café Pericles Barbershop" style="object-position:center center;">
      </div>
      <div class="gal-item">
        <img src="IMG_0094.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 30%;">
      </div>
      <!-- Linha 3: 3 itens iguais -->
      <div class="gal-item">
        <img src="IMG_0095.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 35%;">
      </div>
      <div class="gal-item">
        <img src="IMG_0098.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 40%;">
      </div>
      <div class="gal-item">
        <img src="IMG_0099.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 30%;">
      </div>
      <!-- Linha 4: panorâmica full width -->
      <div class="gal-item full">
        <img src="IMG_0096.JPEG" alt="Espaço Pericles Barbershop" style="object-position:center 40%;">
      </div>
    </div>`;

if (!t.includes(oldEspacoInner)) { console.error('❌ HTML seção Espaço não encontrado'); process.exit(1); }
t = t.replace(oldEspacoInner, newEspacoInner);
console.log('✅ HTML: título + 8 imagens em grid magazine');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
