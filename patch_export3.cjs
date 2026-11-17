const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetStr = `                      new Paragraph({
                         text: sig.name,
                         alignment: AlignmentType.CENTER,
                         style: "Strong" // Bold equivalent if "Strong" style is missing might fall back, let's use TextRun
                      }),
                      new Paragraph({
                         text: \\\`NIP. \\\${sig.nip}\\\`,
                         alignment: AlignmentType.CENTER,
                      })`;

const replaceStr = `                      new Paragraph({
                         alignment: AlignmentType.CENTER,
                         children: [
                            new TextRun({
                               text: sig.name,
                               bold: true,
                               underline: {}
                            })
                         ]
                      }),
                      new Paragraph({
                         alignment: AlignmentType.CENTER,
                         children: [
                            new TextRun({
                               text: \`NIP. \${sig.nip}\`
                            })
                         ]
                      })`;

code = code.replace(targetStr, replaceStr);

// Also need to push the table into chapterChildren
const targetStr2 = `             // To make text bold without relying on style, we can replace the simple Paragraph with TextRun, but docx API is a bit verbose.
             // We'll update the sigCells array definition below.
           }
        });`;

const replaceStr2 = `             
             const sigTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                },
                rows: [
                   new TableRow({
                      children: sigCells
                   })
                ]
             });
             
             chapterChildren.push(sigTable);
           }
        });`;
        
code = code.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Export engine signatures fixed!");
