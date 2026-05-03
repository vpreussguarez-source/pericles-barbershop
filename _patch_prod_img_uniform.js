const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Replace .prod-img-wrap block ──────────────────────────────────────────
const wrapCssPos = t.indexOf('.prod-img-wrap {');
if (wrapCssPos === -1) { console.error('❌ .prod-img-wrap não encontrado'); process.exit(1); }

let depth = 0, i = wrapCssPos;
while (i < t.length) {
  if (t[i] === '{') depth++;
  else if (t[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  i++;
}
const oldWrap = t.slice(wrapCssPos, i);
console.log('Old .prod-img-wrap:', JSON.stringify(oldWrap));

const newWrap =
'.prod-img-wrap {\n' +
'    width: 100%;\n' +
'    height: 180px;\n' +
'    display: flex;\n' +
'    align-items: center;\n' +
'    justify-content: center;\n' +
'    background: rgba(255,255,255,0.03);\n' +
'    border-radius: 6px 6px 0 0;\n' +
'    box-sizing: border-box;\n' +
'  }';

t = t.slice(0, wrapCssPos) + newWrap + t.slice(wrapCssPos + oldWrap.length);
console.log('✅ .prod-img-wrap: 180px, sem overflow:hidden');

// ── 2. Replace .prod-img-wrap img block ──────────────────────────────────────
const imgCssPos = t.indexOf('.prod-img-wrap img {');
if (imgCssPos === -1) { console.error('❌ .prod-img-wrap img não encontrado'); process.exit(1); }

let depth2 = 0, j = imgCssPos;
while (j < t.length) {
  if (t[j] === '{') depth2++;
  else if (t[j] === '}') { depth2--; if (depth2 === 0) { j++; break; } }
  j++;
}
const oldImg = t.slice(imgCssPos, j);
console.log('Old .prod-img-wrap img:', JSON.stringify(oldImg));

const newImg =
'.prod-img-wrap img {\n' +
'    max-width: 100%;\n' +
'    max-height: 100%;\n' +
'    width: auto;\n' +
'    height: auto;\n' +
'    object-fit: contain;\n' +
'    display: block;\n' +
'  }';

t = t.slice(0, imgCssPos) + newImg + t.slice(imgCssPos + oldImg.length);
console.log('✅ .prod-img-wrap img: max-width/max-height auto, object-fit:contain');

// ── 3. Remove baboon-cement scale(1.3) override ──────────────────────────────
const cementRuleMarker = '.prod-img-wrap img[src="baboon-cement.png"] {';
const cementPos = t.indexOf(cementRuleMarker);
if (cementPos !== -1) {
  let depth3 = 0, k = cementPos;
  while (k < t.length) {
    if (t[k] === '{') depth3++;
    else if (t[k] === '}') { depth3--; if (depth3 === 0) { k++; break; } }
    k++;
  }
  // Also trim surrounding whitespace/newlines
  let removeStart = cementPos;
  let removeEnd = k;
  // eat trailing newline
  while (removeEnd < t.length && (t[removeEnd] === '\n' || t[removeEnd] === '\r')) removeEnd++;
  const removed = t.slice(removeStart, removeEnd);
  console.log('Removing cement override:', JSON.stringify(removed));
  t = t.slice(0, removeStart) + t.slice(removeEnd);
  console.log('✅ Scale(1.3) baboon-cement removido');
} else {
  console.log('ℹ️  baboon-cement override não encontrado (já removido)');
}

// ── 4. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
