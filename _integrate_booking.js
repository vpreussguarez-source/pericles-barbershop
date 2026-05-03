const fs = require('fs');

// ── Read files ────────────────────────────────────────────────────────────────
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const indexPath  = 'C:/Users/vpreu/Desktop/Natan/index.html';

const bundle = fs.readFileSync(bundlePath, 'utf8');
const index  = fs.readFileSync(indexPath,  'utf8');

// ── Extract template ──────────────────────────────────────────────────────────
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const realEndIdx = bundle.indexOf(endMarker, tplStart);
const jsonEnd = realEndIdx + ('</body></html>"').length;
const scriptCloseStart = jsonEnd;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ═══════════════════════════════════════════════════════════════════
// 1. EXTRAIR PARTES DO index.html
// ═══════════════════════════════════════════════════════════════════

// 1a. CSS do index.html (entre <style> e </style>)
const indexCSS = index.match(/<style>([\s\S]*?)<\/style>/)[1];

// 1b. CONFIG script (entre <!-- ═══ CONFIGURAÇÃO ═══ --> e </script>)
const configScript = index.match(/<script>\s*const CONFIG[\s\S]*?<\/script>/)[0];

// 1c. Script type="text/babel" completo
const babelScript = index.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)[1];

// ═══════════════════════════════════════════════════════════════════
// 2. LIMPAR CSS DO index.html — remover regras que conflitam com o site
// ═══════════════════════════════════════════════════════════════════

