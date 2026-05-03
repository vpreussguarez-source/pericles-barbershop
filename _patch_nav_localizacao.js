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
// 1. Remover botão "Agendar" e item "Agendamento" da navbar
// ═══════════════════════════════════════════════════════
const oldNav = `<nav>
  <a class="nav-logo" href="#hero"><img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;"></a>
  <ul class="nav-links">
    <li><a href="#sobre">Sobre</a></li>
    <li><a href="#servicos">Serviços</a></li>
    <li><a href="#espaco">Espaço</a></li>
    <li><a href="#produtos">Produtos</a></li>
    <li><a href="#agendamento">Agendamento</a></li>
    <li><a href="#localizacao">Localização</a></li>
  </ul>
  <a class="nav-cta" href="#agendamento">Agendar</a>
</nav>`;

const newNav = `<nav>
  <a class="nav-logo" href="#hero"><img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;"></a>
  <ul class="nav-links">
    <li><a href="#sobre">Sobre</a></li>
    <li><a href="#servicos">Serviços</a></li>
    <li><a href="#espaco">Espaço</a></li>
    <li><a href="#produtos">Produtos</a></li>
    <li><a href="#localizacao">Localização</a></li>
  </ul>
</nav>`;

if (!t.includes(oldNav)) { console.error('❌ Nav não encontrado'); process.exit(1); }
t = t.replace(oldNav, newNav);
console.log('✅ Botão Agendar e item Agendamento removidos da navbar');

// ═══════════════════════════════════════════════════════
// 2. Inserir seção #localizacao antes do <!-- FOOTER -->
// ═══════════════════════════════════════════════════════
const footerAnchor = `<!-- FOOTER -->
<footer>`;

const localizacaoHTML = `<!-- LOCALIZAÇÃO -->
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
</section>

<!-- FOOTER -->
<footer>`;

if (!t.includes(footerAnchor)) { console.error('❌ Âncora <!-- FOOTER --> não encontrada'); process.exit(1); }
t = t.replace(footerAnchor, localizacaoHTML);
console.log('✅ Seção #localizacao inserida antes do footer');

// ═══════════════════════════════════════════════════════
// 3. Adicionar CSS da seção localização (antes de /* ── FOOTER ── */)
// ═══════════════════════════════════════════════════════
const footerCSSAnchor = `/* ── FOOTER ── */`;

const locCSS = `/* ── LOCALIZAÇÃO ── */
.loc-section { background: var(--black); padding: 100px 52px 80px; }
.loc-inner { max-width: 900px; margin: 0 auto; }
.loc-inner .sec-h2 { margin-bottom: 0; }
.loc-map-wrap { position: relative; border-radius: 12px; overflow: hidden; margin-bottom: 28px; }
.loc-map-wrap iframe { opacity: 0.9; filter: brightness(0.92) saturate(0.85); }
.loc-map-border {
  position: absolute; inset: 0; border-radius: 12px;
  border: 1px solid rgba(212,175,55,0.3);
  pointer-events: none;
  box-shadow: inset 0 0 40px rgba(212,175,55,0.06);
}
.loc-address {
  text-align: center;
  font-family: var(--sf); font-size: 13px; letter-spacing: 2px;
  color: var(--muted); text-transform: uppercase;
}

/* ── FOOTER ── */`;

if (!t.includes(footerCSSAnchor)) { console.error('❌ Âncora CSS footer não encontrada'); process.exit(1); }
t = t.replace(footerCSSAnchor, locCSS);
console.log('✅ CSS da seção localização adicionado');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
