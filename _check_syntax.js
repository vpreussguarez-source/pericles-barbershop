const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

// 1. Validate template JSON
let t;
try {
  t = JSON.parse(bundle.slice(tplStart, jsonEnd));
  console.log('✅ Template JSON válido, length:', t.length);
} catch(e) {
  console.error('❌ Template JSON inválido:', e.message);
  process.exit(1);
}

// 2. Extract the babel script block
const babelOpen = '<script type="text/babel">';
const babelStart = t.indexOf(babelOpen);
const babelEnd   = t.indexOf('</script>', babelStart);
if (babelStart === -1) { console.error('❌ Babel script não encontrado'); process.exit(1); }
const babelContent = t.slice(babelStart + babelOpen.length, babelEnd);
console.log('Babel script length:', babelContent.length);

// 3. Count brace/paren/bracket balance (skip strings and comments)
let braces = 0, parens = 0, brackets = 0;
let inStr = false, strChar = '', inLineComment = false, inBlockComment = false;
let i = 0;
while (i < babelContent.length) {
  const ch = babelContent[i];
  const ch2 = babelContent[i+1];

  if (inLineComment) {
    if (ch === '\n') inLineComment = false;
    i++; continue;
  }
  if (inBlockComment) {
    if (ch === '*' && ch2 === '/') { inBlockComment = false; i += 2; continue; }
    i++; continue;
  }
  if (inStr) {
    if (ch === '\\') { i += 2; continue; }
    if (ch === strChar) inStr = false;
    i++; continue;
  }
  if (ch === '/' && ch2 === '/') { inLineComment = true; i += 2; continue; }
  if (ch === '/' && ch2 === '*') { inBlockComment = true; i += 2; continue; }
  if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; i++; continue; }

  if (ch === '{') braces++;
  else if (ch === '}') braces--;
  else if (ch === '(') parens++;
  else if (ch === ')') parens--;
  else if (ch === '[') brackets++;
  else if (ch === ']') brackets--;

  i++;
}

console.log('Brace balance:', braces, braces === 0 ? '✅' : '❌');
console.log('Paren balance:', parens, parens === 0 ? '✅' : '❌');
console.log('Bracket balance:', brackets, brackets === 0 ? '✅' : '❌');

// 4. If unbalanced, find approximate location
if (braces !== 0) {
  let b = 0;
  inStr = false; strChar = ''; inLineComment = false; inBlockComment = false;
  i = 0;
  while (i < babelContent.length) {
    const ch = babelContent[i];
    const ch2 = babelContent[i+1];
    if (inLineComment) { if (ch === '\n') inLineComment = false; i++; continue; }
    if (inBlockComment) { if (ch === '*' && ch2 === '/') { inBlockComment = false; i += 2; continue; } i++; continue; }
    if (inStr) { if (ch === '\\') { i += 2; continue; } if (ch === strChar) inStr = false; i++; continue; }
    if (ch === '/' && ch2 === '/') { inLineComment = true; i += 2; continue; }
    if (ch === '/' && ch2 === '*') { inBlockComment = true; i += 2; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; i++; continue; }
    if (ch === '{') b++;
    else if (ch === '}') { b--; if (b < 0) { console.log('Extra } at babelContent pos', i, ':', JSON.stringify(babelContent.slice(Math.max(0,i-80), i+40))); b = 0; } }
    i++;
  }
  if (b > 0) console.log('Unclosed {: final balance', b, '— last 200 chars:', JSON.stringify(babelContent.slice(-200)));
}

// 5. Check the safe-guard onclick strings specifically
const safeCount = (babelContent.match(/typeof window\.openBookingModal/g) || []).length;
console.log('\ntypeof window.openBookingModal occurrences in babel:', safeCount);

// 6. Show last 300 chars of babel block
console.log('\nLast 300 chars of babel block:');
console.log(JSON.stringify(babelContent.slice(-300)));
