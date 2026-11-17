const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetOpt = `          tables.forEach(table => {
            const t = table as HTMLElement;
            t.style.width = '100%';
            t.style.maxWidth = '100%';
            t.style.tableLayout = 'auto';
          });
        }
      },
      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
    };`;

const replacementOpt = `          tables.forEach(table => {
            const t = table as HTMLElement;
            t.style.width = '100%';
            t.style.maxWidth = '100%';
            t.style.tableLayout = 'auto';
          });

          // Force print styles for PDF export
          const printStyle = clonedDoc.createElement('style');
          printStyle.innerHTML = \`
            *, *::before, *::after { box-sizing: border-box !important; animation: none !important; transition: none !important; transform: none !important; }
            .landscape-section, .portrait-section { width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; transform: none !important; }
            table { table-layout: auto !important; width: 100% !important; max-width: 100% !important; border-collapse: collapse !important; }
            tr, td, th { page-break-inside: avoid; break-inside: avoid; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            h2, h3, h4, h5, h6 { page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid; }
            p { orphans: 3; widows: 3; page-break-inside: avoid; text-align: justify !important; hyphens: auto !important; }
            body { line-height: 1.5 !important; text-align: left !important; }
            #printable-doc-export { transform: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; max-width: 100% !important; min-width: 0 !important; }
          \`;
          clonedDoc.head.appendChild(printStyle);
        }
      },
      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
    };`;

code = code.replace(targetOpt, replacementOpt);
fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched pdf css!");
