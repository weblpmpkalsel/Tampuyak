const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const targetLogic = `        {section.tables && section.tables.map((table, idx) => {
          let isLandscape = false;
          if (Array.isArray(table.data) && table.data.length > 0) {
            const keys = Object.keys(table.data[0]);
            if (keys.length > 6) {
              isLandscape = true;
            }
          }
          return (
          <div key={idx} className={\`my-6 \${isLandscape ? 'landscape-section' : ''}\`}>`;

const replacementLogic = `        {section.tables && section.tables.map((table, idx) => {
          return (
          <div key={idx} className="my-6">`;

code = code.replace(targetLogic, replacementLogic);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("EnterpriseDocumentViewer landscape logic patched!");
