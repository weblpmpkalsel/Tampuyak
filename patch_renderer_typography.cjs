const fs = require('fs');
let file = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

file = file.replace(
  /className="overflow-x-auto print:overflow-visible w-full pb-4"><table className="w-full border-collapse border border-black text-sm my-6">/g,
  'className="overflow-x-auto print:overflow-visible w-full gdds-table-block"><table className="w-full border-collapse border border-black text-sm">'
);

file = file.replace(
  /className="flex justify-center my-6 print-no-break"/g,
  'className="gdds-image-block print-no-break"'
);

file = file.replace(
  /className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg my-4"/g,
  'className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg gdds-attachment-block"'
);

file = file.replace(
  /className="flex justify-center my-8 print-no-break"/g,
  'className="gdds-cover-logos print-no-break"'
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', file);
