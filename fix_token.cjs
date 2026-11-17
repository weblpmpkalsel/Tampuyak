const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
code = code.replace(
  /"academic\.year": activeYear\.year \|\| "-",/g,
  '"academic.year": activeYear.name || "-",'
);
fs.writeFileSync('src/Tampuyak.tsx', code);
