const fs = require('fs');
let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\\n');

// Find the line that has `))} ` and the following lines are `} `
const idx = lines.findIndex((l, i) => l.trim() === '))} ' || l.trim() === '))}');
console.log('Found ))} at', idx);
// Check if the lines after are }
if(lines[idx+1].trim() === '}' && lines[idx+2].trim() === '}') {
   console.log('Confirmed bad braces at', idx+1);
}
