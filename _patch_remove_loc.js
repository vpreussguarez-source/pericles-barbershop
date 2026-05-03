const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

const oldSection = `\n\n<!-- LOCALIZAÇÃO -->
<section id="localizacao" class="loc-section">
  <div class="loc-inner">
    <div class="sec-tag" style="text-align:center;">Como nos encontrar</div>
    <h2 class="sec-h2" style="text-align:center;">Nossa <em style="color:var(--gold);font-style:normal;">Localização</em></h2>
    <div class="gold-bar" style="margin:0 auto 40px;"></div>
    <div class="loc-map-wrap">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.15!2d-52.67063!3d-26.22855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e558c2a9e9a9a9%3A0x0!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR%2C+85501-292!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" width="100%" height="400" style="border:0; border-radius:12px; display:block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="loc-map-border"></div>
    </div>
    <p class="loc-address">Rua Tocantins, 2396 — Sala 1, Centro, Pato Branco — PR</p>
  </div>
</section>`;

if (!t.includes(oldSection)) { console.error('❌ Seção localização não encontrada'); process.exit(1); }
t = t.replace(oldSection, '');
console.log('✅ Seção "Nossa Localização" removida');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
