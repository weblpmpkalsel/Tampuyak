const fs = require('fs');
const lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const findings = [];
lines.forEach((line, index) => {
    if (line.match(/>[^<]*\bAI\b[^>]*</i) || line.match(/"[^"]*\bAI\b[^"]*"/i)) {
        findings.push(`${index + 1}: ${line.trim()}`);
    }
});
fs.writeFileSync('remaining_ai.txt', findings.join('\n'));
