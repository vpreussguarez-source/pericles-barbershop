const fs = require('fs');
const bundle = fs.readFileSync('C:/Users/vpreu/Desktop/Natan/Pericles Barbershop.html', 'utf8');

// The template script tag starts here
const TAG = '<script type="__bundler/template">';
const tplStart = bundle.indexOf(TAG) + TAG.length;
console.log('Template content starts at:', tplStart);

// The JSON string ends with '"' right before </script>
// Find the REAL closing: </body></html>\"</script>
// In the bundle this looks like: ...</body></html>"</script>
const endMarker = '</body></html>"</script>';
const realEndIdx = bundle.indexOf(endMarker, tplStart);
console.log('Real end marker at:', realEndIdx);

if (realEndIdx < 0) {
  // Try alternative: look for the pattern where JSON string closing quote is before </script>
  // The template closes with: }</script>\n\n\n</body></html>"</script>
  const alt = '\\n</body></html>"</script>';
  const altIdx = bundle.lastIndexOf(alt);
  console.log('Alt end at:', altIdx);
  process.exit(1);
}

// The full JSON string goes from tplStart to realEndIdx + '</body></html>"'.length
const jsonEnd = realEndIdx + ('</body></html>"').length;
const fullJSON = bundle.slice(tplStart, jsonEnd);
console.log('Full JSON length:', fullJSON.length);
console.log('First 10 chars:', JSON.stringify(fullJSON.slice(0, 10)));
console.log('Last 30 chars:', JSON.stringify(fullJSON.slice(-30)));

try {
  const t = JSON.parse(fullJSON);
  console.log('JSON parse OK! Template HTML length:', t.length);
  fs.writeFileSync('C:/Users/vpreu/Desktop/Natan/_full_template.html', t);
  console.log('Saved to _full_template.html');
} catch(e) {
  console.log('Parse error:', e.message);
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1]);
  if(pos) {
    console.log('Context:', JSON.stringify(fullJSON.slice(Math.max(0,pos-80), pos+80)));
  }
}
