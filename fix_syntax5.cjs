const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace('\\nexport const TargetPerformanceView', '\\nexport const TargetPerformanceView');
code = code.split('\\n').join(''); // NO wait

code = code.replace(/\\\\nexport const TargetPerformanceView/g, '\\nexport const TargetPerformanceView');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
