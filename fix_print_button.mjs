import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  'onClick={() => window.print()}',
  'onClick={() => { setIsPrintMode(true); setTimeout(() => window.print(), 500); }}'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
