const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── Find and fully replace the _renderCart function ───────────────────────────
// The function contains literal newlines inside JS string literals — that is
// the SyntaxError. We locate it by its signature, extract it, and swap it out.

const renderStart = t.indexOf('function _renderCart()');
if (renderStart === -1) { console.error('❌ _renderCart não encontrado'); process.exit(1); }

// Walk to the matching closing brace
let depth = 0, ri = renderStart;
while (ri < t.length) {
  if (t[ri] === '{') depth++;
  else if (t[ri] === '}') { depth--; if (depth === 0) { ri++; break; } }
  ri++;
}
const oldRenderFn = t.slice(renderStart, ri);
console.log('_renderCart found, length:', oldRenderFn.length);

// Build the replacement. IMPORTANT:
//   • Inside this Node.js string, \\n produces a literal backslash+n in the output,
//     which is the correct JS escape sequence \n for a newline inside JS strings.
//   • We must NOT have any raw newlines inside single-quoted JS string literals.
//   • The regex /\./g needs TWO characters: backslash + dot → write /\\./ in Node template.
const newRenderFn =
'function _renderCart() {\n' +
'  // Badge\n' +
'  var totalQty = _cart.reduce(function(s, i) { return s + i.qty; }, 0);\n' +
'  var badge = document.getElementById(\'cartBadge\');\n' +
'  if (badge) {\n' +
'    badge.textContent = totalQty;\n' +
'    badge.style.display = totalQty > 0 ? \'flex\' : \'none\';\n' +
'  }\n' +
'\n' +
'  // Items list\n' +
'  var itemsEl = document.getElementById(\'cartItems\');\n' +
'  if (!itemsEl) return;\n' +
'  if (_cart.length === 0) {\n' +
'    itemsEl.innerHTML = \'<p class="cart-empty">Nenhum produto adicionado ainda.</p>\';\n' +
'  } else {\n' +
'    itemsEl.innerHTML = _cart.map(function(item, idx) {\n' +
'      var qtyLabel = item.qty > 1 ? \'<em>x\' + item.qty + \'</em>\' : \'\';\n' +
'      return \'<div class="cart-item">\' +\n' +
'        \'<div class="cart-item-info">\' +\n' +
'          \'<span class="cart-item-brand">\' + item.brand + \'</span>\' +\n' +
'          \'<span class="cart-item-name">\' + item.name + qtyLabel + \'</span>\' +\n' +
'          \'<span class="cart-item-price">\' + item.price + \'</span>\' +\n' +
'        \'</div>\' +\n' +
'        \'<button class="cart-item-remove" onclick="removeFromCart(\' + idx + \')" aria-label="Remover">✕</button>\' +\n' +
'      \'</div>\';\n' +
'    }).join(\'\');\n' +
'  }\n' +
'\n' +
'  // Total\n' +
'  var total = _cart.reduce(function(s, item) {\n' +
'    var clean = item.price.replace(\'R$\', \'\').replace(/\\./g, \'\').replace(\',\', \'.\').trim();\n' +
'    var num = parseFloat(clean);\n' +
'    return s + (isNaN(num) ? 0 : num * item.qty);\n' +
'  }, 0);\n' +
'\n' +
'  var totalEl = document.getElementById(\'cartTotal\');\n' +
'  if (totalEl) {\n' +
'    totalEl.textContent = _cart.length > 0\n' +
'      ? \'Total: R$ \' + total.toFixed(2).replace(\'.\', \',\')\n' +
'      : \'\';\n' +
'  }\n' +
'\n' +
'  // WhatsApp link\n' +
'  var waBtn = document.getElementById(\'cartWaBtn\');\n' +
'  if (waBtn) {\n' +
'    if (_cart.length === 0) {\n' +
'      waBtn.href = \'#\';\n' +
'      waBtn.classList.add(\'disabled\');\n' +
'    } else {\n' +
'      var msg = \'Ol\\u00e1! Gostaria de pedir os seguintes produtos da Pericles Barbershop:\\n\\n\';\n' +
'      _cart.forEach(function(item) {\n' +
'        var qty = item.qty > 1 ? \' (x\' + item.qty + \')\' : \'\';\n' +
'        msg += \'- \' + item.brand + \' \' + item.name + qty + \' \\u2014 \' + item.price + \'\\n\';\n' +
'      });\n' +
'      msg += \'\\nTotal: R$ \' + total.toFixed(2).replace(\'.\', \',\');\n' +
'      waBtn.href = \'https://wa.me/5546988034614?text=\' + encodeURIComponent(msg);\n' +
'      waBtn.classList.remove(\'disabled\');\n' +
'    }\n' +
'  }\n' +
'}';

t = t.slice(0, renderStart) + newRenderFn + t.slice(ri);
console.log('✅ _renderCart substituído (sem newlines literais em strings JS)');

// ── Verify no raw newlines inside single-quoted JS strings ────────────────────
// Quick sanity: confirm the bad patterns are gone
const badPattern1 = "var msg = 'Ol";  // followed by a literal newline would be bad
const msgPos = t.indexOf("var msg = 'Ol");
if (msgPos !== -1) {
  const after = t.slice(msgPos, msgPos + 120);
  // Check there's no literal newline before the closing '
  const hasLiteralNewline = /var msg = '[^']*\n/.test(after);
  console.log('msg string sanity (no literal newline):', !hasLiteralNewline ? '✅' : '❌ STILL HAS LITERAL NEWLINE');
} else {
  console.log('msg string: ✅ uses unicode escape (\\u00e1)');
}

// Verify regex is correct
console.log('Regex /\\./g correct:', t.includes('replace(/\\./g') ? '✅' : '❌');

// ── Save ──────────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
