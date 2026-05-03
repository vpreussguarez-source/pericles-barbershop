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
// 1. Reorganizar HTML: WhatsApp + mapa lado a lado
// ═══════════════════════════════════════════════════════
const oldFootLoc = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <a href="https://wa.me/5546999999999" style="color:var(--gold);margin-top:16px;" target="_blank">WhatsApp →</a>
        <div class="foot-map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.4!2d-52.6706!3d-26.2285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e55a4b9e0f6b1f%3A0x1234!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR!5e0!3m2!1spt-BR!2sbr!4v1234567890" width="100%" height="130" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          <div class="foot-map-overlay"></div>
        </div>
      </div>`;

const newFootLoc = `      <div class="foot-col">
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

if (!t.includes(oldFootLoc)) { console.error('❌ Bloco Localização do rodapé não encontrado'); process.exit(1); }
t = t.replace(oldFootLoc, newFootLoc);
console.log('✅ HTML do bloco Localização reorganizado');

// ═══════════════════════════════════════════════════════
// 2. Atualizar CSS: adicionar .foot-loc-row e ajustar .foot-map-wrap
// ═══════════════════════════════════════════════════════
const oldMapCSS = `.foot-map-wrap {
  position: relative;
  width: 100%;
  margin-top: 16px;
  border-radius: 6px;
  overflow: hidden;
}
.foot-map-wrap iframe {
  width: 100%;
  height: 130px;
  display: block;
  border-radius: 6px;
  opacity: 0.85;
}
.foot-map-overlay {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  border: 1px solid rgba(212,175,55,0.35);
  pointer-events: none;
  box-shadow: inset 0 0 16px rgba(212,175,55,0.08);
}`;

const newMapCSS = `.foot-loc-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}
.foot-map-wrap {
  position: relative;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  line-height: 0;
}
.foot-map-wrap iframe {
  display: block;
  border-radius: 6px;
}
.foot-map-overlay {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  border: 1px solid rgba(212,175,55,0.35);
  pointer-events: none;
  box-shadow: inset 0 0 12px rgba(212,175,55,0.08);
}`;

if (!t.includes(oldMapCSS)) { console.error('❌ CSS do mapa não encontrado'); process.exit(1); }
t = t.replace(oldMapCSS, newMapCSS);
console.log('✅ CSS atualizado com .foot-loc-row');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
