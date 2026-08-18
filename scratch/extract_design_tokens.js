const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../framer_source/extracted_data');
const files = fs.readdirSync(dir).filter(f => f.endsWith('_styles.html'));

const fontFamilies = new Set();
const colors = new Set();
const bgColors = new Set();
const borderRadii = new Set();
const fontSizes = new Set();
const fontWeights = new Set();
const customProps = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');

  // Match font-family
  const ffMatches = content.match(/font-family\s*:\s*([^;}]+)/gi);
  if (ffMatches) ffMatches.forEach(m => fontFamilies.add(m.trim()));

  // Match hex colors
  const hexMatches = content.match(/#(?:[0-9a-fA-F]{3,8})\b/g);
  if (hexMatches) hexMatches.forEach(m => colors.add(m.toLowerCase()));

  // Match rgb/rgba colors
  const rgbMatches = content.match(/rgba?\([^)]+\)/gi);
  if (rgbMatches) rgbMatches.forEach(m => colors.add(m.toLowerCase()));

  // Match CSS custom properties --...
  const propMatches = content.match(/--framer-[a-zA-Z0-9-]+:[^;]+/g);
  if (propMatches) propMatches.forEach(m => customProps.add(m.trim()));

  // Match border-radius
  const brMatches = content.match(/border-radius\s*:\s*([^;}]+)/gi);
  if (brMatches) brMatches.forEach(m => borderRadii.add(m.trim()));

  // Match font-size
  const fsMatches = content.match(/font-size\s*:\s*([^;}]+)/gi);
  if (fsMatches) fsMatches.forEach(m => fontSizes.add(m.trim()));
});

console.log('=== FONT FAMILIES ===');
console.log(Array.from(fontFamilies));

console.log('=== COLORS ===');
console.log(Array.from(colors));

console.log('=== BORDER RADII ===');
console.log(Array.from(borderRadii).slice(0, 15));

console.log('=== FONT SIZES ===');
console.log(Array.from(fontSizes).slice(0, 15));

console.log('=== CUSTOM PROPERTIES ===');
console.log(Array.from(customProps).slice(0, 20));
