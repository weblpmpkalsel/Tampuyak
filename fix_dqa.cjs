const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
const lines = code.split('\n');

let startIdx = -1;
let endIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(': any) => {') && lines[i].trim() === ': any) => {') {
    startIdx = i;
  }
  if (lines[i].includes('const WorkspaceAnalisisView = ({ navigateToView }: any) => {')) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
  // We want to delete from startIdx to endIdx - 1
  const newLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx)];
  fs.writeFileSync('src/Tampuyak.tsx', newLines.join('\n'));
  console.log('Fixed DQA syntax error.');
} else {
  console.log('Could not find boundaries.', startIdx, endIdx);
}
