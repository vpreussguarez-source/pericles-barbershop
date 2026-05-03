const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Replace PEDIR <a> with ADICIONAR <button> ──────────────────────────────
const oldBtn = `<a class="prod-btn" href="https://wa.me/5546988034614" target="_blank" rel="noopener">PEDIR</a>`;
const newBtn = `<button class="prod-btn" onclick="addToCart(this)">ADICIONAR</button>`;

const piCount = (t.match(new RegExp(oldBtn.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g')) || []).length;
if (piCount === 0) { console.error('❌ Botão PEDIR não encontrado'); process.exit(1); }
t = t.split(oldBtn).join(newBtn);
console.log('✅ ' + piCount + ' botões PEDIR → ADICIONAR');

// ── 2. Cart CSS ───────────────────────────────────────────────────────────────
const styleClose = t.lastIndexOf('</style>');

const cartCss = `
  /* ═══════════════════════════════════════════
     CARRINHO — floating button, drawer, overlay
     ═══════════════════════════════════════════ */

  /* Floating cart button */
  #cartFloat {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 58px;
    height: 58px;
    background: var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 450;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    transition: background 0.2s, transform 0.15s;
  }
  #cartFloat:hover { background: #a8831e; transform: scale(1.06); }
  #cartFloat svg { width: 26px; height: 26px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  #cartBadge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #fff;
    color: #111;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 11px;
    font-weight: 800;
    font-family: var(--sf);
    display: none;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Overlay */
  #cartOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    z-index: 500;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  #cartOverlay.open { opacity: 1; pointer-events: all; }

  /* Drawer */
  #cartDrawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 390px;
    max-width: 95vw;
    background: #111;
    border-left: 1px solid rgba(196,146,42,0.25);
    z-index: 501;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    display: flex;
    flex-direction: column;
  }
  #cartDrawer.open { transform: translateX(0); }

  /* Drawer header */
  #cartHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 20px;
    border-bottom: 1px solid rgba(196,146,42,0.2);
    flex-shrink: 0;
  }
  #cartHeader h3 {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.05em;
    margin: 0;
  }
  #cartCloseBtn {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 22px;
    cursor: pointer;
    line-height: 1;
    padding: 4px 8px;
    transition: color 0.2s;
  }
  #cartCloseBtn:hover { color: #fff; }

  /* Items scroll area */
  #cartItems {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    scrollbar-width: thin;
    scrollbar-color: rgba(196,146,42,0.3) transparent;
  }
  #cartItems::-webkit-scrollbar { width: 4px; }
  #cartItems::-webkit-scrollbar-thumb { background: rgba(196,146,42,0.3); border-radius: 2px; }

  .cart-empty {
    font-family: var(--sf);
    font-size: 14px;
    color: var(--muted);
    text-align: center;
    margin-top: 40px;
  }

  /* Cart item row */
  .cart-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-brand {
    display: block;
    font-family: var(--sf);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .cart-item-name {
    display: block;
    font-family: var(--sf);
    font-size: 13px;
    color: #e8e8e8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cart-item-name em {
    font-style: normal;
    font-weight: 700;
    color: var(--gold);
    margin-left: 4px;
  }
  .cart-item-price {
    display: block;
    font-family: var(--sf);
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-top: 3px;
  }
  .cart-item-remove {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    font-size: 14px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .cart-item-remove:hover { background: rgba(255,0,0,0.15); border-color: rgba(255,0,0,0.4); color: #ff6b6b; }

  /* Drawer footer */
  #cartFooter {
    padding: 20px 24px 28px;
    border-top: 1px solid rgba(196,146,42,0.2);
    flex-shrink: 0;
  }
  #cartTotal {
    font-family: var(--sf);
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.04em;
    margin-bottom: 16px;
    text-align: right;
  }
  #cartWaBtn {
    display: block;
    width: 100%;
    padding: 14px 0;
    background: var(--gold);
    color: var(--black);
    font-family: var(--sf);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    border-radius: 2px;
    transition: background 0.2s, transform 0.15s;
  }
  #cartWaBtn:hover { background: #a8831e; transform: translateY(-1px); }
  #cartWaBtn.disabled { opacity: 0.45; pointer-events: none; }

  /* Prod btn "ADICIONADO" state */
  .prod-btn.added {
    background: #2a6e3f;
    color: #fff;
    pointer-events: none;
  }
`;

t = t.slice(0, styleClose) + cartCss + t.slice(styleClose);
console.log('✅ CSS do carrinho injetado');

// ── 3. Cart HTML — inject before </body> ─────────────────────────────────────
const bodyClose = t.lastIndexOf('</body>');

const cartHtml = `
  <!-- ═══ CART OVERLAY ═══ -->
  <div id="cartOverlay" onclick="closeCart()"></div>

  <!-- ═══ CART DRAWER ═══ -->
  <div id="cartDrawer" role="dialog" aria-label="Meu Pedido">
    <div id="cartHeader">
      <h3>Meu Pedido</h3>
      <button id="cartCloseBtn" onclick="closeCart()" aria-label="Fechar carrinho">✕</button>
    </div>
    <div id="cartItems">
      <p class="cart-empty">Nenhum produto adicionado ainda.</p>
    </div>
    <div id="cartFooter">
      <div id="cartTotal"></div>
      <a id="cartWaBtn" class="disabled" href="#" target="_blank" rel="noopener">ENVIAR PEDIDO VIA WHATSAPP</a>
    </div>
  </div>

  <!-- ═══ FLOATING CART BUTTON ═══ -->
  <div id="cartFloat" onclick="openCart()" role="button" aria-label="Abrir carrinho" tabindex="0">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    <span id="cartBadge">0</span>
  </div>

`;

t = t.slice(0, bodyClose) + cartHtml + t.slice(bodyClose);
console.log('✅ HTML do carrinho injetado antes de </body>');

// ── 4. Cart JS — inject in the main script block (before filterProd) ──────────
const filterFnPos = t.indexOf('function filterProd(');
if (filterFnPos === -1) { console.error('❌ filterProd não encontrado'); process.exit(1); }

const cartJs = `
// ── Cart ─────────────────────────────────────────────────────────────────────
var _cart = [];

function addToCart(btn) {
  var card  = btn.closest('.prod-card');
  var name  = card.querySelector('.prod-name').textContent.trim();
  var brand = card.querySelector('.prod-brand').textContent.trim();
  var price = card.querySelector('.prod-price').textContent.trim();

  var existing = null;
  for (var ci = 0; ci < _cart.length; ci++) {
    if (_cart[ci].name === name && _cart[ci].brand === brand) { existing = _cart[ci]; break; }
  }
  if (existing) {
    existing.qty++;
  } else {
    _cart.push({ name: name, brand: brand, price: price, qty: 1 });
  }

  _renderCart();

  // Button feedback
  btn.textContent = 'ADICIONADO ✓';
  btn.classList.add('added');
  setTimeout(function() {
    btn.textContent = 'ADICIONAR';
    btn.classList.remove('added');
  }, 2000);
}

function removeFromCart(idx) {
  _cart.splice(idx, 1);
  _renderCart();
}

function _renderCart() {
  // Badge
  var totalQty = _cart.reduce(function(s, i) { return s + i.qty; }, 0);
  var badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  // Items list
  var itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;
  if (_cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Nenhum produto adicionado ainda.</p>';
  } else {
    itemsEl.innerHTML = _cart.map(function(item, idx) {
      var qtyLabel = item.qty > 1
        ? '<em>x' + item.qty + '</em>'
        : '';
      return '<div class="cart-item">' +
        '<div class="cart-item-info">' +
          '<span class="cart-item-brand">' + item.brand + '</span>' +
          '<span class="cart-item-name">' + item.name + qtyLabel + '</span>' +
          '<span class="cart-item-price">' + item.price + '</span>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeFromCart(' + idx + ')" aria-label="Remover">✕</button>' +
      '</div>';
    }).join('');
  }

  // Total
  var total = _cart.reduce(function(s, item) {
    var clean = item.price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    var num = parseFloat(clean);
    return s + (isNaN(num) ? 0 : num * item.qty);
  }, 0);

  var totalEl = document.getElementById('cartTotal');
  if (totalEl) {
    totalEl.textContent = _cart.length > 0
      ? 'Total: R$ ' + total.toFixed(2).replace('.', ',')
      : '';
  }

  // WhatsApp link
  var waBtn = document.getElementById('cartWaBtn');
  if (waBtn) {
    if (_cart.length === 0) {
      waBtn.href = '#';
      waBtn.classList.add('disabled');
    } else {
      var msg = 'Olá! Gostaria de pedir os seguintes produtos da Pericles Barbershop:\n\n';
      _cart.forEach(function(item) {
        var qty = item.qty > 1 ? ' (x' + item.qty + ')' : '';
        msg += '- ' + item.brand + ' ' + item.name + qty + ' — ' + item.price + '\n';
      });
      msg += '\nTotal: R$ ' + total.toFixed(2).replace('.', ',');
      waBtn.href = 'https://wa.me/5546988034614?text=' + encodeURIComponent(msg);
      waBtn.classList.remove('disabled');
    }
  }
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

`;

t = t.slice(0, filterFnPos) + cartJs + t.slice(filterFnPos);
console.log('✅ JS do carrinho injetado');

// ── 5. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo! Tamanho:', finalBundle.length);
