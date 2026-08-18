const fs = require('fs');
const path = require('path');

const animateDir = path.join(process.cwd(), 'public', 'assets', 'animate');
const files = fs.readdirSync(animateDir);

for (const file of files) {
  if (file.endsWith('.mjs') || file.endsWith('.js')) {
    const fullPath = path.join(animateDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    if (content.includes('c54oa2') || content.includes('cursor') || content.includes('spray')) {
      console.log(`\n=== MATCH IN: ${file} ===`);
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.includes('c54oa2') || line.includes('cursor')) {
          console.log(line.substring(0, 300));
        }
      }
    }
  }
}
