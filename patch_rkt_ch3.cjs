const fs = require('fs');
let code = fs.readFileSync('src/RKTDocument/ActivityBuilder.ts', 'utf-8');

code = code.replace(
  'metadata: { generated: true }',
  'metadata: { generated: true },\n      orientation: "landscape"'
);

fs.writeFileSync('src/RKTDocument/ActivityBuilder.ts', code);
console.log("RKT Chapter 3 orientation patched!");
