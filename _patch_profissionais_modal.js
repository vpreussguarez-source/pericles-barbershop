const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ═══════════════════════════════════════════════════════════════════
// 1. ADICIONAR CSS DO MODAL (antes do </style> do booking-css)
// ═══════════════════════════════════════════════════════════════════
const oldStyleEnd = `@media (max-width: 768px) {
  #agendamento-root .main-header { padding: 24px 24px 20px; }
  #agendamento-root .main-header::after { left: 24px; }
  #agendamento-root .main-body { padding: 24px 24px 48px; }
}
</style>`;

const modalCSS = `@media (max-width: 768px) {
  #agendamento-root .main-header { padding: 24px 24px 20px; }
  #agendamento-root .main-header::after { left: 24px; }
  #agendamento-root .main-body { padding: 24px 24px 48px; }
}
</style>

<style id="modal-css">
/* ── Modal de agendamento ── */
.modal-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  align-items: center; justify-content: center;
  padding: 24px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.modal-container {
  position: relative;
  background: #0d0d0d;
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 4px;
  width: 100%; max-width: 860px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(212,175,55,0.08);
}
.modal-close {
  position: absolute; top: 16px; right: 20px; z-index: 10;
  background: none; border: 1px solid rgba(212,175,55,0.25);
  color: rgba(212,175,55,0.7); font-size: 20px; line-height: 1;
  width: 36px; height: 36px; border-radius: 2px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: border-color .2s, color .2s;
}
.modal-close:hover { border-color: var(--gold); color: var(--gold); }

/* ── Seção de Profissionais ── */
.prof-section { padding: 108px 0; background: var(--black); position: relative; }
.prof-section-inner { max-width: 1220px; margin: 0 auto; padding: 0 48px; }
.prof-cards-grid {
  display: grid; grid-template-columns: repeat(5,1fr); gap: 2px;
  margin-top: 56px;
}
@media (max-width: 1024px) { .prof-cards-grid { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 600px)  { .prof-cards-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 400px)  { .prof-cards-grid { grid-template-columns: 1fr; } }

.prof-card-new {
  background: var(--card); padding: 44px 28px 36px;
  position: relative; overflow: hidden;
  cursor: pointer; transition: background .25s;
  display: flex; flex-direction: column; border: none;
  text-align: left;
}
.prof-card-new::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 3px; height: 0; background: var(--gold); transition: height .35s ease;
}
.prof-card-new:hover { background: #1d1b14; }
.prof-card-new:hover::before { height: 100%; }
.prof-card-new .pn { font-family: var(--hf); font-size: 56px; color: rgba(201,168,76,0.07); position: absolute; top: 12px; right: 16px; line-height: 1; transition: color .3s; }
.prof-card-new:hover .pn { color: rgba(201,168,76,0.13); }
.prof-card-new .pname { font-family: var(--hf); font-size: 26px; font-weight: 700; color: var(--cream); margin-bottom: 4px; margin-top: 8px; }
.prof-card-new .prole { font-family: var(--sf); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
.prof-card-new .pdesc { font-family: var(--sf); font-size: 13px; color: rgba(244,241,234,0.45); line-height: 1.7; flex: 1; margin-bottom: 28px; }
.prof-card-new .pagendar {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--gold); color: var(--black);
  padding: 12px 24px; border-radius: 2px; border: none; cursor: pointer;
  font-family: var(--sf); font-size: 11px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; transition: background .2s, transform .15s;
  width: fit-content;
}
.prof-card-new:hover .pagendar { background: var(--gold2); transform: translateY(-1px); }
@media (max-width: 48px) { .prof-section-inner { padding: 0 24px; } }
@media (max-width: 768px) { .prof-section-inner { padding: 0 24px; } .prof-section { padding: 72px 0; } }
</style>`;

if (!t.includes(oldStyleEnd)) { console.error('❌ Fim do booking-css não encontrado'); process.exit(1); }
t = t.replace(oldStyleEnd, modalCSS);
console.log('✅ CSS do modal e profissionais adicionado');

