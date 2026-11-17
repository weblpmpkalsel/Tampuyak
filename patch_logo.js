const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `<div className="bg-blue-100 p-3 rounded text-blue-700">
                         <UploadCloud className="w-6 h-6" />
                      </div>`;

const replacement = `<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-10 h-10 object-contain drop-shadow-sm" />`;

code = code.replace(target, replacement);

fs.writeFileSync('src/Tampuyak.tsx', code);
