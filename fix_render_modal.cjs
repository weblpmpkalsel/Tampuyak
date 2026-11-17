const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const renderValidationModal = `
      {showPrintValidation && printValidation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-rose-50 p-6 border-b border-rose-100 flex items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-rose-900">Validasi Pra-Cetak Gagal</h3>
                <p className="text-rose-700 text-sm mt-1">Ditemukan data mandatory yang belum lengkap.</p>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {printValidation.map((issue, idx) => (
                  <div key={idx} className="flex p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <span className="font-bold text-slate-700 w-32 shrink-0">{issue.type}</span>
                    <span className="text-slate-600">{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowPrintValidation(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2 rounded-lg transition-colors">
                Tutup & Perbaiki
              </button>
            </div>
          </div>
        </div>
      )}
`;

if (!code.includes("showPrintValidation && printValidation")) {
  const styleInjectionIndex = code.lastIndexOf('<style>{`');
  if (styleInjectionIndex !== -1) {
    code = code.slice(0, styleInjectionIndex) + renderValidationModal + '\\n      ' + code.slice(styleInjectionIndex);
    fs.writeFileSync('src/Tampuyak.tsx', code);
    console.log('Injected printValidation modal');
  } else {
    console.log('Could not find style to inject before');
  }
} else {
  console.log('Already injected');
}
