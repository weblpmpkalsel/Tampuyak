const fs = require('fs');
let code = fs.readFileSync('src/RKTDocument/BudgetBuilder.ts', 'utf-8');

code = code.replace(
  'metadata: { generated: true }',
  'metadata: { generated: true },\n      orientation: "landscape"'
);

fs.writeFileSync('src/RKTDocument/BudgetBuilder.ts', code);
console.log("RKT Chapter 4 orientation patched!");
