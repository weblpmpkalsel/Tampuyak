import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const kspLockedGuidance = `
const KSPStudioView = ({ navigateToView }: any) => {
  const { settings, showSuccess } = useApp();
  
  if (!settings?.diagnosis?.isLocked) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center text-sm font-bold text-slate-500 mb-6">
          <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigateToView("dokumenPerencanaan")}>
             <ChevronLeft className="w-4 h-4 mr-1 inline" /> Kembali ke Dokumen Sekolah
          </span>
        </div>
        <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-slate-200">
           <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock className="w-10 h-10" />
           </div>
           <h2 className="text-3xl font-black text-slate-800 mb-4">Langkah ini belum tersedia.</h2>
           <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-lg mx-auto mb-8 text-left">
             <p className="font-bold text-amber-800 mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" /> Mengapa?</p>
             <p className="text-amber-700">Penyusunan Kurikulum Satuan Pendidikan (KSP) membutuhkan hasil dari <b>Analisis Karakteristik & Prioritas</b> sekolah agar kurikulum sesuai dengan kebutuhan spesifik murid.</p>
           </div>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigateToView("diagnosis")}>
             Buka Analisis Prioritas
           </Button>
        </div>
      </div>
    );
  }
`;

code = code.replace(/const KSPStudioView = \(\{ navigateToView \}: any\) => {[\s\S]*?const { settings } = useApp\(\);/, kspLockedGuidance);

fs.writeFileSync('src/Tampuyak.tsx', code);
