const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  'spacing: { after: 1200 } // approx 4-5cm space',
  'spacing: { after: 2400 } // approx 4-5cm space'
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Export engine signature space patched!");
