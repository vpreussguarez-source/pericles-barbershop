const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const realEndIdx = bundle.indexOf(endMarker, tplStart);
const jsonEnd = realEndIdx + ('</body></html>"').length;
const scriptCloseStart = jsonEnd;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Texto da seção Sobre ──────────────────────────────────────────────────
const oldParagraphs =
  `<p>A Pericles Barbershop nasceu com uma missão clara: oferecer muito mais do que um simples corte. Aqui, cada detalhe foi projetado para proporcionar uma experiência completa — do atendimento ao ambiente, do produto ao resultado.</p>
        <p>Nossa cadeira dourada, o espelho iluminado, os sofás de veludo verde e até o Xbox para você jogar enquanto espera. Porque o seu tempo vale ouro.</p>`;

const newParagraphs =
  `<p>Desconecte-se e aproveite um atendimento totalmente exclusivo pensado para seu conforto e privacidade. Aqui você tem tempo e espaço só para você: cortes e acabamentos personalizados, relaxamento com massageador e entretenimento com videogame para curtir enquanto é atendido.</p>
        <p>Ambiente limpo e atmosfera sofisticada para quem busca discrição e cuidado Premium.</p>`;

if (!t.includes(oldParagraphs)) { console.error('❌ Texto Sobre não encontrado'); process.exit(1); }
t = t.replace(oldParagraphs, newParagraphs);
console.log('✅ Texto Sobre atualizado');

// ── 2. Object-position da primeira foto (img-main — recepção) ────────────────
const oldImgMain = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles">`;
const newImgMain = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center top;">`;

if (!t.includes(oldImgMain)) { console.error('❌ img-main não encontrada'); process.exit(1); }
t = t.replace(oldImgMain, newImgMain);
console.log('✅ object-position img-main → center top');

// ── 3. Stats: remove "1K+ Clientes", mantém só "5+ Anos" e "100% Dedicação" ──
//    Também muda "5+" para "10+" conforme pedido
const oldStats =
  `<div class="sobre-stats">
          <div class="stat"><div class="stat-n">5+</div><div class="stat-l">Anos</div></div>
          <div class="stat"><div class="stat-n">1K+</div><div class="stat-l">Clientes</div></div>
          <div class="stat"><div class="stat-n">100%</div><div class="stat-l">Dedicação</div></div>
        </div>`;

const newStats =
  `<div class="sobre-stats sobre-stats--2col">
          <div class="stat"><div class="stat-n" data-count="10" data-suffix="+">0+</div><div class="stat-l">Anos</div></div>
          <div class="stat"><div class="stat-n" data-count="100" data-suffix="%">0%</div><div class="stat-l">Dedicação</div></div>
        </div>`;

if (!t.includes(oldStats)) { console.error('❌ Stats não encontrados'); process.exit(1); }
t = t.replace(oldStats, newStats);
console.log('✅ Stats: 3 → 2 cards, "10+ Anos" e "100% Dedicação"');

// ── 4. CSS: ajusta grid de 3 para 2 colunas nos stats ────────────────────────
const oldStatCSS = `.sobre-stats {
  display: grid; grid-template-columns: repeat(3,1fr);`;
const newStatCSS = `.sobre-stats {
  display: grid; grid-template-columns: repeat(3,1fr);`;
// Mantém o CSS original mas adiciona variante de 2 colunas
const extraCSS = `
/* stats 2 colunas */
.sobre-stats--2col { grid-template-columns: repeat(2,1fr); }
`;
t = t.replace('</style>\n</head>', extraCSS + '</style>\n</head>');
console.log('✅ CSS sobre-stats--2col adicionado');

// ── 5. JS: animação dos contadores com IntersectionObserver ──────────────────
const counterJS = `
// ── Counter animation ────────────────────────────────────────────────────────
(function() {
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(function() {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = current + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelector('.sobre-stats');
    if (stats) observer.observe(stats);
  });
})();
`;

// Inject before the closing </script> of the main script block
t = t.replace('</script>\n\n\n</body></html>', counterJS + '</script>\n\n\n</body></html>');
console.log('✅ Animação dos contadores adicionada');

// ── Re-save ──────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(scriptCloseStart);

// Verify
const m = newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle salvo!');
