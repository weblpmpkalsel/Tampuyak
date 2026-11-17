const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const newStr = '<h3 className="font-bold text-lg text-slate-800">{cov.chapter}</h3>' +
'                               <div className="mt-2 space-y-1">' +
'                                 <p className="text-xs text-slate-500 flex items-center">' +
'                                   <Database className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Sumber:</span> {cov.sources.join(", ")}' +
'                                 </p>' +
'                                 <p className="text-xs text-slate-500 flex items-center">' +
'                                   <Library className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Modul:</span> {cov.module}' +
'                                 </p>' +
'                                 <p className="text-xs text-slate-500 flex items-center">' +
'                                   <Milestone className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Tahap:</span> {cov.stage}' +
'                                 </p>' +
'                                 <p className="text-xs text-slate-500 flex items-center">' +
'                                   <ShieldCheck className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Regulasi:</span> {cov.regulation}' +
'                                 </p>' +
'                               </div>';

const startIdx = code.indexOf('<h3 className="font-bold text-lg text-slate-800">{cov.chapter}</h3>');
if (startIdx !== -1) {
    const endStr = '</p>';
    const endIdx = code.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        const replaceLen = (endIdx + endStr.length) - startIdx;
        code = code.substring(0, startIdx) + newStr + code.substring(startIdx + replaceLen);
        fs.writeFileSync('src/Tampuyak.tsx', code);
        console.log("Updated via substring");
    }
}
