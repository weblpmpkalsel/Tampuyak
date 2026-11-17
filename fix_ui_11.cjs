const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(/outline-none \$\{sizeClasses\[size as keyof typeof sizeClasses\]/g, 'outline-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size as keyof typeof sizeClasses]');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 11');
