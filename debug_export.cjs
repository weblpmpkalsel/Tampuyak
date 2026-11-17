const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  '        onclone: (clonedDoc: HTMLDocument) => {',
  `        onclone: (clonedDoc: HTMLDocument) => {
          const originalContainer = typeof htmlContent === 'string' ? null : htmlContent;
          if (originalContainer) {
            console.log("Original container children:", originalContainer.children.length);
            console.log("Original container innerHTML length:", originalContainer.innerHTML.length);
            console.log("Original container rect:", originalContainer.getBoundingClientRect());
          }
          const clonedContainer = clonedDoc.getElementById('printable-doc-export');
          console.log("Cloned container found:", !!clonedContainer);
          if (clonedContainer) {
            console.log("Cloned container children:", clonedContainer.children.length);
            console.log("Cloned container innerHTML length:", clonedContainer.innerHTML.length);
          }
`
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Added debugging to Export Engine!");
