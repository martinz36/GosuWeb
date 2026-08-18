const fs = require('fs');
const path = require('path');

const animateDir = path.join(process.cwd(), 'public', 'assets', 'animate');
const files = fs.readdirSync(animateDir);

let totalPatches = 0;

files.forEach(file => {
  if (file.endsWith('.mjs')) {
    const filePath = path.join(animateDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let patched = false;

    // Check for e.dataset or t.dataset without optional chaining
    if (content.includes('.dataset.')) {
      content = content.replace(/([a-zA-Z0-9_$]+)\.dataset\.([a-zA-Z0-9_$]+)/g, '(($1&&$1.dataset)?$1.dataset.$2:undefined)');
      patched = true;
    }
    if (content.includes('.dataset?')) {
      content = content.replace(/([a-zA-Z0-9_$]+)\.dataset\?/g, '($1&&$1.dataset)?');
      patched = true;
    }
    if (content.includes('in e.dataset')) {
      content = content.replace('in e.dataset', 'in(e?.dataset||{})');
      patched = true;
    }
    if (content.includes('in t.dataset')) {
      content = content.replace('in t.dataset', 'in(t?.dataset||{})');
      patched = true;
    }

    if (patched) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Patched dataset accesses in: ${file}`);
      totalPatches++;
    }
  }
});

console.log(`Total files patched: ${totalPatches}`);
