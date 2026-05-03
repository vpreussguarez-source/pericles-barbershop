const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// 1. Remover o ::before de grain
const oldGrain = `/* ── grain/noise no painel esquerdo ── */
.hero-left::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4t5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92ZmKqEhXZKLfnCCO0f3QlWFBDggU0mHOoB0BaqAqPE8LFcHFGqHgGVARR7hXEGGWREiFmMfAoIEA/I4IDhEhSuXELAM5exAi0AIm2tSjHZb4JcPAMbdLEMgABXGNsLWk7W2bHFJpkdB8CLpxnbEBGBaAdIBJBaAAAAAElFTkSuQmCC");
  background-repeat: repeat;
  background-size: 100px 100px;
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}

/* ── fade de transição centro ── */`;

const withoutGrain = `/* ── fade de transição centro ── */`;

if (!t.includes(oldGrain)) { console.error('❌ Bloco ::before não encontrado'); process.exit(1); }
t = t.replace(oldGrain, withoutGrain);
console.log('✅ Pseudo-elemento ::before de grain removido');

// 2. Adicionar background de grade no .hero-left (trocar background: var(--black))
const oldLeft = `  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: center;
  padding: 0 56px 0 10%;
  position: relative; z-index: 4;
  background: var(--black);`;

const newLeft = `  flex: 0 0 60%;
  display: flex; align-items: center; justify-content: center;
  padding: 0 56px 0 10%;
  position: relative; z-index: 4;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.03) 2px,
      rgba(255,255,255,0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.03) 2px,
      rgba(255,255,255,0.03) 4px
    ),
    #0a0a0a;`;

if (!t.includes(oldLeft)) { console.error('❌ .hero-left CSS não encontrado'); process.exit(1); }
t = t.replace(oldLeft, newLeft);
console.log('✅ background de grade fina adicionado ao .hero-left');

const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
