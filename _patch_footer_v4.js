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
// 1. Substituir HTML do footer completamente
// ═══════════════════════════════════════════════════════
const oldFooterHTML = `<footer>
  <div class="foot-inner">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop">
        <p>Sofisticação, cuidado e experiência única para o homem que valoriza o estilo. Venha nos conhecer em Pato Branco.</p>
      </div>
      <div class="foot-col">
        <h5>Horários</h5>
        <address>Segunda a Sábado<br>08h às 20h<br><br>Domingo: Fechado</address>
      </div>
      <div class="foot-col foot-loc-col">
        <h5>Localização</h5>
        <div class="foot-loc-row">
          <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
          <div class="foot-map-wrap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.15!2d-52.67063!3d-26.22855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e558c2a9e9a9a9%3A0x0!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR%2C+85501-292!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" width="150" height="100" style="border:0; border-radius:6px; opacity:0.85; display:block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="foot-map-overlay"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Pericles Barbershop. Todos os direitos reservados.</span>
      <div class="soc-links">
        <a href="#" title="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg>
        </a>
      </div>
    </div>
  </div>
</footer>`;

const newFooterHTML = `<footer>
  <div class="foot-inner">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;">
        <p>Sofisticação, cuidado e experiência única para o homem que valoriza o estilo. Venha nos conhecer em Pato Branco.</p>
      </div>
      <div class="foot-col">
        <h5>Horários</h5>
        <address>Segunda a Sábado<br>08h às 20h<br><br>Domingo: Fechado</address>
      </div>
      <div class="foot-col">
        <h5>Localização</h5>
        <address>Rua Tocantins, 2396<br>Sala 1 — Centro<br>Pato Branco — PR</address>
      </div>
      <div class="foot-col foot-map-col">
        <h5>Como chegar</h5>
        <div class="foot-map-wrap">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.15!2d-52.67063!3d-26.22855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e558c2a9e9a9a9%3A0x0!2sR.+Tocantins%2C+2396+-+Centro%2C+Pato+Branco+-+PR%2C+85501-292!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" width="100%" height="130" style="border:0; border-radius:6px; opacity:0.85; display:block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div class="foot-map-overlay"></div>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Pericles Barbershop. Todos os direitos reservados.</span>
      <div class="soc-links">
        <a href="#" title="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg>
        </a>
      </div>
    </div>
  </div>
</footer>`;

if (!t.includes(oldFooterHTML)) { console.error('❌ HTML do footer não encontrado'); process.exit(1); }
t = t.replace(oldFooterHTML, newFooterHTML);
console.log('✅ HTML do footer substituído (4 colunas)');

// ═══════════════════════════════════════════════════════
// 2. Substituir CSS do footer completamente
// ═══════════════════════════════════════════════════════
const oldFooterCSS = `/* ── FOOTER ── */
footer { background: #090807; border-top: 1px solid rgba(201,168,76,0.15); padding: 72px 52px 32px; position: relative; z-index: 1; }
.foot-inner { max-width: 1220px; margin: 0 auto; }
.foot-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; padding: 48px 0 40px; }
.foot-brand img { height: 60px; width: auto; object-fit: contain; margin-bottom: 16px; display: block; }
.foot-brand p { font-family: var(--sf); font-size: 13px; color: var(--muted); line-height: 1.9; letter-spacing: 0.4px; }
.foot-col h5 { font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }
.foot-col p,.foot-col address { font-family: var(--sf); font-size: 13px; color: var(--muted); line-height: 2; font-style: normal; }
.foot-col a { color: var(--muted); text-decoration: none; display: block; transition: color .2s; }
.foot-col a:hover { color: var(--gold); }
.foot-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(201,168,76,0.08); padding-top: 24px; font-family: var(--sf); font-size: 11px; letter-spacing: 1px; color: rgba(122,112,96,0.5); }
.soc-links { display: flex; gap: 14px; }
.soc-links a { width: 36px; height: 36px; border: 1px solid rgba(201,168,76,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); text-decoration: none; transition: border-color .2s, color .2s; }
.soc-links a:hover { border-color: var(--gold); color: var(--gold); }`;

const newFooterCSS = `/* ── FOOTER ── */
footer { background: #090807; border-top: 1px solid rgba(201,168,76,0.2); padding: 0 52px 32px; position: relative; z-index: 1; }
.foot-inner { max-width: 1220px; margin: 0 auto; }
.foot-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 56px;
  align-items: start;
  padding: 60px 0 48px;
}
.foot-brand img { height: 70px; width: auto; object-fit: contain; margin-bottom: 20px; display: block; mix-blend-mode: lighten; }
.foot-brand p { font-family: var(--sf); font-size: 13px; color: var(--muted); line-height: 1.9; letter-spacing: 0.4px; max-width: 260px; }
.foot-col h5, .foot-map-col h5 { font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }
.foot-col address { font-family: var(--sf); font-size: 13px; color: var(--muted); line-height: 2; font-style: normal; }
.foot-col a { color: var(--muted); text-decoration: none; display: block; transition: color .2s; }
.foot-col a:hover { color: var(--gold); }
.foot-map-col { display: flex; flex-direction: column; }
.foot-map-wrap { position: relative; border-radius: 6px; overflow: hidden; line-height: 0; width: 100%; }
.foot-map-wrap iframe { display: block; width: 100%; height: 130px; border-radius: 6px; }
.foot-map-overlay { position: absolute; inset: 0; border-radius: 6px; border: 1px solid rgba(212,175,55,0.35); pointer-events: none; box-shadow: inset 0 0 16px rgba(212,175,55,0.08); }
.foot-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(201,168,76,0.08); padding-top: 24px; font-family: var(--sf); font-size: 11px; letter-spacing: 1px; color: rgba(122,112,96,0.5); }
.soc-links { display: flex; gap: 14px; }
.soc-links a { width: 36px; height: 36px; border: 1px solid rgba(201,168,76,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); text-decoration: none; transition: border-color .2s, color .2s; }
.soc-links a:hover { border-color: var(--gold); color: var(--gold); }`;

// Also remove leftover CSS from previous patches
const oldLocRowCSS = `\n.foot-loc-row {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-top: 8px;\n}`;
if (t.includes(oldLocRowCSS)) {
  t = t.replace(oldLocRowCSS, '');
  console.log('✅ CSS .foot-loc-row residual removido');
}

if (!t.includes(oldFooterCSS)) { console.error('❌ CSS do footer não encontrado'); process.exit(1); }
t = t.replace(oldFooterCSS, newFooterCSS);
console.log('✅ CSS do footer substituído (grid 4 colunas)');

// ═══════════════════════════════════════════════════════
// 3. Adicionar mix-blend-mode: lighten no logo da navbar
// ═══════════════════════════════════════════════════════
const oldNavLogo = `<a class="nav-logo" href="#hero"><img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop"></a>`;
const newNavLogo = `<a class="nav-logo" href="#hero"><img src="991810e6-4e0d-40f6-a49a-8a8a715bfcf0" alt="Pericles Barbershop" style="mix-blend-mode:lighten;"></a>`;
if (!t.includes(oldNavLogo)) { console.error('❌ Logo do navbar não encontrado'); process.exit(1); }
t = t.replace(oldNavLogo, newNavLogo);
console.log('✅ mix-blend-mode:lighten adicionado no logo do navbar');

// ═══════════════════════════════════════════════════════
// 4. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
