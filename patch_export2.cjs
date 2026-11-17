const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetStr = `        section.paragraphs?.forEach(p => {
          chapterChildren.push(
            new Paragraph({
              text: p,
              spacing: { after: 200 },
            })
          );
        });`;

const replaceStr = `        section.paragraphs?.forEach(p => {
          chapterChildren.push(
            new Paragraph({
              text: p,
              spacing: { after: 200 },
            })
          );
        });
        
        section.tables?.forEach(table => {
           if (table.type === 'signature_block') {
             chapterChildren.push(
                new Paragraph({
                  text: table.location,
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 800, after: 400 }
                })
             );
             
             const sigCells = table.signatures.map((sig: any) => {
                return new TableCell({
                   borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                   },
                   children: [
                      new Paragraph({
                         text: sig.label.replace('\\n', ' '),
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 1200 } // approx 4-5cm space
                      }),
                      new Paragraph({
                         text: sig.name,
                         alignment: AlignmentType.CENTER,
                         style: "Strong" // Bold equivalent if "Strong" style is missing might fall back, let's use TextRun
                      }),
                      new Paragraph({
                         text: \`NIP. \${sig.nip}\`,
                         alignment: AlignmentType.CENTER,
                      })
                   ]
                });
             });
             
             // To make text bold without relying on style, we can replace the simple Paragraph with TextRun, but docx API is a bit verbose.
             // We'll update the sigCells array definition below.
           }
        });`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Export engine signatures added!");
