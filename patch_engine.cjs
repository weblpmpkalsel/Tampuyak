const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetOpt = `    const opt = {
      margin:       1,
      filename:     \`\${metadata.title}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
    };`;

const replacementOpt = `    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     \`\${metadata.title}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        onclone: (clonedDoc: Document) => {
          const container = clonedDoc.getElementById('printable-doc');
          if (container) {
            // Remove hardcoded screen widths and paddings for export
            container.classList.remove('w-[210mm]', 'px-[2cm]', 'py-[2.5cm]');
            container.style.width = isLandscape ? '297mm' : '210mm';
            container.style.padding = '10mm';
            container.style.margin = '0 auto';
          }
          // Force all landscape sections to fit within the new container width
          const landscapes = clonedDoc.querySelectorAll('.landscape-section');
          landscapes.forEach(el => {
            const h = el as HTMLElement;
            h.style.width = '100%';
            h.style.marginLeft = '0';
            h.style.maxWidth = '100%';
            h.style.padding = '0';
          });
          // Force all portrait sections to fit within the new container width
          const portraits = clonedDoc.querySelectorAll('.portrait-section');
          portraits.forEach(el => {
            const h = el as HTMLElement;
            h.style.width = '100%';
            h.style.marginLeft = '0';
            h.style.maxWidth = '100%';
            h.style.padding = '0';
          });
          // Ensure tables don't exceed 100%
          const tables = clonedDoc.querySelectorAll('table');
          tables.forEach(table => {
            const t = table as HTMLElement;
            t.style.width = '100%';
            t.style.maxWidth = '100%';
            t.style.tableLayout = 'auto';
          });
        }
      },
      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
    };`;

code = code.replace(targetOpt, replacementOpt);
fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched export engine!");
