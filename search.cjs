const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
if (content.toLowerCase().includes('standing by')) console.log('FOUND STANDING BY');
if (content.toLowerCase().includes('build process')) console.log('FOUND BUILD PROCESS');
if (content.toLowerCase().includes('completed successfully')) console.log('FOUND COMPLETED SUCCESSFULLY');
if (content.toLowerCase().includes('instructions')) console.log('FOUND INSTRUCTIONS');
