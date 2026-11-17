const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex9 = /const planning = settings\.relationalPlanning \|\| \{/;
const replacement9 = `const planning = (settings.relationalPlanning?.objectives && settings.relationalPlanning?.annualPlans) ? settings.relationalPlanning : {`;

code = code.replace(regex9, replacement9);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed planning fallback');
