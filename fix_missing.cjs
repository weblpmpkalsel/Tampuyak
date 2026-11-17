const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const iconsToAdd = ['Library', 'ChevronLeft', 'ZoomIn', 'ZoomOut', 'ArrowDown'];

const lucideImportMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
if (lucideImportMatch) {
  let importsStr = lucideImportMatch[1];
  for (const icon of iconsToAdd) {
    if (!importsStr.includes(icon)) {
      importsStr += ', ' + icon;
    }
  }
  content = content.replace(lucideImportMatch[1], importsStr);
}

// Check PusatPengetahuanView
if (content.includes('<PusatPengetahuanView') && !content.includes('import { PusatPengetahuanView }')) {
  content = 'import { PusatPengetahuanView } from "./PusatPengetahuan";\n' + content;
}

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log("Fixed missing imports");