// ═══════════════════════════════════════════════════════════════════
// 2. SUBSTITUIR SEÇÃO DE SERVIÇOS COMPLETA
// ═══════════════════════════════════════════════════════════════════
const idxServStart = t.indexOf('\n<!-- SERVIÇOS -->');
const idxEspaco    = t.indexOf('\n<!-- NOSSO ESPAÇO -->');
if (idxServStart < 0 || idxEspaco < 0) { console.error('❌ Limites da seção de serviços não encontrados'); process.exit(1); }

const newProfSection = `
<!-- PROFISSIONAIS / AGENDAMENTO -->
<section class="prof-section" id="agendamento">
  <span id="servicos" style="position:absolute;top:-80px;visibility:hidden;"></span>
  <div class="section-sep"></div>
  <div class="prof-section-inner">
    <div class="sec-tag">Nossos Profissionais</div>
    <h2 class="sec-h2">Agende seu <em style="color:var(--gold);font-style:normal;">Horário</em></h2>
    <div class="gold-bar"></div>
    <p style="font-family:var(--sf);font-size:14px;color:rgba(244,241,234,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:0;">
      Atendimento completo para homens e mulheres — escolha seu profissional
    </p>
    <div class="prof-cards-grid">
      <div class="prof-card-new" onclick="window.openBookingModal('pericles')">
        <div class="pn">01</div>
        <div class="pname">Pericles</div>
        <div class="prole">Barbeiro</div>
        <div class="pdesc">Especialista em cortes masculinos, barbearia clássica e tratamentos capilares.</div>
        <button class="pagendar">Agendar</button>
      </div>
      <div class="prof-card-new" onclick="window.openBookingModal('betina')">
        <div class="pn">02</div>
        <div class="pname">Betina</div>
        <div class="prole">Esteticista</div>
        <div class="pdesc">Estética facial e corporal, depilação e cuidados com a pele.</div>
        <button class="pagendar">Agendar</button>
      </div>
      <div class="prof-card-new" onclick="window.openBookingModal('mary')">
        <div class="pn">03</div>
        <div class="pname">Mary</div>
        <div class="prole">Micropigmentadora &amp; Terapeuta</div>
        <div class="pdesc">Micropigmentação de sobrancelhas, olhos e lábios. Terapias corporais.</div>
        <button class="pagendar">Agendar</button>
      </div>
      <div class="prof-card-new" onclick="window.openBookingModal('vitoria')">
        <div class="pn">04</div>
        <div class="pname">Vitória</div>
        <div class="prole">Massoterapeuta</div>
        <div class="pdesc">Massagens relaxantes, terapêuticas, drenagem linfática e técnicas especializadas.</div>
        <button class="pagendar">Agendar</button>
      </div>
      <div class="prof-card-new" onclick="window.openBookingModal('thayna')">
        <div class="pn">05</div>
        <div class="pname">Thayna</div>
        <div class="prole">Nutricionista</div>
        <div class="pdesc">Avaliação e acompanhamento nutricional personalizado.</div>
        <button class="pagendar">Agendar</button>
      </div>
    </div>
  </div>
</section>`;

t = t.slice(0, idxServStart) + newProfSection + t.slice(idxEspaco);
console.log('✅ Seção de serviços substituída pela seção de profissionais');

// ═══════════════════════════════════════════════════════════════════
// 3. REMOVER ANTIGA SEÇÃO AGENDAMENTO (já tem React root embutido)
// ═══════════════════════════════════════════════════════════════════
const oldAgend = `\n<!-- AGENDAMENTO -->
<section class="agendamento" id="agendamento">
  <div class="section-sep"></div>
  <div id="agendamento-root"></div>
</section>`;
if (t.includes(oldAgend)) {
  t = t.replace(oldAgend, '');
  console.log('✅ Antiga seção #agendamento removida');
} else {
  console.log('⚠️  Antiga seção #agendamento não encontrada (pode já ter sido removida)');
}

