const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldPageHelp = `const PageHelp = ({ title, description, importance, nextStep }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors border border-indigo-100">
          <HelpCircle className="w-4 h-4" /> Bantuan & Panduan
        </button>
      ) : (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Apa ini?</h4>
                <p>{description}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Mengapa ini penting?</h4>
                <p>{importance}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Langkah selanjutnya</h4>
                <p>{nextStep}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`;

const newPageHelp = `const PageHelp = ({ title, description, importance, nextStep, regulation, time, checklist, mistakes }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors border border-indigo-100">
          <HelpCircle className="w-4 h-4" /> Bantuan & Panduan
        </button>
      ) : (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Apa ini?</h4>
                    <p>{description}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Mengapa ini penting?</h4>
                    <p>{importance}</p>
                  </div>
                  {regulation && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1"><FileText className="w-4 h-4 text-indigo-500"/> Referensi Regulasi</h4>
                      <p className="italic text-slate-600 bg-white/50 p-2 rounded-lg">{regulation}</p>
                    </div>
                  )}
                  {time && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1"><Clock className="w-4 h-4 text-indigo-500"/> Estimasi Waktu</h4>
                      <p>{time}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {checklist && checklist.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-xl border border-indigo-100/50">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Ceklis Persiapan</h4>
                      <ul className="space-y-1">
                        {checklist.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {mistakes && mistakes.length > 0 && (
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                      <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-rose-500"/> Kesalahan Umum</h4>
                      <ul className="space-y-1">
                        {mistakes.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-rose-800">
                            <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Langkah selanjutnya</h4>
                    <p>{nextStep}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`;

if (content.includes(oldPageHelp)) {
  content = content.replace(oldPageHelp, newPageHelp);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
