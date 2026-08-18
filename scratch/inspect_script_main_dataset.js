const fs = require('fs');
const path = require('path');

const scriptPath = path.join(process.cwd(), 'public', 'assets', 'animate', 'script_main.3FbrKJgn.mjs');
const content = fs.readFileSync(scriptPath, 'utf-8');

const targetIdx = content.indexOf('.dataset');
console.log('Index of .dataset:', targetIdx);

if (targetIdx !== -1) {
  console.log('Snippet before & after dataset:');
  console.log(content.substring(Math.max(0, targetIdx - 150), Math.min(content.length, targetIdx + 150)));
}

// Find all occurrences of dataset
let idx = 0;
let occurrences = [];
while ((idx = content.indexOf('.dataset', idx)) !== -1) {
  occurrences.push(idx);
  idx += 8;
}

console.log(`Found ${occurrences.length} occurrences of .dataset`);
occurrences.forEach((pos, i) => {
  console.log(`\n--- Occurrence ${i+1} at pos ${pos} ---`);
  console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 100)));
});
