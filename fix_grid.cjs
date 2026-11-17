const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Replace 1
code = code.replace(
  /<div className="grid grid-cols-2 gap-6 text-center mt-16">/g,
  '<div className="flex justify-between items-start text-center mt-16 gap-6 w-full">'
);

// Replace 2
code = code.replace(
  /<div className="relative inline-block text-left">/g,
  '<div className="relative inline-block text-center flex-1">'
);

// Replace 3
code = code.replace(
  /<div className="grid grid-cols-2 gap-6 text-center text-sm">/g,
  '<div className="flex justify-between items-start text-center text-sm gap-6 w-full">'
);

// Fix Token Engine Output to support HTML in dangerouslySetInnerHTML
const oldTokenHighlight = 'return "[Token tidak dikenal]"; // Fallback for unknown tokens';
const newTokenHighlight = 'return `<mark class="bg-rose-200 text-rose-900 font-bold px-1 rounded shadow-sm">[❓ ${key}]</mark>`; // Highlight unknown tokens';

code = code.replace(oldTokenHighlight, newTokenHighlight);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed Grid Layout and Tokens');
