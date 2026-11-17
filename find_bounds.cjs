const fs = require('fs');
const lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('const RKJMPipelineView ='));
let end = -1;
let braces = 0;
let started = false;
for (let i = start; i < lines.length; i++) {
  if (lines[i].includes('{')) braces += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) braces -= (lines[i].match(/\}/g) || []).length;
  if (braces > 0) started = true;
  if (started && braces === 0) {
    end = i;
    break;
  }
}
console.log(`Start: ${start + 1}, End: ${end + 1}`);
