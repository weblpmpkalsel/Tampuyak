const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

if(!code.includes('HelpCircle')) {
    code = code.replace(/} from "lucide-react";/, '  HelpCircle,\n  Info,\n} from "lucide-react";');
}

const pageHelpCode = `const PageHelp = ({ title, description, importance, nextStep }: any) => {
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

code = code.replace(/const BerandaView = \(/, pageHelpCode + '\nconst BerandaView = (');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
