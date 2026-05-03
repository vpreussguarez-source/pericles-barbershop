const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
let bundle = fs.readFileSync(bundlePath, 'utf8');

// Extract template
const tplMatch = bundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
let t = JSON.parse(tplMatch[1]);

// ─── 1. CSS ADDITIONS ───────────────────────────────────────────────────────
const extraCSS = `
/* ── AGENDAR BUTTON ON SERVICE CARDS ── */
.serv-agendar {
  display: inline-block; margin-top: 20px;
  border: 1px solid rgba(201,168,76,0.35); color: var(--gold);
  padding: 10px 24px; border-radius: 2px;
  font-family: var(--sf); font-size: 11px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; text-decoration: none;
  transition: background .2s, border-color .2s, color .2s;
  cursor: pointer; background: none;
}
.serv-agendar:hover { background: var(--gold); border-color: var(--gold); color: var(--black); }

/* ── LOCALIZAÇÃO ── */
.localizacao { padding: 108px 0; background: var(--dark); position: relative; }
.map-container { margin-top: 56px; border: 1px solid rgba(201,168,76,0.18); overflow: hidden; }
.map-container iframe { display: block; width: 100%; height: 420px; border: 0; filter: grayscale(0.25) brightness(0.9); }
.loc-info { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-top: 2px; }
.loc-card { background: var(--card); padding: 32px 28px; display: flex; flex-direction: column; gap: 8px; }
.loc-card-title { font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
.loc-card-text { font-family: var(--sf); font-size: 13px; color: var(--muted); line-height: 1.9; }
.loc-card-link { font-family: var(--sf); font-size: 12px; color: var(--gold); text-decoration: none; margin-top: 8px; letter-spacing: 1px; display: inline-block; transition: color .2s; }
.loc-card-link:hover { color: var(--gold2); }
@media (max-width: 700px) {
  .loc-info { grid-template-columns: 1fr; }
  .map-container iframe { height: 280px; }
  .localizacao { padding: 72px 0; }
}
`;
t = t.replace('</style>\n</head>', extraCSS + '\n</style>\n</head>');

// ─── 2. NAV LINKS ────────────────────────────────────────────────────────────
t = t.replace(
  '<li><a href="#produtos">Produtos</a></li>\n  </ul>',
  '<li><a href="#produtos">Produtos</a></li>\n    <li><a href="#agendamento">Agendamento</a></li>\n    <li><a href="#localizacao">Localização</a></li>\n  </ul>'
);
t = t.replace(
  '<a class="nav-cta" href="https://wa.me/5546999999999" target="_blank">Agendar</a>',
  '<a class="nav-cta" href="#agendamento">Agendar</a>'
);

// ─── 3. HERO BUTTON ──────────────────────────────────────────────────────────
t = t.replace(
  '<a class="btn-gold" href="https://wa.me/5546999999999" target="_blank">Agendar Horário</a>',
  '<a class="btn-gold" href="#agendamento">Agendar Horário</a>'
);

// ─── 4. SERVICE CARDS — add Agendar button ────────────────────────────────────
const allCards = [
  ['Corte de Cabelo','35','45'],
  ['Barba','25','30'],
  ['Corte + Barba','55','70'],
  ['Lavagem','15','20'],
  ['Pigmentação','45','50'],
  ['Pacote VIP','85','90'],
  ['Corte Feminino','55','60'],
  ['Escova','45','50'],
  ['Progressiva','150','120'],
  ['Hidratação Capilar','65','60'],
  ['Coloração','90','90'],
  ['Corte + Escova','85','90'],
];

