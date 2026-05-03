const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. hero-content: text-align left → center, align-items flex-start → center
const old1 = `.hero-content {
  position: relative; z-index: 1; max-width: 540px;
  text-align: left;
  display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
}`;
const new1 = `.hero-content {
  position: relative; z-index: 1; max-width: 540px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}`;
if (!t.includes(old1)) { console.error('❌ .hero-content não encontrado'); process.exit(1); }
t = t.replace(old1, new1);
console.log('✅ .hero-content: text-align center, align-items center');

// 2. hero-actions: justify-content flex-start → center
const old2 = `  display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-start;
  margin-top: 8px;
}`;
const new2 = `  display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
  margin-top: 8px;
}`;
if (!t.includes(old2)) { console.error('❌ .hero-actions não encontrado'); process.exit(1); }
t = t.replace(old2, new2);
console.log('✅ .hero-actions: justify-content center');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
