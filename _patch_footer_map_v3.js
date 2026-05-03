const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ═══════════════════════════════════════════════════════
// 1. Reorganizar HTML: endereço à esquerda, mapa à direita, sem WhatsApp
// ═══════════════════════════════════════════════════════
const oldFootLoc = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <div class="foot-loc-row">
          <a href="https://wa.me/5546999999999" style="color:var(--gold);" target="_blank">WhatsApp →</a>
          <div class="foot-map-wrap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.15!2d-52.67063!3d-26.22855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e558c2a9e9a9a9%3A0x0!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR%2C+85501-292!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" width="120" height="80" style="border:0; border-radius:6px; opacity:0.85; flex-shrink:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="foot-map-overlay"></div>
          </div>
        </div>
      </div>`;

const newFootLoc = `      <div class="foot-col foot-loc-col">
        <h5>Localização</h5>
        <div class="foot-loc-row">
          <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
          <div class="foot-map-wrap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.15!2d-52.67063!3d-26.22855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e558c2a9e9a9a9%3A0x0!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR%2C+85501-292!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" width="150" height="100" style="border:0; border-radius:6px; opacity:0.85; display:block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="foot-map-overlay"></div>
          </div>
        </div>
      </div>`;

if (!t.includes(oldFootLoc)) { console.error('❌ Bloco Localização não encontrado'); process.exit(1); }
t = t.replace(oldFootLoc, newFootLoc);
console.log('✅ HTML reorganizado: endereço + mapa lado a lado, WhatsApp removido');

// ═══════════════════════════════════════════════════════
// 2. Atualizar CSS do .foot-loc-row
// ═══════════════════════════════════════════════════════
const oldLocRowCSS = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}`;

const newLocRowCSS = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 0;
}`;

if (!t.includes(oldLocRowCSS)) { console.error('❌ CSS .foot-loc-row não encontrado'); process.exit(1); }
t = t.replace(oldLocRowCSS, newLocRowCSS);
console.log('✅ CSS .foot-loc-row atualizado');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
