const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Find the old produtos section ──────────────────────────────────────
const secOpen = '<section class="produtos" id="produtos">';
const secStart = t.indexOf(secOpen);
if (secStart === -1) { console.error('❌ Seção produtos não encontrada'); process.exit(1); }
const secEnd = t.indexOf('</section>', secStart) + '</section>'.length;
console.log('Seção produtos encontrada:', secStart, '→', secEnd);

// ── 2. Build product cards ─────────────────────────────────────────────────
const WA = 'https://wa.me/5546988034614';

function card(brand, brandSlug, name, img, cat, price) {
  return `<div class="prod-card" data-cat="${cat}" data-brand="${brandSlug}">
          <div class="prod-img-wrap"><img src="${img}" alt="${name}" loading="lazy"></div>
          <div class="prod-info">
            <span class="prod-brand">${brand}</span>
            <p class="prod-name">${name}</p>
            <span class="prod-price">${price}</span>
            <a class="prod-btn" href="${WA}" target="_blank" rel="noopener">PEDIR</a>
          </div>
        </div>`;
}

const cards = [
  // BABOON
  card('BABOON','baboon','Cement Effect Hair Pomade','baboon-cement.png','cabelo','R$ 93,00'),
  card('BABOON','baboon','Matte Clay Hair Pomade','baboon-matte-clay.png','cabelo','R$ 93,00'),
  card('BABOON','baboon','Óleo para Barba','baboon-oleo-barba.png','barba','R$ 70,00'),
  card('BABOON','baboon','Balm para Barba','baboon-balm.png','barba','R$ 60,00'),
  // DON ALCIDES
  card('DON ALCIDES','don-alcides','Shampoo para Barba','don-shampoo.png','barba','R$ 40,00'),
  card('DON ALCIDES','don-alcides','Freak Show Pasta Fiber Cream','don-freak-show.png','cabelo','R$ 99,90'),
  card('DON ALCIDES','don-alcides','Pasta Matte 80g','don-pasta-matte.png','cabelo','R$ 99,90'),
  card('DON ALCIDES','don-alcides','Pasta Fiber 80g','don-pasta-fiber.png','cabelo','R$ 99,90'),
  card('DON ALCIDES','don-alcides','Balm para Barba 120ml','don-balm.png','barba','R$ 82,00'),
  card('DON ALCIDES','don-alcides','Sabão Cra-Crá','don-sabao.png','barba','R$ 60,00'),
  card('DON ALCIDES','don-alcides','Pente de Madeira','don-pente.png','cabelo','R$ 40,00'),
  card('DON ALCIDES','don-alcides','Peaky Blinders Pasta Matte','don-peaky.png','cabelo','R$ 99,90'),
  // SCOUT
  card('SCOUT','scout','Grooming 300ml','scout-grooming.png','cabelo','R$ 100,00'),
  card('SCOUT','scout','Beard Balm Absolut 120g','scout-beard-balm.png','barba','R$ 80,00'),
  card('SCOUT','scout','Beard Oil 30ml','scout-beard-oil.png','barba','R$ 70,00'),
  card('SCOUT','scout','Sérum Facial 30ml','scout-serum.png','cabelo','R$ 80,00'),
  // CHARLIE BROWN JR.
  card('CHARLIE BROWN JR.','outros','Desodorante Aerossol','charlie-desodorante.png','outros','R$ 40,00'),
  // BOYS POMADE
  card('BOYS POMADE','boys-pomade','Matte Strong Hold','boys-matte.png','cabelo','R$ 89,90'),
  card('BOYS POMADE','boys-pomade','Strong Bold','boys-strong.png','cabelo','R$ 89,90'),
].join('\n        ');

// ── 3. Build new section HTML ──────────────────────────────────────────────
const newSection = `<section class="produtos" id="produtos">
  <div class="section-sep"></div>
  <div class="sec-inner">
    <div class="sec-tag">Linha Exclusiva</div>
    <h2 class="sec-h2">Nossos <em style="color:var(--gold);font-style:normal;">Produtos</em></h2>
    <p style="font-family:var(--sf);font-size:14px;color:var(--muted);letter-spacing:0.5px;margin-bottom:36px;max-width:560px;">Trabalhamos com as melhores marcas disponíveis na Pericles Barbershop: Don Alcides, Baboon, Scout, Boys Pomade e mais.</p>

    <div class="prod-filter-wrap">
      <div class="prod-filters" id="prodCatFilters">
        <button class="active" onclick="filterProd(this,'cat','todos')">TODOS</button>
        <button onclick="filterProd(this,'cat','barba')">BARBA</button>
        <button onclick="filterProd(this,'cat','cabelo')">CABELO</button>
      </div>
      <div class="prod-filters prod-filters--brand" id="prodBrandFilters">
        <button onclick="filterProd(this,'brand','don-alcides')">DON ALCIDES</button>
        <button onclick="filterProd(this,'brand','baboon')">BABOON</button>
        <button onclick="filterProd(this,'brand','scout')">SCOUT</button>
        <button onclick="filterProd(this,'brand','boys-pomade')">BOYS POMADE</button>
        <button onclick="filterProd(this,'brand','outros')">OUTROS</button>
      </div>
    </div>

    <div class="prod-grid">
        ${cards}
    </div>
  </div>
</section>`;

t = t.slice(0, secStart) + newSection + t.slice(secEnd);
console.log('✅ Seção produtos substituída');