// ═══════════════════════════════════════════════════════════════════
// 4. ADICIONAR MODAL HTML + booking-modal-root antes de </body></html>
// ═══════════════════════════════════════════════════════════════════
const oldBodyEnd = `</body></html>`;
const modalHTML = `
<!-- MODAL DE AGENDAMENTO -->
<div id="booking-modal-overlay" class="modal-overlay" onclick="if(event.target===this)window.closeBookingModal()">
  <div class="modal-container">
    <button class="modal-close" onclick="window.closeBookingModal()" aria-label="Fechar">&times;</button>
    <div id="booking-modal-root"></div>
  </div>
</div>

</body></html>`;
if (!t.includes(oldBodyEnd)) { console.error('❌ </body></html> não encontrado'); process.exit(1); }
t = t.replace(oldBodyEnd, modalHTML);
console.log('✅ Modal HTML adicionado ao final do body');

// ═══════════════════════════════════════════════════════════════════
// 5. MODIFICAR APP REACT: pre-seleção do atendente
// ═══════════════════════════════════════════════════════════════════
const oldAppState = `function App() {
  const [step,       setStep]      = useState(1);
  const [booking,    setBooking]   = useState({ attendant:null, services:[], date:null, time:null, clientName:'', clientPhone:'' });`;

const newAppState = `function App() {
  const _pre = window._bookingConfig ? (ATTENDANTS.find(a => a.id === window._bookingConfig) || null) : null;
  const [step,       setStep]      = useState(_pre ? 2 : 1);
  const [booking,    setBooking]   = useState({ attendant:_pre||null, services:[], date:null, time:null, clientName:'', clientPhone:'' });`;

if (!t.includes(oldAppState)) { console.error('❌ App state initialization não encontrado'); process.exit(1); }
t = t.replace(oldAppState, newAppState);
console.log('✅ App React: suporte a pré-seleção de atendente adicionado');

// ═══════════════════════════════════════════════════════════════════
// 6. MODIFICAR RENDER DO REACT: expor openBookingModal global
// ═══════════════════════════════════════════════════════════════════
const oldRender = `ReactDOM.createRoot(document.getElementById('agendamento-root')).render(<App/>);`;
const newRender = `let _bookingRoot = null;
window.openBookingModal = function(attendantId) {
  window._bookingConfig = attendantId || null;
  if (_bookingRoot) { try { _bookingRoot.unmount(); } catch(e){} _bookingRoot = null; }
  const container = document.getElementById('booking-modal-root');
  container.innerHTML = '';
  _bookingRoot = ReactDOM.createRoot(container);
  _bookingRoot.render(<App/>);
  document.getElementById('booking-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
};
window.closeBookingModal = function() {
  document.getElementById('booking-modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
  window._bookingConfig = null;
};`;

if (!t.includes(oldRender)) { console.error('❌ ReactDOM.createRoot não encontrado'); process.exit(1); }
t = t.replace(oldRender, newRender);
console.log('✅ Render React substituído por openBookingModal/closeBookingModal globais');

// ═══════════════════════════════════════════════════════════════════
// 7. LIMPAR: remover CSS antigo de prof-grid/prof-card do patch anterior
// ═══════════════════════════════════════════════════════════════════
const oldProfCSS = `/* ── PROFISSIONAIS ── */
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

if (t.includes(oldProfCSS)) {
  t = t.replace(oldProfCSS, `/* ── SERVIÇOS ── */`);
  console.log('✅ CSS antigo prof-grid/prof-card removido');
}

// Also remove selecionarProfissional function if present
const oldSelFunc = `
function selecionarProfissional(nome) {
  window._profissionalSelecionado = nome;
  document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
}

`;
if (t.includes(oldSelFunc)) {
  t = t.replace(oldSelFunc, '\n');
  console.log('✅ Função selecionarProfissional() antiga removida');
}

// ═══════════════════════════════════════════════════════════════════
// 8. SALVAR
// ═══════════════════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

// Validate
const m = finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
const mb = (finalBundle.length/1024/1024).toFixed(1);
console.log(`✅ Bundle salvo! Tamanho: ${mb} MB`);
