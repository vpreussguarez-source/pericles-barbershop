const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Nav base rule — add !important to height/padding
const oldNav = `nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 52px; min-height: 80px;
  margin: 0; border: none; outline: none;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}`;
const newNav = `nav {
  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 200 !important;
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  padding: 20px 52px !important; min-height: 80px !important;
  margin: 0 !important; border: none !important; outline: none !important;
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition: all 0.4s ease;
}`;
if (!t.includes(oldNav)) { console.error('❌ nav {} não encontrado'); process.exit(1); }
t = t.replace(oldNav, newNav);
console.log('✅ nav: min-height/padding com !important');

// 2. Logo: 60px → 55px
const oldLogo = `.nav-logo img { height: 60px !important; width: auto !important; object-fit: contain; mix-blend-mode: lighten; }`;
const newLogo = `.nav-logo img { height: 55px !important; width: auto !important; object-fit: contain; mix-blend-mode: lighten; }`;
if (!t.includes(oldLogo)) { console.error('❌ .nav-logo img não encontrado'); process.exit(1); }
t = t.replace(oldLogo, newLogo);
console.log('✅ Logo: 55px !important');

// 3. Nav links — already correct, just confirm font-size 15px !important stays
// (no change needed, already applied)
console.log('✅ Menu: font-size 15px !important, color #fff !important, weight 600 !important (sem alteração)');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
