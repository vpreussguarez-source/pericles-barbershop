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
// 1. Substituir CSS do hero
// ═══════════════════════════════════════════════════════
const oldHeroCSS = `.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-image: url("b8933d8f-884d-449f-9af6-33596df1af79");
  background-size: 85%;
  background-repeat: no-repeat;
  background-position: center center;
  filter: brightness(0.42) saturate(0.8);
}
@media (max-width: 768px) {
  .hero-bg {
    background-size: cover;
    background-position: center center;
  }
}
.hero::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(13,12,10,0.2) 0%,
    rgba(13,12,10,0.05) 35%,
    rgba(13,12,10,0.55) 75%,
    var(--black) 100%
  );
}
/* gold border lines */
.hero-border {
  position: absolute; inset: 28px; border: 1px solid rgba(201,168,76,0.18);
  z-index: 2; pointer-events: none;
}
.hero-border::before, .hero-border::after {
  content: ''; position: absolute;
  background: var(--gold);
}
.hero-border::before { top: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }
.hero-border::after  { bottom: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }
/* corner accents */
.hero-corner {
  position: absolute; width: 32px; height: 32px;
  border-color: var(--gold); border-style: solid; z-index: 2; pointer-events: none;
}
.hero-corner.tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.hero-corner.tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
.hero-corner.bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.hero-corner.br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

.hero-content {
  position: relative; z-index: 3;
  text-align: center; padding: 0 24px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.hero-eyebrow {
  font-family: var(--sf); font-size: 11px; letter-spacing: 6px; text-transform: uppercase;
  color: var(--gold);
  display: flex; align-items: center; gap: 16px;
}
.hero-eyebrow::before, .hero-eyebrow::after {
  content: ''; display: block; width: 36px; height: 1px; background: var(--gold); opacity: 0.7;
}
.hero-h1 {
  font-family: var(--hf);
  font-size: clamp(60px, 11vw, 128px);
  font-weight: 700; line-height: 0.95; letter-spacing: -1px;
}
.hero-h1 span { color: var(--gold); display: block; font-size: 0.58em; letter-spacing: 10px; font-weight: 400; margin-top: 8px; }
.hero-rule {
  display: flex; align-items: center; gap: 18px;
  font-family: var(--sf); font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
  color: var(--gold); font-weight: 600;
}
.hero-rule::before, .hero-rule::after { content: ''; flex: 1; max-width: 60px; height: 1px; background: var(--gold3); }
.hero-actions {
  display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
  margin-top: 8px;
}
.btn-gold {
  background: var(--gold); color: var(--black);
  padding: 16px 40px; border-radius: 2px; border: none; cursor: pointer;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; text-decoration: none;
  transition: background .2s, transform .15s;
}
.btn-gold:hover { background: var(--gold2); transform: translateY(-2px); }
.btn-outline {
  border: 1px solid rgba(201,168,76,0.5); color: var(--gold);
  padding: 16px 40px; border-radius: 2px;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; text-decoration: none;
  transition: border-color .2s, color .2s, transform .15s;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold2); transform: translateY(-2px); }
.hero-scroll {
  position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
  z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
  color: var(--muted); animation: bobble 2.2s ease-in-out infinite;
}
.hero-scroll::after { content: ''; display: block; width: 1px; height: 44px; background: linear-gradient(to bottom, var(--gold3), transparent); }
@keyframes bobble { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(7px)} }`;

