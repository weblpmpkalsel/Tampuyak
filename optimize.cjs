const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(/w-\[280px\]/g, 'w-64');
code = code.replace(/ml-\[280px\]/g, 'ml-64');

// reduce sidebar item padding
code = code.replace(/px-4 py-3 rounded-xl/g, 'px-3 py-2.5 rounded-lg');
code = code.replace(/px-5 py-6 space-y-1.5/g, 'px-4 py-4 space-y-1');

// reduce top header height
code = code.replace(/h-24/g, 'h-16');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Sidebar optimized");
