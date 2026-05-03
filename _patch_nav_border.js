const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldNav = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 20px 52px !important; min-height: 80px !important;
  margin: 0 !important; border: none !important; outline: none !important;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(196,146,42,0.2);
}`;

const newNav = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 20px 52px !important; min-height: 80px !important;
  margin: 0 !important; outline: none !important;
  border: none !important; border-bottom: 1px solid transparent !important;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95);
  backdrop-filter: blur(10px);
  box-shadow: none;
  border-bottom: 1px solid rgba(196,146,42,0.4) !important;
}`;

if (!t.includes(oldNav)) { console.error('❌ CSS da nav não encontrado'); process.exit(1); }
t = t.replace(oldNav, newNav);
console.log('✅ border-bottom: transparente no topo, dourada quando scrolled');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
