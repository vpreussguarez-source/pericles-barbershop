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

// ── 1. Corrige a animação dos contadores ─────────────────────────────────────
// Remove o bloco anterior (que usa DOMContentLoaded — pode já ter disparado)
const oldCounterJS = `
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

if (!t.includes(oldCounterJS)) {
  console.error('❌ Bloco de contador antigo não encontrado');
  process.exit(1);
}

const newCounterJS = `
// ── Counter animation ────────────────────────────────────────────────────────
(function() {
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    // ease-out: desacelera no final
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    el.textContent = '0' + suffix;
    const timer = setInterval(function() {
      frame++;
      const progress = easeOut(frame / totalFrames);
      const current = Math.min(Math.round(progress * target), target);
      el.textContent = current + suffix;
      if (frame >= totalFrames) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, 1000 / frameRate);
  }

  function initCounters() {
    const stats = document.querySelector('.sobre-stats');
    if (!stats) return;
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(stats);
  }

  // Funciona independente do estado do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();
`;

t = t.replace(oldCounterJS, newCounterJS);
console.log('✅ Animação dos contadores corrigida (easeOut + readyState guard)');

// ── 2. Ajusta object-position da primeira foto — center top → center 40% ─────
const oldImgMain = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center top;">`;
const newImgMain = `<img class="img-main" src="0d429c38-1c10-4533-9fe1-270e21a094e6" alt="Recepção Pericles" style="object-position:center 40%;">`;

if (!t.includes(oldImgMain)) { console.error('❌ img-main não encontrada'); process.exit(1); }
t = t.replace(oldImgMain, newImgMain);
console.log('✅ object-position img-main → center 40%');

// ── 3. Troca hover nas imagens Sobre: remove luz, adiciona zoom suave ─────────
// Remove o hover com filter (efeito de luz)
const oldImgHover = `.sobre-imgs img:hover { filter: brightness(1) saturate(1); }`;
const newImgHover = `.sobre-imgs img:hover { transform: scale(1.05); }`;

if (!t.includes(oldImgHover)) { console.error('❌ CSS hover das imagens não encontrado'); process.exit(1); }
t = t.replace(oldImgHover, newImgHover);
console.log('✅ Hover: brilho removido, substituído por zoom scale(1.05)');

// Adiciona transform à transição existente das imagens
const oldImgTransition = `filter: brightness(0.88) saturate(0.85);
  transition: filter .4s;`;
const newImgTransition = `filter: brightness(0.88) saturate(0.85);
  transition: filter .4s, transform .4s ease;`;

if (!t.includes(oldImgTransition)) { console.error('❌ Transição das imagens não encontrada'); process.exit(1); }
t = t.replace(oldImgTransition, newImgTransition);
console.log('✅ Transição de transform 0.4s adicionada às imagens');

// Adiciona overflow hidden ao container para clipar o zoom
const oldSobreImgs = `.sobre-imgs {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  position: relative;
}`;
const newSobreImgs = `.sobre-imgs {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  position: relative; overflow: hidden;
}`;

if (!t.includes(oldSobreImgs)) { console.error('❌ CSS .sobre-imgs não encontrado'); process.exit(1); }
t = t.replace(oldSobreImgs, newSobreImgs);
console.log('✅ overflow: hidden adicionado ao container .sobre-imgs');

// ── Re-save ──────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(scriptCloseStart);

const m = newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle salvo!');
