const fs = require('fs');
let code = fs.readFileSync('src/services/auth/authService.ts', 'utf-8');
code = code.replace('    await sendEmailVerification(userCredential.user);\n', '');
fs.writeFileSync('src/services/auth/authService.ts', code);
console.log('done');