const newHeroCSS = `/* ── HERO: split screen ── */
.hero {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; flex-direction: row; align-items: stretch;
  overflow: hidden;
  background: var(--black);
}

/* ── painel esquerdo 60%: texto ── */
.hero-left {
  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: flex-start;
  padding: 0 64px 0 88px;
  position: relative; z-index: 4;
  background: var(--black);
}

/* ── fade de transição centro ── */
.hero-fade {
  position: absolute;
  top: 0; bottom: 0;
  left: calc(60% - 100px);
  width: 260px;
  background: linear-gradient(to right, var(--black) 0%, rgba(13,12,10,0.75) 45%, transparent 100%);
  z-index: 3; pointer-events: none;
}

/* ── painel direito 40%: imagem ── */
.hero-right {
  flex: 0 0 40%;
  position: relative; overflow: hidden;
}
.hero-right::before {
  content: '';
  position: absolute; top: 0; left: 0; bottom: 0;
  width: 80px;
  background: linear-gradient(to right, rgba(13,12,10,0.35), transparent);
  z-index: 1; pointer-events: none;
}
.hero-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  display: block;
  filter: brightness(0.9) saturate(0.85);
}

/* ── gradiente de base para fundir com o site ── */
.hero::after {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 200px;
  background: linear-gradient(to bottom, transparent, var(--black));
  z-index: 5; pointer-events: none;
}

/* hero-bg: oculto no desktop, visível no mobile */
.hero-bg { display: none; }

/* ── gold border & corners ── */
.hero-border {
  position: absolute; inset: 28px; border: 1px solid rgba(201,168,76,0.18);
  z-index: 6; pointer-events: none;
}
.hero-border::before, .hero-border::after {
  content: ''; position: absolute; background: var(--gold);
}
.hero-border::before { top: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }
.hero-border::after  { bottom: -1px; left: 40px; right: 40px; height: 1px; opacity: 0.5; }
.hero-corner {
  position: absolute; width: 32px; height: 32px;
  border-color: var(--gold); border-style: solid; z-index: 6; pointer-events: none;
}
.hero-corner.tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.hero-corner.tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
.hero-corner.bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.hero-corner.br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

/* ── conteúdo texto ── */
.hero-content {
  position: relative; z-index: 3; max-width: 540px;
  text-align: left;
  display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
}
.hero-eyebrow {
  font-family: var(--sf); font-size: 11px; letter-spacing: 6px; text-transform: uppercase;
  color: var(--gold);
  display: flex; align-items: center; gap: 16px;
}
.hero-eyebrow::before, .hero-eyebrow::after {
  content: ''; display: block; width: 36px; height: 1px; background: var(--gold); opacity: 0.7;
}
.hero-h1 {
  font-family: var(--hf);
  font-size: clamp(52px, 7vw, 104px);
  font-weight: 700; line-height: 0.95; letter-spacing: -1px;
}
.hero-h1 span { color: var(--gold); display: block; font-size: 0.58em; letter-spacing: 10px; font-weight: 400; margin-top: 8px; }
.hero-rule {
  display: flex; align-items: center; gap: 18px;
  font-family: var(--sf); font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
  color: var(--gold); font-weight: 600;
}
.hero-rule::before, .hero-rule::after { content: ''; flex: 1; max-width: 60px; height: 1px; background: var(--gold3); }
.hero-actions {
  display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-start;
  margin-top: 8px;
}
.btn-gold {
  background: var(--gold); color: var(--black);
  padding: 16px 40px; border-radius: 2px; border: none; cursor: pointer;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; text-decoration: none;
  transition: background .2s, transform .15s;
}
.btn-gold:hover { background: var(--gold2); transform: translateY(-2px); }
.btn-outline {
  border: 1px solid rgba(201,168,76,0.5); color: var(--gold);
  padding: 16px 40px; border-radius: 2px;
  font-family: var(--sf); font-size: 12px; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase; text-decoration: none;
  transition: border-color .2s, color .2s, transform .15s;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold2); transform: translateY(-2px); }

/* scroll indicator: centrado no painel esquerdo */
.hero-scroll {
  position: absolute; bottom: 36px; left: 30%; transform: translateX(-50%);
  z-index: 7; display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-family: var(--sf); font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
  color: var(--muted); animation: bobble 2.2s ease-in-out infinite;
}
.hero-scroll::after { content: ''; display: block; width: 1px; height: 44px; background: linear-gradient(to bottom, var(--gold3), transparent); }
@keyframes bobble { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(7px)} }

/* ── MOBILE: layout full-bg original ── */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: center; justify-content: center;
  }
  .hero-left {
    flex: unset;
    position: absolute; inset: 0;
    width: 100%; background: transparent;
    padding: 0 24px;
    align-items: center; justify-content: center;
    z-index: 4;
  }
  .hero-content {
    text-align: center; align-items: center;
    max-width: 100%;
  }
  .hero-actions { justify-content: center; }
  .hero-h1 { font-size: clamp(60px, 11vw, 128px); }
  .hero-right { display: none; }
  .hero-fade { display: none; }
  .hero-bg {
    display: block;
    position: absolute; inset: 0; z-index: 0;
    background-image: url("0d429c38-1c10-4533-9fe1-270e21a094e6");
    background-size: cover; background-position: center;
    filter: brightness(0.38) saturate(0.8);
  }
  .hero::after {
    height: 100%; z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(13,12,10,0.25) 0%,
      rgba(13,12,10,0.05) 35%,
      rgba(13,12,10,0.55) 75%,
      var(--black) 100%
    );
  }
  .hero-scroll { left: 50%; }
  .hero-border { z-index: 5; }
  .hero-corner { z-index: 5; }
}`;

