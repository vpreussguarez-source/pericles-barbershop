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
// 1. Remover seção LOCALIZAÇÃO inteira
// ═══════════════════════════════════════════════════════
const oldLoc = `<!-- LOCALIZAÇÃO -->
<section class="localizacao" id="localizacao">
  <div class="section-sep"></div>
  <div class="sec-inner">
    <div class="sec-tag">Como nos encontrar</div>
    <h2 class="sec-h2">Nossa <em style="color:var(--gold);font-style:normal;">Localização</em></h2>
    <div class="gold-bar"></div>
    <div class="map-container">
      <iframe src="https://www.google.com/maps?q=R.+Tocantins,+2396,+Centro,+Pato+Branco,+PR,+85501-292&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="loc-info">
      <div class="loc-card">
        <div class="loc-card-title">Endereço</div>
        <div class="loc-card-text">R. Tocantins, 2396 — Sala 1<br>Centro — Pato Branco, PR<br>CEP 85501-292</div>
        <a class="loc-card-link" href="https://maps.google.com/?q=R.+Tocantins,+2396,+Pato+Branco,+PR" target="_blank">Abrir no Google Maps →</a>
      </div>
      <div class="loc-card">
        <div class="loc-card-title">Horário de Funcionamento</div>
        <div class="loc-card-text">Segunda a Sexta<br>08h às 20h<br>Sábado: 08h às 18h<br>Domingo: Fechado</div>
      </div>
      <div class="loc-card">
        <div class="loc-card-title">Contato</div>
        <div class="loc-card-text">Agendamentos e dúvidas<br>pelo WhatsApp</div>
        <a class="loc-card-link" href="https://wa.me/5546999999999" target="_blank">Falar via WhatsApp →</a>
      </div>
    </div>
  </div>
</section>


<!-- FOOTER -->`;

const newLoc = `<!-- FOOTER -->`;

if (!t.includes(oldLoc)) { console.error('❌ Seção LOCALIZAÇÃO não encontrada'); process.exit(1); }
t = t.replace(oldLoc, newLoc);
console.log('✅ Seção LOCALIZAÇÃO removida');

// ═══════════════════════════════════════════════════════
// 2. Adicionar mapa miniatura no rodapé (ao lado de Localização)
// ═══════════════════════════════════════════════════════
const oldFootLoc = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <a href="https://wa.me/5546999999999" style="color:var(--gold);margin-top:16px;" target="_blank">WhatsApp →</a>
      </div>
    </div>`;

const newFootLoc = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <a href="https://wa.me/5546999999999" style="color:var(--gold);margin-top:16px;" target="_blank">WhatsApp →</a>
      </div>
      <div class="foot-col foot-map-col">
        <div class="foot-map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.4!2d-52.6706!3d-26.2285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e55a4b9e0f6b1f%3A0x1234!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR!5e0!3m2!1spt-BR!2sbr!4v1234567890" width="200" height="150" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          <div class="foot-map-overlay"></div>
        </div>
      </div>
    </div>`;

if (!t.includes(oldFootLoc)) { console.error('❌ Bloco Localização do rodapé não encontrado'); process.exit(1); }
t = t.replace(oldFootLoc, newFootLoc);
console.log('✅ Mapa miniatura adicionado ao rodapé');

// ═══════════════════════════════════════════════════════
// 3. Adicionar CSS para o mapa do rodapé
// ═══════════════════════════════════════════════════════
const cssAnchor = `footer {`;
const mapCSS = `.foot-map-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.foot-map-wrap {
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}
.foot-map-wrap iframe {
  width: 200px;
  height: 150px;
  display: block;
  border-radius: 8px;
  opacity: 0.85;
}
.foot-map-overlay {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 1px solid rgba(212,175,55,0.35);
  pointer-events: none;
  box-shadow: inset 0 0 20px rgba(212,175,55,0.08);
}
footer {`;

if (!t.includes(cssAnchor)) { console.error('❌ Âncora CSS footer não encontrada'); process.exit(1); }
t = t.replace(cssAnchor, mapCSS);
console.log('✅ CSS do mapa miniatura adicionado');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
