const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace indigo with blue throughout DashboardView and Header
code = code.replace(/text-indigo/g, 'text-blue');
code = code.replace(/bg-indigo/g, 'bg-blue');
code = code.replace(/border-indigo/g, 'border-blue');
code = code.replace(/ring-indigo/g, 'ring-blue');
code = code.replace(/from-indigo/g, 'from-blue');
code = code.replace(/to-indigo/g, 'to-blue');
code = code.replace(/shadow-indigo/g, 'shadow-blue');

// Improve layout and reduce border radius across the dashboard for a more professional "government/office" look
code = code.replace(/rounded-2xl/g, 'rounded-md');
code = code.replace(/rounded-xl/g, 'rounded-md');
code = code.replace(/rounded-lg/g, 'rounded-md');
code = code.replace(/rounded-full/g, 'rounded');

// Make text larger/more accessible where appropriate
code = code.replace(/text-\[10px\]/g, 'text-xs');
code = code.replace(/text-\[9px\]/g, 'text-xs');
code = code.replace(/text-\[11px\]/g, 'text-sm');

// Remove border-t-[6px] which is a bit decorative, replace with a solid but less intense one
code = code.replace(/border-t-\[6px\] border-blue-700/g, 'border-t-4 border-blue-800');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 2');
