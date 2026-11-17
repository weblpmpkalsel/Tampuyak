const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const search = `        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-emerald-400 rounded animate-ping opacity-20"></div>
          <Sparkles className="w-10 h-10" />
        </div>`;

const replace = `        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-emerald-400 rounded animate-ping opacity-20"></div>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-12 h-12 object-contain drop-shadow-sm" />
        </div>`;

code = code.replace(search, replace);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
