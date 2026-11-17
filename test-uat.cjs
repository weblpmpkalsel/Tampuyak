const fs = require('fs');
const file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
console.log("UAT VIEW EXIST:", file.includes('UAT Enterprise Verification Dashboard'));
