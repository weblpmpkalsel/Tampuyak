const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace('\\\\n\\\\nexport const TargetPerformanceView = () => {', '\\nexport const TargetPerformanceView = () => {');

fs.writeFileSync('src/Tampuyak.tsx', code);
