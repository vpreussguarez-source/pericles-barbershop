const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK, length:', t.length);

// ── 1. Inject CSS before </style> ────────────────────────────────────────────
const styleClose = t.lastIndexOf('</style>');
if (styleClose === -1) { console.error('❌ </style> não encontrado'); process.exit(1); }

const newCss = `
  /* ── Produto: botão PEDIR ─────────────────────────────── */
  .prod-btn {
    display: block;
    width: 100%;
    margin-top: auto;
    padding: 11px 0;
    background: var(--gold);
    color: var(--black);
    font-family: var(--sf);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    border: none;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .prod-btn:hover {
    background: #a8831e;
    transform: translateY(-1px);
  }

  /* ── Produto: baboon-cement escala compensatória ─────── */
  .prod-img-wrap img[src="baboon-cement.png"] {
    transform: scale(1.3);
  }
`;

t = t.slice(0, styleClose) + newCss + t.slice(styleClose);
console.log('✅ CSS .prod-btn e baboon-cement injetados');

// ── 2. Save ───────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
