const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /const distYearStr = idx === 0 \? 'Y4' : distributionService\.assignYearToActivity\(\`RKT-GEN-\$\{idx\}\`, idx\);/g;
code = code.replace(regex, "const distYearStr = distributionService.assignYearToActivity(`RKT-GEN-${idx}`, idx);");

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Reverted Tampuyak.tsx");
