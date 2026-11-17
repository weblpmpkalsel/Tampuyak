import fs from 'fs';

const path = 'src/enterprise/workspace/preview/KspPreviewWorkspace.tsx';
let code = fs.readFileSync(path, 'utf-8');

const oldActionBar = `            {/* Action Bar */}
            <div className="flex gap-2">
              <button onClick={() => window.print()} disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}\`}>
                <Printer className="w-4 h-4" /> Print Browser
              </button>
              <button disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent'}\`}>
                <FileText className="w-4 h-4" /> Export PDF
              </button>
              <button disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent'}\`}>
                <Download className="w-4 h-4" /> Export DOCX
              </button>
            </div>`;

const newActionBar = `            {/* Action Bar */}
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm">
                <Printer className="w-4 h-4" /> Print Browser
              </button>
              <button onClick={() => !isReady && setShowValidationDrawer(true)} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'}\`}>
                <FileText className="w-4 h-4" /> Export PDF
              </button>
              <button onClick={() => !isReady && setShowValidationDrawer(true)} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'}\`}>
                <Download className="w-4 h-4" /> Export DOCX
              </button>
            </div>`;

code = code.replace(oldActionBar, newActionBar);
fs.writeFileSync(path, code);
