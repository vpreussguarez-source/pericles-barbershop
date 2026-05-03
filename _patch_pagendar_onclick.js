const fs = require('fs');
const bundlePath = 'C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html';
const bundle = fs.readFileSync(bundlePath, 'utf8');
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
const endMarker = '</body></html>"</script>';
const jsonEnd = bundle.indexOf(endMarker, tplStart) + ('</body></html>"').length;
let t = JSON.parse(bundle.slice(tplStart, jsonEnd));

// Helper: build the safe-guard onclick string for a given attendant id (single-quoted, no var)
function safeOnclick(id) {
  return (
    'onclick="' +
    "if(typeof window.openBookingModal==='function'){" +
      "window.openBookingModal('" + id + "');" +
    "}else{" +
      "setTimeout(function(){" +
        "if(typeof window.openBookingModal==='function')" +
          "window.openBookingModal('" + id + "');" +
      "},100);" +
    '}"'
  );
}

// Each card: replace old IIFE onclick on div + add onclick to pagendar button
const cards = [
  { id: 'pericles' },
  { id: 'betina'   },
  { id: 'mary'     },
  { id: 'vitoria'  },
  { id: 'thayna'   },
];

cards.forEach(({ id }) => {
  // Old IIFE-style onclick on the div
  const oldDivOnclick =
    'onclick="(function(){var id=\'' + id + '\';' +
    "if(typeof window.openBookingModal==='function'){window.openBookingModal(id);}else{" +
    "setTimeout(function(){if(typeof window.openBookingModal==='function')window.openBookingModal(id);},100);" +
    '}})()\"';

  if (!t.includes(oldDivOnclick)) {
    console.error('❌ Div onclick não encontrado para:', id);
    console.log('Searching for partial match...');
    const partial = t.indexOf("var id='" + id + "'");
    if (partial !== -1) console.log('Partial at', partial, ':', JSON.stringify(t.slice(partial - 20, partial + 80)));
    process.exit(1);
  }

  // Replace div onclick with clean direct version
  t = t.replace(oldDivOnclick, safeOnclick(id));
  console.log('✅ div onclick updated for', id);

  // Now add onclick to the pagendar button inside this card.
  // The button is: <button class="pagendar">Agendar</button>
  // We need to find the one that belongs to THIS card.
  // Strategy: after the div onclick, find the next pagendar button and add onclick.
  const divOnclikNew = safeOnclick(id);
  const divPos = t.indexOf(divOnclikNew);

  const btnOld = '<button class="pagendar">Agendar</button>';
  const btnNew =
    '<button class="pagendar" onclick="event.stopPropagation();' +
    "if(typeof window.openBookingModal==='function'){" +
      "window.openBookingModal('" + id + "');" +
    "}else{" +
      "setTimeout(function(){" +
        "if(typeof window.openBookingModal==='function')" +
          "window.openBookingModal('" + id + "');" +
      "},100);" +
    '}"' +
    '>Agendar</button>';

  // Find the first pagendar button AFTER this card's div position
  const btnPos = t.indexOf(btnOld, divPos);
  if (btnPos === -1) {
    console.warn('⚠️  pagendar button not found after div for', id);
    return;
  }

  t = t.slice(0, btnPos) + btnNew + t.slice(btnPos + btnOld.length);
  console.log('✅ pagendar button onclick added for', id);
});

// Audit
console.log('\nAudit:');
cards.forEach(({ id }) => {
  const divHas = t.includes("window.openBookingModal('" + id + "')");
  console.log(' ', id + ':', divHas ? '✅' : '❌');
});
const oldIIFE = (t.match(/\(function\(\)\{var id=/g) || []).length;
console.log('  Old IIFE pattern remaining:', oldIIFE === 0 ? '✅ none' : '⚠️  ' + oldIIFE);

// Save
const safeJSON = JSON.stringify(t).replace(/<\/script>/gi, '<\\/script>');
const finalBundle = bundle.slice(0, tplStart) + safeJSON + bundle.slice(jsonEnd);
JSON.parse(finalBundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(bundlePath, finalBundle, 'utf8');
console.log('\n✅ Bundle salvo!');
