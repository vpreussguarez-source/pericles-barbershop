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
// 1. Reorganizar HTML: mover mapa para dentro do foot-col Localização
//    e remover o foot-map-col separado
// ═══════════════════════════════════════════════════════
const oldFooterHTML = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <a href="https://wa.me/5546999999999" style="color:var(--gold);margin-top:16px;" target="_blank">WhatsApp →</a>
      </div>
      <div class="foot-col foot-map-col">
        <div class="foot-map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.4!2d-52.6706!3d-26.2285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e55a4b9e0f6b1f%3A0x1234!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR!5e0!3m2!1spt-BR!2sbr!4v1234567890" width="200" height="150" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          <div class="foot-map-overlay"></div>
        </div>
      </div>`;

const newFooterHTML = `      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
        <a href="https://wa.me/5546999999999" style="color:var(--gold);margin-top:16px;" target="_blank">WhatsApp →</a>
        <div class="foot-map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.4!2d-52.6706!3d-26.2285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e55a4b9e0f6b1f%3A0x1234!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR!5e0!3m2!1spt-BR!2sbr!4v1234567890" width="100%" height="130" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          <div class="foot-map-overlay"></div>
        </div>
      </div>`;

if (!t.includes(oldFooterHTML)) { console.error('❌ Bloco de footer não encontrado'); process.exit(1); }
t = t.replace(oldFooterHTML, newFooterHTML);
console.log('✅ Mapa movido para dentro do bloco Localização');

// ═══════════════════════════════════════════════════════
// 2. Corrigir CSS: remover .foot-map-col da regra de nav e ajustar .foot-map-wrap
// ═══════════════════════════════════════════════════════
const oldMapCSS = `.foot-map-col {
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
}`;

const newMapCSS = `.foot-map-wrap {
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

if (!t.includes(oldMapCSS)) { console.error('❌ CSS do mapa não encontrado'); process.exit(1); }
t = t.replace(oldMapCSS, newMapCSS);
console.log('✅ CSS do mapa corrigido');

// ═══════════════════════════════════════════════════════
// 3. Também remover .foot-map-col da regra que inclui nav
// ═══════════════════════════════════════════════════════
const oldNavRule = `ion, nav, .foot-map-col {`;
const newNavRule = `ion, nav {`;
if (t.includes(oldNavRule)) {
  t = t.replace(oldNavRule, newNavRule);
  console.log('✅ .foot-map-col removido da regra de nav');
} else {
  console.log('ℹ️ Regra de nav sem .foot-map-col, nada a fazer');
}

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
