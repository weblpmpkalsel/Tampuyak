const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `      const targetYearInt = opActivity.planningYear;
      const targetBucket = \`Y\${targetYearInt}\`;`;

const replacement = `      const targetBucket = opActivity.planningYear as string;
      const targetYearInt = parseInt(targetBucket.replace('Y', ''));`;

code = code.replace(target, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
