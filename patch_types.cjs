const fs = require('fs');
let code = fs.readFileSync('src/reference/ReferenceTypes.ts', 'utf-8');

code = code.replace(
  '  originalRequest: ReferenceRequest;\n}',
  '  originalRequest: ReferenceRequest;\n  metadata?: any;\n}'
);

fs.writeFileSync('src/reference/ReferenceTypes.ts', code);
console.log("ReferenceTypes patched!");
