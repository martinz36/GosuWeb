const fs = require('fs');
const path = require('path');

const scriptPath = path.join(process.cwd(), 'public', 'assets', 'animate', 'script_main.3FbrKJgn.mjs');
let content = fs.readFileSync(scriptPath, 'utf-8');

// Patch 1: Safe dataset access on t
content = content.replace(
  's=JSON.parse(t.dataset.framerHydrateV2)',
  's=(t&&t.dataset&&t.dataset.framerHydrateV2)?JSON.parse(t.dataset.framerHydrateV2):{}'
);

// Patch 2: Safe dataset access on e (document.getElementById('main'))
content = content.replace(
  '`framerHydrateV2`in e.dataset?V(!0,e):V(!1,e)',
  'e&&e.dataset&&`framerHydrateV2`in e.dataset?V(!0,e):(e&&V(!1,e))'
);

fs.writeFileSync(scriptPath, content, 'utf-8');
console.log('Successfully patched script_main.3FbrKJgn.mjs for safe dataset access!');