let cleanCSS = indexCSS
  // Remove html, body { height: 100%; }
  .replace(/\s*html,\s*body\s*\{[^}]*\}/g, '')
  // Remove bloco body { ... } (pode ter várias linhas)
  .replace(/\s*body\s*\{[^}]*font-family[^}]*\}/gs, '')
  // Remove body::before e body::after
  .replace(/\s*body::before\s*\{[\s\S]*?\}/g, '')
  .replace(/\s*body::after\s*\{[\s\S]*?\}/g, '')
  // Remove #root { ... }
  .replace(/\s*#root\s*\{[^}]*\}/g, '')
  // Substitui :root { ... } por escopo dentro de #agendamento-root para não sobrescrever o site
  .replace(/:root\s*\{([\s\S]*?)\}/, '#agendamento-root {\n$1}')
  // .main: remove min-height: 100vh, ajusta display
  .replace(/\.main\s*\{([^}]*)min-height:\s*100vh;?\s*/g, '.main {')
  // Remove @media (max-width: 768px) .confirm-screen { min-height: auto } pois já tá sem vh
  .trim();

// Adiciona regras extras de scoping
cleanCSS += `
/* ── Scoping do sistema de agendamento embutido ── */
#agendamento-root { width: 100%; }
#agendamento-root .main { flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
#agendamento-root .main-header { max-width: 960px; width: 100%; padding: 48px 56px 32px; border-bottom: 1px solid rgba(196,146,42,0.1); position: relative; }
#agendamento-root .main-header::after { content: ''; position: absolute; bottom: -1px; left: 56px; width: 48px; height: 2px; background: var(--gold); border-radius: 1px; }
#agendamento-root .main-body { padding: 40px 56px 64px; flex: 1; max-width: 960px; width: 100%; box-sizing: border-box; }
@media (max-width: 768px) {
  #agendamento-root .main-header { padding: 24px 24px 20px; }
  #agendamento-root .main-header::after { left: 24px; }
  #agendamento-root .main-body { padding: 24px 24px 48px; }
}
`;

// ═══════════════════════════════════════════════════════════════════
// 3. MODIFICAR O SCRIPT BABEL — trocar root → agendamento-root
// ═══════════════════════════════════════════════════════════════════

let newBabelScript = babelScript
  .replace(
    "ReactDOM.createRoot(document.getElementById('root')).render(<App/>);",
    "ReactDOM.createRoot(document.getElementById('agendamento-root')).render(<App/>);"
  )
  // Remove o wrapper de min-height 100vh no App
  .replace(
    "<div style={{display:'flex',minHeight:'100vh'}}>",
    "<div style={{display:'flex'}}>"
  );

// ═══════════════════════════════════════════════════════════════════
// 4. MONTAR BLOCOS PARA INJEÇÃO NO TEMPLATE
// ═══════════════════════════════════════════════════════════════════

// Scripts CDN para o <head>
const cdnScripts = `
<!-- React + Babel + Supabase para o sistema de agendamento -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
`;

// CSS embutido
const bookingCSS = `\n<style id="booking-css">\n${cleanCSS}\n</style>\n`;

// Nova seção agendamento (sem o wizard manual — apenas o root do React)
const newAgendSection = `
<!-- AGENDAMENTO -->
<section class="agendamento" id="agendamento">
  <div class="section-sep"></div>
  <div id="agendamento-root"></div>
</section>
`;

// CONFIG + Supabase init
const configBlock = `\n${configScript}\n`;

// Script Babel final
const babelBlock = `\n<script type="text/babel">\n${newBabelScript}\n</script>\n`;

// ═══════════════════════════════════════════════════════════════════
// 5. APLICAR MODIFICAÇÕES NO TEMPLATE
// ═══════════════════════════════════════════════════════════════════

// 5a. Adicionar CDN scripts e CSS do booking no <head>
if (!t.includes('react.development.js')) {
  t = t.replace('</head>', cdnScripts + bookingCSS + '</head>');
  console.log('✅ CDN scripts + CSS adicionados ao <head>');
} else {
  console.log('ℹ️  CDN scripts já presentes');
}

// 5b. Remover a seção de agendamento antiga (vanilla JS)
const oldAgendStart = '\n<!-- AGENDAMENTO -->\n<section class="agendamento" id="agendamento">';
const oldAgendEnd   = '</section>\n';

const agendIdx = t.indexOf(oldAgendStart);
if (agendIdx >= 0) {
  // Encontra o </section> correspondente
  let depth = 0, i = agendIdx;
  while (i < t.length) {
    if (t.slice(i, i+8) === '<section') depth++;
    if (t.slice(i, i+10) === '</section>') {
      depth--;
      if (depth === 0) { i += 10; break; }
    }
    i++;
  }
  t = t.slice(0, agendIdx) + t.slice(i);
  console.log('✅ Seção agendamento antiga removida');
} else {
  console.log('⚠️  Seção agendamento antiga não encontrada (pode já ter sido removida)');
}

// 5c. Remover funções JS antigas do booking (ST, go(), selSvc(), etc.)
// Elas ficam num bloco <script> no final do body
const oldBookingJSStart = '\nconst ST = {step:1,';
const oldBookingJSEnd   = '\nfunction resetBk(){';
const jsIdx = t.indexOf(oldBookingJSStart);
if (jsIdx >= 0) {
  // Achar o fim do resetBk
  const resetEnd = t.indexOf('\n}', t.indexOf(oldBookingJSEnd)) + 2;
  t = t.slice(0, jsIdx) + t.slice(resetEnd);
  console.log('✅ Funções JS antigas do booking removidas');
} else {
  console.log('ℹ️  Funções JS antigas não encontradas');
}

// 5d. Inserir nova seção agendamento antes da seção localização
const locSection = '\n<!-- LOCALIZAÇÃO -->';
if (t.includes(locSection)) {
  t = t.replace(locSection, newAgendSection + locSection);
  console.log('✅ Nova seção agendamento inserida antes da localização');
} else {
  // fallback: inserir antes do footer
  t = t.replace('\n\n<!-- FOOTER -->', newAgendSection + '\n\n<!-- FOOTER -->');
  console.log('✅ Nova seção agendamento inserida antes do footer');
}

// 5e. Adicionar CONFIG + script Babel antes do </body>
t = t.replace('</body></html>', configBlock + babelBlock + '</body></html>');
console.log('✅ CONFIG e script React/Babel adicionados');

// ═══════════════════════════════════════════════════════════════════
// 6. SALVAR
// ═══════════════════════════════════════════════════════════════════
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const newBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(scriptCloseStart);

// Verificar
const m = newBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
JSON.parse(m[1]);
console.log('✅ JSON válido');

fs.writeFileSync(bundlePath, newBundle, 'utf8');
console.log('✅ Bundle salvo! Tamanho:', newBundle.length, 'bytes');
console.log('\nTemplate length:', t.length);
