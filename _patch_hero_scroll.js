const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Remover CSS do .hero-scroll
const oldCSS = `
.hero-scroll {
  position: absolute; bottom: 36px; left: 22.5%; transform: translateX(-50%);
  z-index: 7; display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
  color: var(--muted); animation: bobble 2.2s ease-in-out infinite;
}
.hero-scroll::after { content: ''; display: block; width: 1px; height: 44px; background: linear-gradient(to bottom, var(--gold3), transparent); }
@keyframes bobble { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(7px)} }`;

if (!t.includes(oldCSS)) { console.error('❌ CSS .hero-scroll não encontrado'); process.exit(1); }
t = t.replace(oldCSS, '');
console.log('✅ CSS do .hero-scroll removido');

// 2. Remover override mobile do .hero-scroll
const oldMobile = `\n  .hero-scroll { left: 50%; }`;
if (t.includes(oldMobile)) {
  t = t.replace(oldMobile, '');
  console.log('✅ .hero-scroll mobile override removido');
}

// 3. Remover <div class="hero-scroll"> do HTML
const oldHTML = `\n  <div class="hero-scroll">Scroll</div>`;
if (!t.includes(oldHTML)) { console.error('❌ HTML .hero-scroll não encontrado'); process.exit(1); }
t = t.replace(oldHTML, '');
console.log('✅ <div class="hero-scroll"> removido do HTML');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
