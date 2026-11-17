const fs = require('fs');
console.log("Checking if EnterpriseDocumentViewer has a zero height or opacity 0 bug...");
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');
if (code.includes('opacity-0') || code.includes('opacity: 0')) console.log("Opacity 0 found!");
if (code.includes('display: none') || code.includes('display:none')) console.log("Display none found!");
if (code.includes('height: 0') || code.includes('h-0')) console.log("Height 0 found!");