if (!t.includes(oldHeroCSS)) {
  console.error('❌ CSS hero não encontrado');
  process.exit(1);
}
t = t.replace(oldHeroCSS, newHeroCSS);
console.log('✅ CSS hero atualizado (split screen)');

// ═══════════════════════════════════════════════════════
// 2. Substituir HTML do hero
// ═══════════════════════════════════════════════════════
const oldHeroHTML = `<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-bg"></div>
  <div class="hero-border"></div>
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>

  <div class="hero-content">
    <div class="hero-eyebrow">Pato Branco — PR</div>
    <h1 class="hero-h1">
      PERICLES
      <span>BARBERSHOP</span>
    </h1>
    <div class="hero-rule">Tradição · Estilo · Sofisticação</div>
    <div class="hero-actions">
      <a class="btn-gold" href="#agendamento">Agendar Horário</a>
      <a class="btn-outline" href="#sobre">Conheça o Espaço</a>
    </div>
  </div>

  <div class="hero-scroll">Scroll</div>
</section>`;

const newHeroHTML = `<!-- HERO -->
<section class="hero" id="hero">

  <!-- Mobile: imagem de fundo full-screen -->
  <div class="hero-bg"></div>

  <!-- Painel esquerdo 60%: texto -->
  <div class="hero-left">
    <div class="hero-content">
      <div class="hero-eyebrow">Pato Branco — PR</div>
      <h1 class="hero-h1">
        PERICLES
        <span>BARBERSHOP</span>
      </h1>
      <div class="hero-rule">Tradição · Estilo · Sofisticação</div>
      <div class="hero-actions">
        <a class="btn-gold" href="#agendamento">Agendar Horário</a>
        <a class="btn-outline" href="#sobre">Conheça o Espaço</a>
      </div>
    </div>
  </div>

  <!-- Fade gradiente de transição -->
  <div class="hero-fade"></div>

  <!-- Painel direito 40%: imagem em modo retrato -->
  <div class="hero-right">
    <img src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Pericles Barbershop" class="hero-img">
  </div>

  <!-- Decorações douradas -->
  <div class="hero-border"></div>
  <div class="hero-corner tl"></div>
  <div class="hero-corner tr"></div>
  <div class="hero-corner bl"></div>
  <div class="hero-corner br"></div>

  <div class="hero-scroll">Scroll</div>
</section>`;

if (!t.includes(oldHeroHTML)) {
  console.error('❌ HTML hero não encontrado');
  process.exit(1);
}
t = t.replace(oldHeroHTML, newHeroHTML);
console.log('✅ HTML hero reestruturado (split screen)');

// ═══════════════════════════════════════════════════════
// 3. Salvar
// ═══════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);

JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
