const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Add break-words to all th tags missing it
code = code.replace(/<th className="([^"]*)"/g, (match, classes) => {
  if (!classes.includes('break-words')) {
    return `<th className="${classes} break-words whitespace-normal overflow-hidden"`;
  }
  return match;
});

// Also make sure all td have overflow-hidden just in case
code = code.replace(/<td className="([^"]*)"/g, (match, classes) => {
  if (!classes.includes('overflow-hidden')) {
    return `<td className="${classes} overflow-hidden"`;
  }
  return match;
});

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched th!");