allCards.forEach(([svc, price, dur]) => {
  const btn = `<a class="serv-agendar" href="#agendamento" onclick="agendarServico('${svc}','${price}','${dur}');return false;">Agendar</a>`;
  // Find the serv-dur div for this card and insert button after it, before closing </div>
  const escapedSvc = svc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<div class="serv-name">${escapedSvc}<\\/div>[\\s\\S]*?<div class="serv-dur">[^<]*<\\/div>)(<\\/div>)`);
  t = t.replace(pattern, `$1${btn}$2`);
});

// ─── 5. AGENDAMENTO SECTION ──────────────────────────────────────────────────
const agendSection = `
<!-- AGENDAMENTO -->
<section class="agendamento" id="agendamento">
  <div class="section-sep"></div>
  <div class="sec-inner">
    <div class="sec-tag">Reserve seu horário</div>
    <h2 class="sec-h2">Faça seu <em style="color:var(--gold);font-style:normal;">Agendamento</em></h2>
    <div class="gold-bar"></div>
    <div class="booking-shell">
      <div class="bk-sidebar">
        <div>
          <div class="bk-sidebar-title">Agendamento</div>
          <div class="bk-sidebar-sub">Pericles Barbershop</div>
        </div>
        <div class="step-list">
          <div class="step-row"><div class="snum active" id="sn1">1</div><div class="sinfo"><div class="stitle">Serviço</div><div class="sdesc" id="sd1">Escolha o serviço</div></div></div>
          <div class="step-row"><div class="snum" id="sn2">2</div><div class="sinfo"><div class="stitle">Data &amp; Hora</div><div class="sdesc" id="sd2">Selecione o horário</div></div></div>
          <div class="step-row"><div class="snum" id="sn3">3</div><div class="sinfo"><div class="stitle">Seus Dados</div><div class="sdesc" id="sd3">Nome e contato</div></div></div>
          <div class="step-row"><div class="snum" id="sn4">4</div><div class="sinfo"><div class="stitle">Confirmação</div><div class="sdesc" id="sd4">Revisão e envio</div></div></div>
        </div>
        <div class="bk-info"><strong>Funcionamento</strong>Segunda a Sábado<br>08h às 20h<br>Domingo: Fechado</div>
      </div>
      <div class="bk-main">
        <!-- Step 1 -->
        <div class="bk-step active" id="bkStep1">
          <div class="bk-step-title">Escolha o Serviço</div>
          <div class="bk-step-sub">Selecione um serviço para continuar</div>
          <div class="svc-grid">
            <div class="svc-opt" onclick="selSvc(this,'Corte de Cabelo','35','45')"><div class="svc-n">Corte de Cabelo</div><div class="svc-d">45 min</div><div class="svc-p">R$ 35</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Barba','25','30')"><div class="svc-n">Barba</div><div class="svc-d">30 min</div><div class="svc-p">R$ 25</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Corte + Barba','55','70')"><div class="svc-n">Corte + Barba</div><div class="svc-d">70 min</div><div class="svc-p">R$ 55</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Lavagem','15','20')"><div class="svc-n">Lavagem</div><div class="svc-d">20 min</div><div class="svc-p">R$ 15</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Pigmentação','45','50')"><div class="svc-n">Pigmentação</div><div class="svc-d">50 min</div><div class="svc-p">R$ 45</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Pacote VIP','85','90')"><div class="svc-n">Pacote VIP</div><div class="svc-d">90 min</div><div class="svc-p">R$ 85</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Corte Feminino','55','60')"><div class="svc-n">Corte Feminino</div><div class="svc-d">60 min</div><div class="svc-p">R$ 55</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Escova','45','50')"><div class="svc-n">Escova</div><div class="svc-d">50 min</div><div class="svc-p">R$ 45</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Progressiva','150','120')"><div class="svc-n">Progressiva</div><div class="svc-d">120 min</div><div class="svc-p">R$ 150</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Hidratação Capilar','65','60')"><div class="svc-n">Hidratação Capilar</div><div class="svc-d">60 min</div><div class="svc-p">R$ 65</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Coloração','90','90')"><div class="svc-n">Coloração</div><div class="svc-d">90 min</div><div class="svc-p">R$ 90</div></div>
            <div class="svc-opt" onclick="selSvc(this,'Corte + Escova','85','90')"><div class="svc-n">Corte + Escova</div><div class="svc-d">90 min</div><div class="svc-p">R$ 85</div></div>
          </div>
          <div class="bk-nav"><span></span><button class="btn-next" id="bn1" onclick="go(2)" disabled>Próximo →</button></div>
        </div>
        <!-- Step 2 -->
        <div class="bk-step" id="bkStep2">
          <div class="bk-step-title">Data &amp; Hora</div>
          <div class="bk-step-sub">Escolha o melhor dia e horário</div>
          <div class="cal-wrap">
            <div>
              <div class="cal-head">
                <button class="cal-btn" onclick="calNav(-1)">&#8249;</button>
                <div class="cal-month" id="calTitle"></div>
                <button class="cal-btn" onclick="calNav(1)">&#8250;</button>
              </div>
              <div class="cal-grid" id="calGrid"></div>
            </div>
            <div class="slots-panel">
              <div class="slots-label">Horários disponíveis</div>
              <div class="slots-g" id="slotsGrid"></div>
            </div>
          </div>
          <div class="bk-nav"><button class="btn-back" onclick="go(1)">&#8592; Voltar</button><button class="btn-next" id="bn2" onclick="go(3)" disabled>Próximo →</button></div>
        </div>
        <!-- Step 3 -->
        <div class="bk-step" id="bkStep3">
          <div class="bk-step-title">Seus Dados</div>
          <div class="bk-step-sub">Preencha para confirmar o agendamento</div>
          <div class="form-row">
            <div class="fg"><label>Nome completo</label><input type="text" id="fNome" placeholder="Seu nome" oninput="valForm()"></div>
            <div class="fg"><label>WhatsApp</label><input type="tel" id="fTel" placeholder="(46) 9 9999-9999" oninput="valForm()"></div>
          </div>
          <div class="fg"><label>Observações (opcional)</label><textarea id="fObs" placeholder="Alguma preferência ou detalhe especial?"></textarea></div>
          <div class="bk-nav"><button class="btn-back" onclick="go(2)">&#8592; Voltar</button><button class="btn-next" id="bn3" onclick="go(4)" disabled>Próximo →</button></div>
        </div>
        <!-- Step 4 -->
        <div class="bk-step" id="bkStep4">
          <div class="bk-step-title">Confirmação</div>
          <div class="bk-step-sub">Revise e confirme seu agendamento</div>
          <div class="resumo">
            <div class="rrow"><span class="rl">Serviço</span><span class="rv" id="rSvc">—</span></div>
            <div class="rrow"><span class="rl">Data</span><span class="rv" id="rDate">—</span></div>
            <div class="rrow"><span class="rl">Horário</span><span class="rv" id="rTime">—</span></div>
            <div class="rrow"><span class="rl">Nome</span><span class="rv" id="rNome">—</span></div>
            <div class="rrow"><span class="rl">WhatsApp</span><span class="rv" id="rTel">—</span></div>
            <div class="rrow total"><span class="rl">Total</span><span class="rv" id="rPrice">—</span></div>
          </div>
          <div class="bk-nav"><button class="btn-back" onclick="go(3)">&#8592; Voltar</button><button class="btn-next" id="bn4" onclick="confirmar()">Confirmar ✓</button></div>
        </div>
        <!-- Step 5 -->
        <div class="bk-step" id="bkStep5">
          <div class="confirm-wrap">
            <div class="confirm-icon">✓</div>
            <h4>Agendado!</h4>
            <p>Seu horário foi reservado. Em breve entraremos em contato para confirmação.</p>
            <a class="wa-btn" id="waConfirm" href="#" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Confirmar via WhatsApp
            </a>
            <button class="btn-back" onclick="resetBk()" style="margin-top:8px;">Novo Agendamento</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// ─── 6. LOCALIZAÇÃO SECTION ───────────────────────────────────────────────────
