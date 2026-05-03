const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

const oldLink =
'    <div style="text-align:center; margin-top:32px;">\n' +
'      <a href="#agendamento" onclick="event.preventDefault();document.getElementById(\'agendamento\').scrollIntoView({behavior:\'smooth\'});" style="color:var(--gold);font-family:var(--sf);font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;opacity:0.8;transition:opacity .2s;" onmouseover="this.style.opacity=\'1\'" onmouseout="this.style.opacity=\'0.8\'">← Ver todos os serviços</a>\n' +
'    </div>\n';

if (!t.includes(oldLink)) { console.error('❌ Link não encontrado'); process.exit(1); }
t = t.replace(oldLink, '');
console.log('✅ Link "← Ver todos os serviços" removido');

console.log('Audit — link absent:', !t.includes('← Ver todos os serviços') ? '✅' : '❌');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
