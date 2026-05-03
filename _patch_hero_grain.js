const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Adicionar ::before com grain ao .hero-left
const old1 = `/* ── fade de transição centro ── */`;
const new1 = `/* ── grain/noise no painel esquerdo ── */
.hero-left::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

/* ── fade de transição centro ── */`;

if (!t.includes(old1)) { console.error('❌ Âncora CSS não encontrada'); process.exit(1); }
t = t.replace(old1, new1);
console.log('✅ ::before grain adicionado ao .hero-left');

// 2. Garantir que .hero-content tem position: relative e z-index: 1
const old2 = `.hero-content {
  position: relative; z-index: 3; max-width: 540px;
  text-align: left;
  display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
}`;
const new2 = `.hero-content {
  position: relative; z-index: 1; max-width: 540px;
  text-align: left;
  display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
}`;

if (!t.includes(old2)) { console.error('❌ .hero-content CSS não encontrado'); process.exit(1); }
t = t.replace(old2, new2);
console.log('✅ .hero-content: z-index confirmado como 1 (acima do grain)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
