const fs = require('fs');
let code = fs.readFileSync('src/budget/BudgetBuilder.ts', 'utf-8');

code = code.replace(
  'const resolvedRef = request.resolvedReference || {};',
  'const resolvedRef: any = request.resolvedReference || {};'
);

fs.writeFileSync('src/budget/BudgetBuilder.ts', code);
console.log("BudgetBuilder patched!");
