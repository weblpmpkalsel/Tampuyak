const fs = require('fs');
let code = fs.readFileSync('src/portal/LoginPage.tsx', 'utf8');

const regex = /if \(\!user\.emailVerified\) \{[\s\S]*?return;\n\s+\}/s;
code = code.replace(regex, '');

fs.writeFileSync('src/portal/LoginPage.tsx', code);
