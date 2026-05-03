const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Add data-val to cat filter buttons ────────────────────────────────────
// Replace the prodCatFilters block
const oldCatFilters = `<div class="prod-filters" id="prodCatFilters">
        <button class="active" onclick="filterProd(this,'cat','todos')">TODOS</button>
        <button onclick="filterProd(this,'cat','barba')">BARBA</button>
        <button onclick="filterProd(this,'cat','cabelo')">CABELO</button>
      </div>`;
const newCatFilters = `<div class="prod-filters" id="prodCatFilters">
        <button class="active" data-val="todos" onclick="filterProd(this,'cat')">TODOS</button>
        <button data-val="barba" onclick="filterProd(this,'cat')">BARBA</button>
        <button data-val="cabelo" onclick="filterProd(this,'cat')">CABELO</button>
      </div>`;

if (!t.includes(oldCatFilters)) { console.error('❌ prodCatFilters não encontrado'); process.exit(1); }
t = t.replace(oldCatFilters, newCatFilters);
console.log('✅ Cat filter buttons com data-val');

// ── 2. Add data-val to brand filter buttons ──────────────────────────────────
const oldBrandFilters = `<div class="prod-filters prod-filters--brand" id="prodBrandFilters">
        <button onclick="filterProd(this,'brand','don-alcides')">DON ALCIDES</button>
        <button onclick="filterProd(this,'brand','baboon')">BABOON</button>
        <button onclick="filterProd(this,'brand','scout')">SCOUT</button>
        <button onclick="filterProd(this,'brand','boys-pomade')">BOYS POMADE</button>
        <button onclick="filterProd(this,'brand','outros')">OUTROS</button>
      </div>`;
const newBrandFilters = `<div class="prod-filters prod-filters--brand" id="prodBrandFilters">
        <button data-val="don-alcides" onclick="filterProd(this,'brand')">DON ALCIDES</button>
        <button data-val="baboon" onclick="filterProd(this,'brand')">BABOON</button>
        <button data-val="scout" onclick="filterProd(this,'brand')">SCOUT</button>
        <button data-val="boys-pomade" onclick="filterProd(this,'brand')">BOYS POMADE</button>
        <button data-val="outros" onclick="filterProd(this,'brand')">OUTROS</button>
      </div>`;

if (!t.includes(oldBrandFilters)) { console.error('❌ prodBrandFilters não encontrado'); process.exit(1); }
t = t.replace(oldBrandFilters, newBrandFilters);
console.log('✅ Brand filter buttons com data-val');

// ── 3. Replace filterProd function with clean version ────────────────────────
const fnStart = t.indexOf('function filterProd(');
if (fnStart === -1) { console.error('❌ filterProd não encontrado'); process.exit(1); }

// Find closing brace of function
let depth = 0, i = fnStart;
while (i < t.length) {
  if (t[i] === '{') depth++;
  else if (t[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  i++;
}
const oldFn = t.slice(fnStart, i);
console.log('Old filterProd length:', oldFn.length);

const newFn = `function filterProd(btn, axis) {
  // axis = 'cat' or 'brand'
  // Read the value from data-val attribute (no fragile regex)
  var val = btn.dataset.val;

  if (axis === 'brand') {
    // Toggle: clicking active brand deactivates it (shows all brands)
    var wasActive = btn.classList.contains('active');
    document.querySelectorAll('#prodBrandFilters button').forEach(function(b) {
      b.classList.remove('active');
    });
    if (!wasActive) {
      btn.classList.add('active');
    }
  } else {
    // Cat: always exactly one active
    document.querySelectorAll('#prodCatFilters button').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  }

  // Read current active states
  var activeCatBtn = document.querySelector('#prodCatFilters button.active');
  var activeCat = activeCatBtn ? activeCatBtn.dataset.val : 'todos';

  var activeBrandBtn = document.querySelector('#prodBrandFilters button.active');
  var activeBrand = activeBrandBtn ? activeBrandBtn.dataset.val : 'todos';

  // Show/hide cards
  document.querySelectorAll('.prod-card').forEach(function(card) {
    var catOk   = activeCat   === 'todos' || card.dataset.cat   === activeCat;
    var brandOk = activeBrand === 'todos' || card.dataset.brand === activeBrand;
    card.style.display = (catOk && brandOk) ? '' : 'none';
  });
}`;

t = t.slice(0, fnStart) + newFn + t.slice(fnStart + oldFn.length);
console.log('✅ filterProd reescrito (usa data-val, sem regex)');

// ── 4. Fix product image container CSS ──────────────────────────────────────
// Find and replace .prod-img-wrap CSS if it exists, or inject it

const oldImgWrapSearch = '.prod-img-wrap';
const imgWrapCssPos = t.indexOf(oldImgWrapSearch + ' {');
if (imgWrapCssPos !== -1) {
  // Find the closing brace
  let depth2 = 0, j = imgWrapCssPos;
  while (j < t.length) {
    if (t[j] === '{') depth2++;
    else if (t[j] === '}') { depth2--; if (depth2 === 0) { j++; break; } }
    j++;
  }
  const oldImgWrapBlock = t.slice(imgWrapCssPos, j);
  const newImgWrapBlock = `.prod-img-wrap {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(255,255,255,0.03);
    border-radius: 6px 6px 0 0;
  }`;
  t = t.slice(0, imgWrapCssPos) + newImgWrapBlock + t.slice(imgWrapCssPos + oldImgWrapBlock.length);
  console.log('✅ .prod-img-wrap CSS atualizado');
} else {
  // Inject before </style>
  const styleClose = t.lastIndexOf('</style>');
  const injectCss = `
  .prod-img-wrap {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(255,255,255,0.03);
    border-radius: 6px 6px 0 0;
  }`;
  t = t.slice(0, styleClose) + injectCss + t.slice(styleClose);
  console.log('✅ .prod-img-wrap CSS injetado');
}

// Fix the img inside prod-img-wrap: object-fit contain, full width/height
const oldProdImgSearch = '.prod-img-wrap img';
const prodImgCssPos = t.indexOf(oldProdImgSearch + ' {');
if (prodImgCssPos !== -1) {
  let depth3 = 0, k = prodImgCssPos;
  while (k < t.length) {
    if (t[k] === '{') depth3++;
    else if (t[k] === '}') { depth3--; if (depth3 === 0) { k++; break; } }
    k++;
  }
  const oldProdImgBlock = t.slice(prodImgCssPos, k);
  const newProdImgBlock = `.prod-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    padding: 12px;
    box-sizing: border-box;
  }`;
  t = t.slice(0, prodImgCssPos) + newProdImgBlock + t.slice(prodImgCssPos + oldProdImgBlock.length);
  console.log('✅ .prod-img-wrap img CSS atualizado');
} else {
  const styleClose = t.lastIndexOf('</style>');
  const injectCss = `
  .prod-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    padding: 12px;
    box-sizing: border-box;
  }`;
  t = t.slice(0, styleClose) + injectCss + t.slice(styleClose);
  console.log('✅ .prod-img-wrap img CSS injetado');
}

// ── 5. Save ──────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
