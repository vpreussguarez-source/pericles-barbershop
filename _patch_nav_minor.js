const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldLogo = `.nav-logo img { height: 60px; width: auto; object-fit: contain; mix-blend-mode: lighten; }`;
const newLogo = `.nav-logo img { height: 55px; width: auto; object-fit: contain; mix-blend-mode: lighten; }`;
if (!t.includes(oldLogo)) { console.error('❌ .nav-logo img não encontrado'); process.exit(1); }
t = t.replace(oldLogo, newLogo);
console.log('✅ Logo: 60px → 55px');

const oldLinks = `.nav-links a {\n  color: #ffffff; text-decoration: none;\n  font-family: var(--sf); font-size: 14px; font-weight: 500;\n  letter-spacing: 0.12em; text-transform: uppercase;\n  opacity: 0.8; transition: op`;
const newLinks = `.nav-links a {\n  color: #ffffff; text-decoration: none;\n  font-family: var(--sf); font-size: 14px; font-weight: 500;\n  letter-spacing: 0.14em; text-transform: uppercase;\n  opacity: 0.8; transition: op`;
if (!t.includes(oldLinks)) { console.error('❌ .nav-links a não encontrado'); process.exit(1); }
t = t.replace(oldLinks, newLinks);
console.log('✅ Menu: letter-spacing 0.12em → 0.14em');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
