const fs = require('fs');
let code = fs.readFileSync('src/RKASDocument/Chapter2Builder.ts', 'utf-8');
code = code.replace(
  'metadata: { generated: true }',
  'metadata: { generated: true },\n      orientation: "landscape"'
);
fs.writeFileSync('src/RKASDocument/Chapter2Builder.ts', code);
console.log("Chapter2 patched!");
