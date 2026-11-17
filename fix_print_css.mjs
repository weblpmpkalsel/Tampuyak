import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const start = lines.findIndex(l => l.includes('<div className="max-w-[210mm] mx-auto space-y-24">') && l.includes('if (isPrintMode)') === false);

// Wait, I will just replace the exact strings.
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  '<div className="max-w-[210mm] mx-auto space-y-24">',
  '<div id="printable-rkjm" className="max-w-[210mm] mx-auto space-y-24">'
);

code = code.replace(
  '<style>{`\n          @media print {\n            body * { visibility: hidden; }\n            .print\\\\:hidden { display: none; }\n            .max-w-\\\\[210mm\\\\] { max-w: none; }\n            .max-w-\\\\[210mm\\\\] * { visibility: visible; }\n            .max-w-\\\\[210mm\\\\] { position: absolute; left: 0; top: 0; }\n          }\n        `}</style>',
  '<style>{`\n          @media print {\n            body * { visibility: hidden; }\n            .print\\\\:hidden { display: none !important; }\n            #printable-rkjm { position: absolute; left: 0; top: 0; width: 100%; max-width: none; }\n            #printable-rkjm, #printable-rkjm * { visibility: visible; }\n          }\n        `}</style>'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
