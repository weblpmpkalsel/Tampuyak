const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const importStatement = `import { PusatPengetahuanView } from "./PusatPengetahuan";\n`;
if (!content.includes('import { PusatPengetahuanView }')) {
  // Find a good place to put it, maybe after standard imports
  content = content.replace(/(import React.*?;\n)/, `$1${importStatement}`);
}

const renderStatement = `
            {currentView === "pusatPengetahuan" && <PusatPengetahuanView />}
`;

if (!content.includes('currentView === "pusatPengetahuan" && <PusatPengetahuanView />')) {
  content = content.replace(
    '{currentView === "dqaEngine" && (',
    renderStatement + '            {currentView === "dqaEngine" && ('
  );
}

// Add to header text
const headerText = `
                    : currentView === "pusatPengetahuan" ? "Pusat Pengetahuan"`;

if (!content.includes('currentView === "pusatPengetahuan" ? "Pusat Pengetahuan"')) {
  content = content.replace(
    ': "Tampuyak OS"',
    headerText + '\n                    : "Tampuyak OS"'
  );
}

fs.writeFileSync('src/Tampuyak.tsx', content);
