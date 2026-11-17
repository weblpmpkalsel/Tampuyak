const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex8 = /const currentYearPlan = \(planning\.annualPlans as any\)\["Y" \+ activeYear\];/;
const replacement8 = `const currentYearPlan = (planning.annualPlans as any)["Y" + activeYear] || { rkt: [], rkas: [], monitoring: [], evaluation: [] };`;

code = code.replace(regex8, replacement8);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed currentYearPlan fallback');
