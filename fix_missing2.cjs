const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const iconsToAdd = ['Milestone', 'Archive', 'Code'];

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

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log("Fixed missing imports 2");
