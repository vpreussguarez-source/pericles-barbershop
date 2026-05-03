const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// Fix: add !important to background:transparent and all scrolled state props
const oldNav = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 10px 52px !important; min-height: 0 !important;
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
  border-bottom: 1px solid rgba(196,146,42,0.3) !important;
}`;

const newNav = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 10px 52px !important; min-height: 0 !important;
  margin: 0 !important; outline: none !important;
  border: none !important; border-bottom: 1px solid transparent !important;
  background: transparent !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(8,8,8,0.95) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(196,146,42,0.3) !important;
}`;

if (!t.includes(oldNav)) { console.error('❌ Nav CSS não encontrado'); process.exit(1); }
t = t.replace(oldNav, newNav);
console.log('✅ background: transparent !important');
console.log('✅ backdrop-filter: none !important');
console.log('✅ nav.scrolled: background/backdrop/shadow todos com !important');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
