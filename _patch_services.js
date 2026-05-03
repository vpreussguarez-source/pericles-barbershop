const fs = require('fs');

const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');

const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;

let t = JSON.parse(bundle.slice(tplStart, jsonEnd));
console.log('Template OK');

// ── Localizar o bloco SERVICES no babel ──────────────────────────────────────
const idxBabel   = t.indexOf('<script type="text\/babel">');
const idxBabelEnd = t.indexOf('<\/script>', idxBabel);
const babel = t.slice(idxBabel, idxBabelEnd);

const idxSvc = babel.indexOf('const SERVICES');
// Fim do bloco: próximo `const ` ou `function ` após o início
const afterSvc = babel.slice(idxSvc);
const candidates = [
  afterSvc.indexOf('\nconst ',  10),
  afterSvc.indexOf('\nfunction ', 10),
].filter(n => n > 0);
const idxSvcEnd = Math.min(...candidates);

const oldSERVICES = babel.slice(idxSvc, idxSvc + idxSvcEnd);
console.log('SERVICES block encontrado, length:', oldSERVICES.length);

// ── Novo bloco SERVICES ───────────────────────────────────────────────────────
const newSERVICES = `const SERVICES = {
  pericles: [{ category: 'Atendimento Masculino', items: [
    { id:'p1',  name:'Corte de Cabelo',             price:55,  duration:30  },
    { id:'p2',  name:'Barba com Toalha Quente',     price:55,  duration:30  },
    { id:'p3',  name:'Barba com Vapor de Ozônio',   price:60,  duration:30  },
    { id:'p4',  name:'Barba Máquina',               price:40,  duration:20  },
    { id:'p6',  name:'Tintura de Barba',            price:45,  duration:30  },
    { id:'p7',  name:'Tintura de Cabelo',           price:90,  duration:30  },
    { id:'p8',  name:'Sobrancelha na Navalha',      price:35,  duration:30  },
    { id:'p9',  name:'Depilação Orelha',            price:20,  duration:10  },
    { id:'p10', name:'Depilação Nariz',             price:20,  duration:10  },
    { id:'p11', name:'Micropigmentação de Barba',   price:800, duration:120 },
    { id:'p12', name:'Botox Capilar Curto e Médio', price:150, duration:120 },
    { id:'p5',  name:'Acabamento de Corte',         price:25,  duration:20  },
  ]}],

  betina: [
    { category: 'Estética Facial', items: [
      { id:'b1',  name:'Limpeza de Pele Profunda',          price:180, duration:90 },
      { id:'b2',  name:'Hidratação Facial',                 price:60,  duration:30 },
      { id:'b5',  name:'Dermaplaning',                      price:120, duration:60 },
      { id:'b6',  name:'Hidragloss',                        price:120, duration:60 },
      { id:'b7',  name:'Design de Sobrancelhas',            price:50,  duration:45 },
      { id:'b8',  name:'Design de Sobrancelha com Henna',   price:60,  duration:60 },
      { id:'b9',  name:'Design de Sobrancelha com Tintura', price:75,  duration:60 },
      { id:'b12', name:'Buço na Cera',                      price:20,  duration:15 },
    ]},
    { category: 'Foto Depilação', items: [
      { id:'fd1',  name:'Buço',                price:50,  duration:15 },
      { id:'fd2',  name:'Queixo',              price:50,  duration:15 },
      { id:'fd3',  name:'Buço + Queixo',       price:70,  duration:15 },
      { id:'fd4',  name:'Facial',              price:80,  duration:30 },
      { id:'fd5',  name:'Axila',              price:70,  duration:15 },
      { id:'fd6',  name:'Virilha',             price:80,  duration:30 },
      { id:'fd7',  name:'Virilha + Perianal',  price:130, duration:30 },
      { id:'fd8',  name:'Coxa',               price:110, duration:30 },
      { id:'fd9f', name:'Meia Perna Feminina', price:110, duration:45 },
      { id:'fd9m', name:'Meia Perna Masculina',price:120, duration:45 },
      { id:'fd10', name:'Perna Completa',      price:190, duration:60 },
      { id:'fd11', name:'Antebraço',           price:80,  duration:30 },
      { id:'fd12', name:'Braço Completo',      price:110, duration:30 },
      { id:'fd13', name:'Costas Completas',    price:170, duration:45 },
      { id:'fd14', name:'Abdômen',             price:90,  duration:30 },
      { id:'fd15', name:'Peitoral',            price:90,  duration:30 },
    ]},
    { category: 'Foto Rejuvenescimento', items: [
      { id:'fr1', name:'Rosto',          price:180, duration:30 },
      { id:'fr2', name:'Pescoço e Colo', price:180, duration:30 },
      { id:'fr3', name:'Mãos',           price:150, duration:30 },
      { id:'fr4', name:'Braços',         price:200, duration:30 },
    ]},
  ],

  mary: [
    { category: 'Estética Facial', items: [
      { id:'mb1',  name:'Brown Lamination',                  price:130,    duration:60  },
      { id:'mb2',  name:'Lash Lifting',                      price:130,    duration:60  },
      { id:'mb3',  name:'Dermaplaning',                      price:120,    duration:30  },
      { id:'mb4',  name:'Design de Sobrancelhas',            price:50,     duration:30  },
      { id:'mb5',  name:'Design de Sobrancelha com Henna',   price:60,     duration:45  },
      { id:'mb6',  name:'Design de Sobrancelha com Tintura', price:75,     duration:45  },
      { id:'mb7',  name:'Depilação Egípcia Facial',          price:85,     duration:30  },
      { id:'mb8',  name:'Depilação Facial na Cera',          price:70,     duration:30  },
      { id:'mb9',  name:'Depilação Nariz',                   price:20,     duration:15  },
      { id:'mb10', name:'Buço na Linha',                     price:25,     duration:15  },
      { id:'mb11', name:'Buço na Cera',                      price:20,     duration:15  },
      { id:'mb12', name:'Cone Chinês',                       price:90,     duration:30  },
    ]},
    { category: 'Micropigmentação', items: [
      { id:'m1', name:'Micropigmentação de Sobrancelha', price:650,    duration:120 },
      { id:'m2', name:'Micropigmentação de Olhos',       price:750,    duration:120 },
      { id:'m3', name:'Micropigmentação Labial',         price:750,    duration:120 },
    ]},
    { category: 'Terapias', items: [
      { id:'m4', name:'Análise Corporal', price:399.90, duration:60 },
      { id:'m5', name:'TRG',              price:150,    duration:60 },
    ]},
    { category: 'Depilação na Cera — Feminina', items: [
      { id:'mf1', name:'Axila Feminina',          price:40, duration:15 },
      { id:'mf2', name:'Meia Perna Feminina',     price:45, duration:30 },
      { id:'mf3', name:'Perna Completa Feminina', price:90, duration:45 },
      { id:'mf4', name:'Virilha + Perianal',      price:85, duration:45 },
      { id:'mf5', name:'Antebraço Feminino',      price:50, duration:30 },
      { id:'mf6', name:'Linha Alba',              price:30, duration:5  },
    ]},
  ],

  vitoria: [
    { category: 'Estética & Bem-estar', items: [
      { id:'vl1', name:'Limpeza de Pele Profunda',       price:180, duration:90  },
      { id:'v3',  name:'Massagem Relaxante',             price:100, duration:60  },
      { id:'v6',  name:'Drenagem Linfática',             price:100, duration:60  },
      { id:'v2',  name:'Massagem com Pedras Quentes',    price:140, duration:90  },
      { id:'v1',  name:'Massagem com Vela',              price:160, duration:90  },
      { id:'v4',  name:'Massagem Relaxante com Ventosa', price:140, duration:90  },
      { id:'v5',  name:'Massagem Terapêutica',           price:180, duration:120 },
      { id:'vs1', name:'Design de Sobrancelhas',         price:50,  duration:30  },
      { id:'vs2', name:'Design de Sobrancelha com Henna',price:60,  duration:45  },
      { id:'vs3', name:'Depilação Facial na Cera',       price:70,  duration:30  },
      { id:'vs4', name:'Depilação Nariz',                price:20,  duration:15  },
      { id:'vs5', name:'Buço na Cera',                   price:20,  duration:15  },
    ]},
    { category: 'Depilação na Cera', items: [
      { id:'vcf1', name:'Axila Feminina',           price:40,  duration:15 },
      { id:'vcm1', name:'Axila Masculina',          price:40,  duration:15 },
      { id:'vcf2', name:'Meia Perna Feminina',      price:45,  duration:30 },
      { id:'vcm2', name:'Meia Perna Masculina',     price:55,  duration:45 },
      { id:'vcf3', name:'Perna Completa Feminina',  price:90,  duration:45 },
      { id:'vcm3', name:'Perna Completa Masculina', price:110, duration:60 },
      { id:'vcf4', name:'Virilha + Perianal',       price:85,  duration:45 },
      { id:'vcf5', name:'Antebraço Feminino',       price:50,  duration:30 },
      { id:'vcm4', name:'Antebraço Masculino',      price:60,  duration:30 },
      { id:'vcf6', name:'Linha Alba',               price:30,  duration:5  },
      { id:'vcm5', name:'Costas Completas',         price:110, duration:30 },
      { id:'vcm6', name:'Peitoral',                 price:55,  duration:30 },
      { id:'vcm7', name:'Abdômen',                  price:55,  duration:30 },
    ]},
    { category: 'Foto Depilação', items: [
      { id:'vfd1',  name:'Buço',                price:50,  duration:15 },
      { id:'vfd2',  name:'Queixo',              price:50,  duration:15 },
      { id:'vfd3',  name:'Buço + Queixo',       price:70,  duration:15 },
      { id:'vfd4',  name:'Facial',              price:80,  duration:30 },
      { id:'vfd5',  name:'Axila',               price:70,  duration:15 },
      { id:'vfd6',  name:'Virilha',             price:80,  duration:30 },
      { id:'vfd7',  name:'Virilha + Perianal',  price:130, duration:30 },
      { id:'vfd8',  name:'Coxa',               price:110, duration:30 },
      { id:'vfd9f', name:'Meia Perna Feminina', price:110, duration:45 },
      { id:'vfd9m', name:'Meia Perna Masculina',price:120, duration:45 },
      { id:'vfd10', name:'Perna Completa',      price:190, duration:60 },
      { id:'vfd11', name:'Antebraço',           price:80,  duration:30 },
      { id:'vfd12', name:'Braço Completo',      price:110, duration:30 },
      { id:'vfd13', name:'Costas Completas',    price:170, duration:45 },
      { id:'vfd14', name:'Abdômen',             price:90,  duration:30 },
      { id:'vfd15', name:'Peitoral',            price:90,  duration:30 },
    ]},
    { category: 'Foto Rejuvenescimento', items: [
      { id:'vfr1', name:'Rosto',          price:180, duration:30 },
      { id:'vfr2', name:'Pescoço e Colo', price:180, duration:30 },
      { id:'vfr3', name:'Mãos',           price:150, duration:30 },
      { id:'vfr4', name:'Braços',         price:200, duration:30 },
    ]},
  ],

  thayna: [{ category: 'Nutrição', items: [
    { id:'t1', name:'Avaliação Nutricional', price:150, duration:60 },
  ]}],
};
`;

// ── Substituir no template ────────────────────────────────────────────────────
if (!t.includes(oldSERVICES)) { console.error('❌ Bloco SERVICES não encontrado no template'); process.exit(1); }
t = t.replace(oldSERVICES, newSERVICES);
console.log('✅ SERVICES substituído com sucesso');

// ── Salvar ────────────────────────────────────────────────────────────────────
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('✅ Bundle salvo!');
