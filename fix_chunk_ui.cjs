const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldUI = `            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
              Pilih File
            </label>`;

const newUI = `            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={isImporting} />
            {isImporting ? (
              <div className="w-full max-w-xs mx-auto">
                <div className="flex justify-between text-xs text-slate-500 mb-1 font-bold">
                  <span>Memproses...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: \`\${importProgress}%\` }}></div>
                </div>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                Pilih File
              </label>
            )}`;

code = code.replace(oldUI, newUI);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed chunk import UI');
