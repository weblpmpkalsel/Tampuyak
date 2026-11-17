const fs = require('fs');

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const brokenIndices = [9642, 12823, 13272];
let blocksToRemove = [];

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
  blocksToRemove.push({start: idx, end: endIdx});
});

// Remove from bottom to top so indices don't shift
blocksToRemove.sort((a, b) => b.start - a.start);

blocksToRemove.forEach(block => {
  lines.splice(block.start, block.end - block.start + 1);
});

fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
console.log('Fixed broken blocks!');
