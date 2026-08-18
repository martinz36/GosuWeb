const fs = require('fs');
const path = require('path');

const animateDir = path.join(process.cwd(), 'public', 'assets', 'animate');
const files = fs.readdirSync(animateDir);

let fixedCount = 0;

files.forEach(file => {
  if (file.endsWith('.mjs')) {
    const filePath = path.join(animateDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Fix invalid left hand assignments created by regex
    // e.g. ((e&&e.dataset)?e.dataset.framerHydrateV2:undefined)=...
    content = content.replace(/\(\(([a-zA-Z0-9_$]+)&&\1\.dataset\)\?\1\.dataset\.([a-zA-Z0-9_$]+):undefined\)\s*=/g, '$1.dataset.$2=');
    content = content.replace(/\(\(([a-zA-Z0-9_$]+)&&\1\.dataset\)\?\1\.dataset\.([a-zA-Z0-9_$]+):undefined\)/g, '($1&&$1.dataset?$1.dataset.$2:undefined)');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Fixed invalid assignments in: ${file}`);
      fixedCount++;
    }
  }
});

console.log(`Total files fixed: ${fixedCount}`);
