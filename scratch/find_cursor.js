const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, pattern);
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.css') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes(pattern)) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  }
}

console.log("Searching for cursor references...");
searchDir(path.join(process.cwd(), 'framer_source'), 'c54oa2');
searchDir(path.join(process.cwd(), 'public', 'assets'), 'c54oa2');
searchDir(path.join(process.cwd(), 'framer_source'), 'cursor');
