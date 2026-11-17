const fs = require('fs');
let file = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// Replace table margins
file = file.replace(
  /className="w-full min-w-\[800px\] print:min-w-0 md:min-w-0 table-auto max-w-full border-collapse border border-slate-300 text-sm my-6"/g,
  'className="w-full min-w-[800px] print:min-w-0 md:min-w-0 table-auto max-w-full border-collapse border border-slate-300 text-sm"'
);
file = file.replace(
  /className="w-full min-w-\[800px\] print:min-w-0 md:min-w-0 table-auto max-w-full text-sm border-collapse border border-slate-300 my-6"/g,
  'className="w-full min-w-[800px] print:min-w-0 md:min-w-0 table-auto max-w-full text-sm border-collapse border border-slate-300"'
);

// Add gdds-table-block to their wrappers
file = file.replace(
  /className="overflow-x-auto print:overflow-visible w-full pb-4"/g,
  'className="overflow-x-auto print:overflow-visible w-full gdds-table-block"'
);

// Other generic my-6
file = file.replace(/className="my-6"/g, 'className="mt-[12pt] mb-[12pt]"');
file = file.replace(/className="my-4 /g, 'className="mt-[12pt] mb-[12pt] ');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', file);
