const fs = require('fs');

// BudgetBuilder.ts
let code = fs.readFileSync('src/budget/BudgetBuilder.ts', 'utf-8');
code = code.replace(
  'const programTitle = pa.program || pa.programName || pa.activity || program?.name || `Budget Structure ${request.year}`;',
  'const programTitle = pa.program || pa.programName || pa.activity || program?.name || "-";'
);
fs.writeFileSync('src/budget/BudgetBuilder.ts', code);

// ReferenceResolver.ts
let refCode = fs.readFileSync('src/reference/ReferenceResolver.ts', 'utf-8');
refCode = refCode.replace(/'UNGROUPED_PROGRAM'/g, "'-'");
refCode = refCode.replace(/'UNGROUPED_ACTIVITY'/g, "'-'");
fs.writeFileSync('src/reference/ReferenceResolver.ts', refCode);

console.log("Unwanted texts patched!");
