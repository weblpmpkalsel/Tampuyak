const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Remove hardcoded widths from IRB matrix and Targets matrix
code = code.replace(/w-1\/4/g, '');
code = code.replace(/w-2\/4/g, '');

// Remove widthStyle logic
const targetLogic = `                        let widthStyle = {};
                        const k = key.toLowerCase();
                        if (k === 'no') widthStyle = { width: '45px', minWidth: '45px' };
                        else if (k === 'semester') widthStyle = { width: '70px', minWidth: '70px' };
                        else if (k === 'kuartal') widthStyle = { width: '70px', minWidth: '70px' };
                        else widthStyle = {};
                        return (
                          <th key={key} style={widthStyle} className="border border-slate-300 p-2 text-center align-middle font-bold text-[10pt] capitalize break-words whitespace-normal [word-break:break-word] min-w-[50px] overflow-hidden">
                            {key}
                          </th>
                        );`;

const replacementLogic = `                        return (
                          <th key={key} className="border border-slate-300 p-2 text-center align-middle font-bold text-[10pt] capitalize break-words whitespace-normal [word-break:break-word] min-w-[30px] overflow-hidden">
                            {key}
                          </th>
                        );`;

code = code.replace(targetLogic, replacementLogic);

// Also change min-w-[50px] to min-w-[30px] globally just in case it breaks "No" columns
code = code.replace(/min-w-\[50px\]/g, 'min-w-[30px]');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Removed hardcoded widths!");
