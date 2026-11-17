const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'className="flex flex-col items-center justify-between text-center min-h-[257mm] box-border portrait-section print-no-break"',
  'className="flex flex-col items-center justify-center text-center min-h-[257mm] box-border portrait-section print-no-break py-12 space-y-12"'
);

// Remove specific margins to rely on space-y-12
code = code.replace(
  '<div className="w-full mt-8">',
  '<div className="w-full">'
);
code = code.replace(
  '<div className="w-full flex items-center justify-center my-10">',
  '<div className="w-full flex items-center justify-center">'
);
code = code.replace(
  '<div className="w-full my-8">',
  '<div className="w-full">'
);
code = code.replace(
  '<div className="w-full mb-8">',
  '<div className="w-full">'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched cover center!");
