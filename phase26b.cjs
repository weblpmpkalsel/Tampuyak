const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. Sidebar width
code = code.replace(/w-64/g, 'w-60');
code = code.replace(/ml-64/g, 'ml-60');

// 2. Reduce padding in main areas (p-8 to p-6 or p-4 where appropriate for higher density)
code = code.replace(/p-8/g, 'p-6');
code = code.replace(/p-12/g, 'p-8');
code = code.replace(/p-16/g, 'p-10');
code = code.replace(/py-12/g, 'py-8');
code = code.replace(/px-8/g, 'px-6');
code = code.replace(/space-y-8/g, 'space-y-6');
code = code.replace(/space-y-6/g, 'space-y-4'); // Reduce space between cards

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('UI Polish Applied');
