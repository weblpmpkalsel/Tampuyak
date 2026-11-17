const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
const matches = code.match(/\{\{.*?\}\}/g);
if (matches) {
  const unique = [...new Set(matches)];
  console.log(unique.join('\n'));
} else {
  console.log('No matches');
}
