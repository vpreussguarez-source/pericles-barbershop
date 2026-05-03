const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Order matters: longer/more specific strings first to avoid partial matches
const replacements = [
  ['Cement Effect Hair Pomade',  'Pomada Cement Effect'],
  ['Matte Clay Hair Pomade',     'Pomada Matte Clay'],
  ['Beard Balm Absolut 120g',    'Balm para Barba Absolut 120g'],
  ['Beard Oil 30ml',             'Óleo para Barba 30ml'],
  ['Grooming 300ml',             'Grooming para Cabelo 300ml'],
  ['Matte Strong Hold',          'Pomada Matte Strong Hold'],
  ['Strong Hold',                'Pomada Strong Hold'],
  // Sérum Facial already has accent — just keep as-is per user spec
];

replacements.forEach(([oldName, newName]) => {
  const count = t.split(oldName).length - 1;
  if (count === 0) { console.warn('⚠️  Não encontrado:', oldName); return; }
  t = t.split(oldName).join(newName);
  console.log('✅', JSON.stringify(oldName), '→', JSON.stringify(newName), '('+count+'x)');
});

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
