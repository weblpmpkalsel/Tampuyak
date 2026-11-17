const fs = require('fs');

let content = fs.readFileSync('/app/applet/src/Tampuyak.tsx', 'utf8');

const target = `    return { 
      objectives,`;
const replacement = `
    console.log('Object.keys(annualPlans):', Object.keys(annualPlans));
    console.log('Y1.rkt.length:', annualPlans.Y1.rkt.length);
    console.log('Y2.rkt.length:', annualPlans.Y2.rkt.length);
    console.log('Y3.rkt.length:', annualPlans.Y3.rkt.length);
    console.log('Y4.rkt.length:', annualPlans.Y4.rkt.length);
    return { 
      objectives,`;

content = content.replace(target, replacement);
fs.writeFileSync('/app/applet/src/Tampuyak.tsx', content);
