const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Adicionar #booking-modal-root ao escopo das variáveis CSS
//    (o React agora renderiza lá, mas as vars estavam só em #agendamento-root)
const oldScope = `  #agendamento-root {`;
const newScope = `  #agendamento-root, #booking-modal-root {`;
if (!t.includes(oldScope)) { console.error('❌ Escopo CSS não encontrado'); process.exit(1); }
t = t.replace(oldScope, newScope);
console.log('✅ #booking-modal-root adicionado ao escopo das variáveis CSS');

// 2. Corrigir btn-primary:hover para não ficar preto — hardcode como fallback seguro
const oldHover = `  .btn-primary:hover:not(:disabled) { background: var(--gold-light); transform: translateY(-1px); }`;
const newHover = `  .btn-primary:hover:not(:disabled) { background: #e0b95a; color: #0a0a0a; transform: translateY(-1px); }`;
if (!t.includes(oldHover)) { console.error('❌ btn-primary:hover não encontrado'); process.exit(1); }
t = t.replace(oldHover, newHover);
console.log('✅ btn-primary:hover: cor hardcoded #e0b95a (dourado claro)');

// 3. Também adicionar #booking-modal-root nos overrides de media query do booking
const oldMedia = `@media (max-width: 768px) {
  #agendamento-root .main-header { padding: 24px 24px 20px; }
  #agendamento-root .main-header::after { left: 24px; }
  #agendamento-root .main-body { padding: 24px 24px 48px; }
}
</style>

<style id="modal-css">`;
const newMedia = `@media (max-width: 768px) {
  #agendamento-root .main-header, #booking-modal-root .main-header { padding: 24px 24px 20px; }
  #agendamento-root .main-header::after, #booking-modal-root .main-header::after { left: 24px; }
  #agendamento-root .main-body, #booking-modal-root .main-body { padding: 24px 24px 48px; }
}
</style>

<style id="modal-css">`;
if (!t.includes(oldMedia)) { console.error('❌ Media query do booking não encontrada'); process.exit(1); }
t = t.replace(oldMedia, newMedia);
console.log('✅ Media queries atualizadas para #booking-modal-root');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
