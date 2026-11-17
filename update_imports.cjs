const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importTarget = /Database,\\n/g;
if (code.match(importTarget)) {
    code = code.replace(importTarget, 'Database,\\n  Library,\\n  Milestone,\\n');
    fs.writeFileSync('src/Tampuyak.tsx', code);
    console.log("Added imports");
}
