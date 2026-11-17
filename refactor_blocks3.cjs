const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Also find the `{ id: "b4", type: "AI", ... }` and change to MANUAL
code = code.replace(
    /id:\s*"b4",\s*type:\s*"AI",/g,
    'id: "b4",\n      type: "MANUAL",'
);

code = code.replace(
    /id:\s*"b5",\s*type:\s*"AI",/g,
    'id: "b5",\n      type: "MANUAL",'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
