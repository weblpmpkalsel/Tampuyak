const fs = require('fs');

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const brokenIndices = [9642, 12823, 13272];

brokenIndices.forEach(idx => {
  let endIdx = idx;
  let openBraces = 0;
  let foundBrace = false;
  for (let i = idx; i < lines.length; i++) {
    if (lines[i].includes('{')) {
      openBraces += (lines[i].match(/\{/g) || []).length;
      foundBrace = true;
    }
    if (lines[i].includes('}')) {
      openBraces -= (lines[i].match(/\}/g) || []).length;
    }
    if (foundBrace && openBraces <= 0) {
      endIdx = i;
      break;
    }
  }
  console.log(`Block starting at ${idx} ends at ${endIdx}`);
});
