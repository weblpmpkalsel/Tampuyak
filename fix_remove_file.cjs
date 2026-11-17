const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const lucideMatch = code.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
if (lucideMatch) {
  let importsStr = lucideMatch[1];
  importsStr = importsStr.replace(/,\s*File\b/, '');
  code = code.replace(lucideMatch[1], importsStr);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Removed File from imports");
}
