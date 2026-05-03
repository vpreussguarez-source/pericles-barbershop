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
// 1. Atualizar variáveis de cor do sistema de agendamento
// ═══════════════════════════════════════════════════════
const oldVars = `  #agendamento-root {

    --gold: #C4922A;
    --gold-light: #D4A84A;
    --gold-dim: rgba(196,146,42,0.13);
    --gold-border: rgba(196,146,42,0.32);
    --bg: #080808;
    --surface: rgba(0,0,0,0.70);
    --surface2: rgba(20,14,8,0.88);
    --surface3: rgba(30,20,10,0.85);
    --text: #F2EDE6;
    --text-muted: #8A8078;
    --text-dim: #504840;
    --radius: 8px;
    --radius-lg: 16px;
  }`;

const newVars = `  #agendamento-root {
    --gold: #d4af37;
    --gold-light: #e0c060;
    --gold-dim: rgba(212,175,55,0.13);
    --gold-border: rgba(212,175,55,0.2);
    --bg: #0a0a0a;
    --surface: #1a1a1a;
    --surface2: #151515;
    --surface3: #111111;
    --text: #ffffff;
    --text-muted: #888888;
    --text-dim: #555555;
    --radius: 8px;
    --radius-lg: 16px;
  }`;

if (!t.includes(oldVars)) { console.error('❌ Variáveis CSS do agendamento não encontradas'); process.exit(1); }
t = t.replace(oldVars, newVars);
console.log('✅ Variáveis de cor do agendamento atualizadas');

// ═══════════════════════════════════════════════════════
// 2. Adicionar CSS dos cards de profissionais
// ═══════════════════════════════════════════════════════
const cssAnchor = `/* ── SERVIÇOS ── */`;
const profCSS = `/* ── PROFISSIONAIS ── */
.prof-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px;
  margin-top: 32px;
}
@media (max-width: 900px) { .prof-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .prof-grid { grid-template-columns: repeat(2, 1fr); } }

.prof-card {
  background: var(--card); padding: 36px 24px 32px;
  position: relative; overflow: hidden;
  cursor: pointer; transition: background .25s;
  display: flex; flex-direction: column; gap: 8px;
  text-decoration: none; color: inherit;
}
.prof-card::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 3px; height: 0; background: var(--gold); transition: height .35s ease;
}
.prof-card:hover { background: #1d1b14; }
.prof-card:hover::before { height: 100%; }

.prof-num {
  font-family: var(--hf); font-size: 56px; color: rgba(201,168,76,0.07);
  position: absolute; top: 12px; right: 16px; line-height: 1;
  transition: color .3s;
}
.prof-card:hover .prof-num { color: rgba(201,168,76,0.13); }

.prof-name {
  font-family: var(--hf); font-size: 22px; font-weight: 700;
  color: var(--cream); letter-spacing: 0.5px; margin-top: 8px;
}
.prof-role {
  font-family: var(--sf); font-size: 11px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold); opacity: 0.8;
}
.prof-agendar {
  display: inline-block; margin-top: auto; padding-top: 20px;
  font-family: var(--sf); font-size: 11px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold);
  text-decoration: none; border-bottom: 1px solid rgba(201,168,76,0.3);
  padding-bottom: 2px; width: fit-content;
  transition: color .2s, border-color .2s;
}
.prof-card:hover .prof-agendar { color: var(--gold2); border-color: var(--gold2); }

/* ── SERVIÇOS ── */`;

if (!t.includes(cssAnchor)) { console.error('❌ Âncora CSS serviços não encontrada'); process.exit(1); }
t = t.replace(cssAnchor, profCSS);
console.log('✅ CSS dos cards de profissionais adicionado');

// ═══════════════════════════════════════════════════════
// 3. Inserir seção de profissionais no HTML (antes de </section> da seção serviços)
// ═══════════════════════════════════════════════════════
const oldServEnd = `    </div>
  </div>
</section>

<!-- NOSSO ESPAÇO -->`;

const profHTML = `
    <!-- Escolha seu Profissional -->
    <div class="serv-category-label" style="margin-top:64px;">
      <span class="scl-line"></span>
      <span class="scl-text">Escolha seu Profissional</span>
      <span class="scl-line"></span>
    </div>
    <div class="prof-grid">
      <div class="prof-card" onclick="selecionarProfissional('Pericles')">
        <div class="prof-num">01</div>
        <div class="prof-name">Pericles</div>
        <div class="prof-role">Barbeiro · Fundador</div>
        <span class="prof-agendar">Agendar</span>
      </div>
      <div class="prof-card" onclick="selecionarProfissional('Betina')">
        <div class="prof-num">02</div>
        <div class="prof-name">Betina</div>
        <div class="prof-role">Barbeira</div>
        <span class="prof-agendar">Agendar</span>
      </div>
      <div class="prof-card" onclick="selecionarProfissional('Mary')">
        <div class="prof-num">03</div>
        <div class="prof-name">Mary</div>
        <div class="prof-role">Barbeira</div>
        <span class="prof-agendar">Agendar</span>
      </div>
      <div class="prof-card" onclick="selecionarProfissional('Vitória')">
        <div class="prof-num">04</div>
        <div class="prof-name">Vitória</div>
        <div class="prof-role">Barbeira</div>
        <span class="prof-agendar">Agendar</span>
      </div>
      <div class="prof-card" onclick="selecionarProfissional('Thayna')">
        <div class="prof-num">05</div>
        <div class="prof-name">Thayna</div>
        <div class="prof-role">Barbeira</div>
        <span class="prof-agendar">Agendar</span>
      </div>
    </div>
    </div>
  </div>
</section>

<!-- NOSSO ESPAÇO -->`;

if (!t.includes(oldServEnd)) { console.error('❌ Final da seção serviços não encontrado'); process.exit(1); }
t = t.replace(oldServEnd, profHTML);
console.log('✅ Seção "Escolha seu Profissional" inserida nos Serviços');

// ═══════════════════════════════════════════════════════
// 4. Adicionar função JS selecionarProfissional()
// ═══════════════════════════════════════════════════════
const jsAnchor = `<script>\nfunction filterProd(btn, cat) {`;
const profJS = `<script>
function selecionarProfissional(nome) {
  window._profissionalSelecionado = nome;
  document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
}

function filterProd(btn, cat) {`;

if (!t.includes(jsAnchor)) { console.error('❌ Âncora JS não encontrada'); process.exit(1); }
t = t.replace(jsAnchor, profJS);
console.log('✅ Função selecionarProfissional() adicionada');

// ═══════════════════════════════════════════════════════
// 5. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
