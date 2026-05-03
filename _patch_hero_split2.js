const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. hero-left: 60% → 45%
const oldLeft = `  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: center;
  padding: 0 56px 0 10%;
  position: relative; z-index: 4;`;

const newLeft = `  flex: 0 0 45%;
  display: flex; align-items: center; justify-content: center;
  padding: 0 40px 0 8%;
  position: relative; z-index: 4;`;

if (!t.includes(oldLeft)) { console.error('❌ .hero-left flex não encontrado'); process.exit(1); }
t = t.replace(oldLeft, newLeft);
console.log('✅ hero-left: 60% → 45%');

// 2. hero-right: 40% → 55%, adicionar margin-left: -60px
const oldRight = `.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
}
.hero-right::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 40%; height: 100%;
  background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
  z-index: 2; pointer-events: none;
}`;

const newRight = `.hero-right {
  flex: 0 0 55%;
  position: relative; overflow: hidden;
  margin-left: -60px;
}
.hero-right::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 50%; height: 100%;
  background: linear-gradient(to right, #0a0a0a 0%, transparent 100%);
  z-index: 2; pointer-events: none;
}`;

if (!t.includes(oldRight)) { console.error('❌ .hero-right CSS não encontrado'); process.exit(1); }
t = t.replace(oldRight, newRight);
console.log('✅ hero-right: 40% → 55%, margin-left: -60px, ::after width: 50%');

// 3. Ajustar scroll indicator: left: 30% → 22.5% (centro do novo painel esquerdo)
const oldScroll = `  position: absolute; bottom: 36px; left: 30%; transform: translateX(-50%);`;
const newScroll = `  position: absolute; bottom: 36px; left: 22.5%; transform: translateX(-50%);`;

if (!t.includes(oldScroll)) { console.error('❌ .hero-scroll position não encontrado'); process.exit(1); }
t = t.replace(oldScroll, newScroll);
console.log('✅ hero-scroll: left ajustado para 22.5%');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
