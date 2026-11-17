const fs = require('fs');
const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const importRegex = /} from "lucide-react";/;
const missingIcons = ['Maximize', 'Bold', 'Italic', 'Underline'];

if (code.match(importRegex)) {
  const replacement = '  ' + missingIcons.join(',\\n  ') + ',\\n} from "lucide-react";';
  code = code.replace(importRegex, replacement);
  fs.writeFileSync(file, code);
  console.log("Added missing icons");
}