const locSection = `
<!-- LOCALIZAÇÃO -->
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
`;

// Insert agendamento + localização before the footer
t = t.replace('\n\n<!-- FOOTER -->', agendSection + locSection + '\n\n<!-- FOOTER -->');

// ─── 7. BOOKING JS ───────────────────────────────────────────────────────────
const bookingJS = `
const ST = {step:1,svc:null,price:null,dur:null,date:null,dateStr:null,time:null,nome:'',tel:''};
let _calY, _calM;
const MONTHS_PT=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS_PT=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const HORARIOS=['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];

function go(step){
  for(let i=1;i<=5;i++){
    const el=document.getElementById('bkStep'+i);
    if(el)el.classList.remove('active');
    const sn=document.getElementById('sn'+i);
    if(sn){sn.classList.remove('active','done');if(i<step)sn.classList.add('done');if(i===step)sn.classList.add('active');}
  }
  const el=document.getElementById('bkStep'+step);
  if(el)el.classList.add('active');
  ST.step=step;
  if(step===2){if(!_calY){const n=new Date();_calY=n.getFullYear();_calM=n.getMonth();}renderCal();}
  if(step===4)fillResumo();
}
function selSvc(el,svc,price,dur){
  document.querySelectorAll('.svc-opt').forEach(e=>e.classList.remove('sel'));
  el.classList.add('sel');
  ST.svc=svc;ST.price=price;ST.dur=dur;
  document.getElementById('bn1').disabled=false;
  document.getElementById('sd1').textContent=svc;
}
function agendarServico(svc,price,dur){
  ST.svc=svc;ST.price=price;ST.dur=dur;
  document.querySelectorAll('.svc-opt').forEach(e=>{
    const n=e.querySelector('.svc-n');
    if(n&&n.textContent===svc){e.classList.add('sel');}else{e.classList.remove('sel');}
  });
  document.getElementById('bn1').disabled=false;
  document.getElementById('sd1').textContent=svc;
  document.getElementById('agendamento').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>go(2),700);
}
function renderCal(){
  const title=document.getElementById('calTitle');
  if(!title)return;
  title.textContent=MONTHS_PT[_calM]+' '+_calY;
  const grid=document.getElementById('calGrid');
  grid.innerHTML='';
  DAYS_PT.forEach(d=>{const el=document.createElement('div');el.className='cal-dn';el.textContent=d;grid.appendChild(el);});
  const first=new Date(_calY,_calM,1).getDay();
  const days=new Date(_calY,_calM+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  for(let i=0;i<first;i++){const el=document.createElement('div');el.className='cal-d empty';grid.appendChild(el);}
  for(let d=1;d<=days;d++){
    const el=document.createElement('div');
    const date=new Date(_calY,_calM,d);
    const isSun=date.getDay()===0;
    const isPast=date<today;
    const isToday=date.getTime()===today.getTime();
    let cls='cal-d';
    if(isSun)cls+=' sun';else if(isPast)cls+=' past';
    if(isToday&&!isPast)cls+=' today';
    if(ST.date&&ST.date.getTime()===date.getTime())cls+=' sel';
    el.className=cls;el.textContent=d;
    if(!isSun&&!isPast)el.onclick=()=>selDate(date,d);
    grid.appendChild(el);
  }
}
function selDate(date,d){
  ST.date=date;
  const ms=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const ds=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  ST.dateStr=ds[date.getDay()]+', '+d+' de '+ms[date.getMonth()]+' de '+date.getFullYear();
  document.getElementById('sd2').textContent=d+' de '+ms[date.getMonth()];
  renderCal();renderSlots();checkStep2();
}
function renderSlots(){
  const grid=document.getElementById('slotsGrid');
  if(!grid)return;
  grid.innerHTML='';
  HORARIOS.forEach(h=>{
    const el=document.createElement('div');
    el.className='slot'+(ST.time===h?' sel':'');
    el.textContent=h;
    el.onclick=()=>selSlot(el,h);
    grid.appendChild(el);
  });
}
function selSlot(el,h){
  document.querySelectorAll('.slot').forEach(s=>s.classList.remove('sel'));
  el.classList.add('sel');ST.time=h;
  document.getElementById('sd2').textContent=(ST.dateStr?ST.dateStr.split(',')[1].trim()+' ':'')+'às '+h;
  checkStep2();
}
function calNav(dir){
  _calM+=dir;
  if(_calM<0){_calM=11;_calY--;}
  if(_calM>11){_calM=0;_calY++;}
  renderCal();
}
function checkStep2(){document.getElementById('bn2').disabled=!(ST.date&&ST.time);}
function valForm(){
  const n=document.getElementById('fNome').value.trim();
  const tt=document.getElementById('fTel').value.trim();
  document.getElementById('bn3').disabled=!(n.length>2&&tt.length>7);
}
function fillResumo(){
  ST.nome=document.getElementById('fNome').value.trim();
  ST.tel=document.getElementById('fTel').value.trim();
  document.getElementById('rSvc').textContent=ST.svc||'—';
  document.getElementById('rDate').textContent=ST.dateStr||'—';
  document.getElementById('rTime').textContent=ST.time||'—';
  document.getElementById('rNome').textContent=ST.nome||'—';
  document.getElementById('rTel').textContent=ST.tel||'—';
  document.getElementById('rPrice').textContent=ST.price?'R$ '+ST.price:'—';
}
async function confirmar(){
  const btn=document.getElementById('bn4');
  btn.disabled=true;btn.textContent='Enviando...';
  const payload={servico:ST.svc,preco:'R$ '+ST.price,duracao:ST.dur+' min',data:ST.dateStr,horario:ST.time,nome:ST.nome,whatsapp:ST.tel,observacoes:document.getElementById('fObs').value.trim()};
  try{await fetch('https://hook.us2.make.com/rsbcqeh3fi7soibohngtps8hwekm2ozy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),mode:'no-cors'});}catch(e){}
  const msg=encodeURIComponent('Olá! Gostaria de confirmar meu agendamento na Pericles Barbershop:\\n\\nServiço: '+ST.svc+'\\nData: '+ST.dateStr+'\\nHorário: '+ST.time+'\\nNome: '+ST.nome);
  document.getElementById('waConfirm').href='https://wa.me/5546999999999?text='+msg;
  go(5);
}
function resetBk(){
  Object.assign(ST,{step:1,svc:null,price:null,dur:null,date:null,dateStr:null,time:null,nome:'',tel:''});
  _calY=null;_calM=null;
  document.querySelectorAll('.svc-opt').forEach(e=>e.classList.remove('sel'));
  document.getElementById('bn1').disabled=true;
  document.getElementById('fNome').value='';
  document.getElementById('fTel').value='';
  document.getElementById('fObs').value='';
  go(1);
}
`;

// Replace the existing minimal resetBk function with the full booking JS
const oldJS = `function resetBk(){
  Object.assign(ST,{step:1,svc:null,price:null,dur:null,date:null,dateStr:null,time:null,nome:'',tel:''});
  document.querySelectorAll('.svc-opt').forEach(e=>e.classList.remove('sel'));
  document.getElementById('bn1').disabled=true;
  document.getElementById('fNome').value='';
  document.getElementById('fTel').value='';
  document.getElementById('fObs').value='';
  go(1);
}`;

t = t.replace(oldJS, bookingJS);

// ─── 8. SAVE BACK TO BUNDLE ──────────────────────────────────────────────────
const newTpl = JSON.stringify(t);
const newBundle = bundle.replace(tplMatch[0], '<script type="__bundler/template">' + newTpl + '</script>');
fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('Done! Template length:', t.length);
console.log('Bundle saved successfully.');