// ── 4. Replace filterProd JS ───────────────────────────────────────────────
const oldFnMarker = 'function filterProd(';
const fnStart = t.indexOf(oldFnMarker);
if (fnStart !== -1) {
  // Find the closing brace of the function
  let depth = 0, i = fnStart;
  while (i < t.length) {
    if (t[i] === '{') depth++;
    else if (t[i] === '}') { depth--; if (depth === 0) { i++; break; } }
    i++;
  }
  const oldFn = t.slice(fnStart, i);
  const newFn = `function filterProd(btn, axis, val) {
    // Toggle brand: clicking active brand button resets to 'todos'
    if (axis === 'brand') {
      var wasActive = btn.classList.contains('active');
      document.querySelectorAll('#prodBrandFilters button').forEach(function(b){ b.classList.remove('active'); });
      if (!wasActive) { btn.classList.add('active'); }
    } else {
      document.querySelectorAll('#prodCatFilters button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    }
    var activeCat = (document.querySelector('#prodCatFilters button.active') || {dataset:{val:'todos'}}).getAttribute('onclick');
    activeCat = activeCat ? activeCat.match(/'([^']+)'\s*\)$/)[1] : 'todos';
    var activeBrand = (document.querySelector('#prodBrandFilters button.active') || null);
    activeBrand = activeBrand ? activeBrand.getAttribute('onclick').match(/'([^']+)'\s*\)$/)[1] : 'todos';
    document.querySelectorAll('.prod-card').forEach(function(card) {
      var catOk  = activeCat === 'todos'  || card.dataset.cat   === activeCat;
      var brandOk = activeBrand === 'todos' || card.dataset.brand === activeBrand;
      card.style.display = (catOk && brandOk) ? '' : 'none';
    });
  }`;
  t = t.slice(0, fnStart) + newFn + t.slice(fnStart + oldFn.length);
  console.log('✅ filterProd JS atualizado');
} else {
  // Inject new function before </script> of the inline script block containing the scroll handler
  const scrollFnMarker = 'function updateNav()';
  const scrollPos = t.indexOf(scrollFnMarker);
  if (scrollPos !== -1) {
    const scriptClose = t.indexOf('</script>', scrollPos);
    const newFn = `\n  function filterProd(btn, axis, val) {
    if (axis === 'brand') {
      var wasActive = btn.classList.contains('active');
      document.querySelectorAll('#prodBrandFilters button').forEach(function(b){ b.classList.remove('active'); });
      if (!wasActive) { btn.classList.add('active'); }
    } else {
      document.querySelectorAll('#prodCatFilters button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    }
    var activeCat = (document.querySelector('#prodCatFilters button.active') || {getAttribute:function(){return \"filterProd(this,'cat','todos')\"}}).getAttribute('onclick');
    activeCat = activeCat ? activeCat.match(/'([^']+)'\\s*\\)$/)[1] : 'todos';
    var activeBrand = document.querySelector('#prodBrandFilters button.active');
    activeBrand = activeBrand ? activeBrand.getAttribute('onclick').match(/'([^']+)'\\s*\\)$/)[1] : 'todos';
    document.querySelectorAll('.prod-card').forEach(function(card) {
      var catOk  = activeCat === 'todos'  || card.dataset.cat   === activeCat;
      var brandOk = activeBrand === 'todos' || card.dataset.brand === activeBrand;
      card.style.display = (catOk && brandOk) ? '' : 'none';
    });
  }\n`;
    t = t.slice(0, scriptClose) + newFn + t.slice(scriptClose);
    console.log('✅ filterProd JS injetado (novo)');
  } else {
    console.warn('⚠️ filterProd não encontrado e scroll marker não encontrado — JS não atualizado');
  }
}

// ── 5. Update/add CSS for dual filter row ─────────────────────────────────
const oldFilterCss = '.prod-filters {';
const filterCssPos = t.indexOf(oldFilterCss);
if (filterCssPos !== -1) {
  // Find end of this rule block
  let depth = 0, ci = filterCssPos;
  while (ci < t.length) {
    if (t[ci] === '{') depth++;
    else if (t[ci] === '}') { depth--; if (depth === 0) { ci++; break; } }
    ci++;
  }
  const oldFilterBlock = t.slice(filterCssPos, ci);
  const newFilterBlock = `.prod-filter-wrap { display:flex; flex-direction:column; gap:10px; margin-bottom:40px; align-items:center; }
  .prod-filters { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
  .prod-filters--brand { gap:8px; }
  .prod-filters button {
    background: transparent;
    border: 1px solid rgba(196,146,42,0.4);
    color: var(--muted);
    font-family: var(--sf);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    padding: 7px 18px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-transform: uppercase;
  }
  .prod-filters button:hover,
  .prod-filters button.active {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--black);
  }`;
  t = t.slice(0, filterCssPos) + newFilterBlock + t.slice(filterCssPos + oldFilterBlock.length);
  console.log('✅ CSS .prod-filters atualizado');
} else {
  console.warn('⚠️ CSS .prod-filters não encontrado, inserindo antes de </style>');
  const styleClose = t.lastIndexOf('</style>');
  const extraCss = `
  .prod-filter-wrap { display:flex; flex-direction:column; gap:10px; margin-bottom:40px; align-items:center; }
  .prod-filters { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
  .prod-filters--brand { gap:8px; }
  .prod-filters button { background:transparent; border:1px solid rgba(196,146,42,0.4); color:var(--muted); font-family:var(--sf); font-size:11px; font-weight:700; letter-spacing:0.12em; padding:7px 18px; cursor:pointer; transition:all 0.25s ease; text-transform:uppercase; }
  .prod-filters button:hover, .prod-filters button.active { background:var(--gold); border-color:var(--gold); color:var(--black); }
`;
  t = t.slice(0, styleClose) + extraCss + t.slice(styleClose);
  console.log('✅ CSS .prod-filters injetado');
}

// ── 6. Save ────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
