const fs = require('fs');
const path = require('path');

const animateDir = path.join(process.cwd(), 'public', 'assets', 'animate');
const files = fs.readdirSync(animateDir);

files.forEach(file => {
  if (file.endsWith('.mjs')) {
    const content = fs.readFileSync(path.join(animateDir, file), 'utf-8');
    if (content.includes('Cursor') || content.includes('cursor') || content.includes('c54oa2')) {
      const matches = content.match(/.{0,100}(?:Cursor|cursor|c54oa2|spray).{0,100}/gi);
      if (matches && matches.length > 0) {
        console.log(`=== FILE: ${file} (${matches.length} matches) ===`);
        matches.slice(0, 5).forEach(m => console.log(' -> ', m.trim()));
      }
    }
  }
});
