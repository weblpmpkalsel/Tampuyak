const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldVisual = `return (
      <div className="space-y-6">
        <PageHelp title="Identitas Visual" description="Pusat pengaturan aset visual resmi sekolah. Diunggah sekali, otomatis digunakan di seluruh dokumen cetak (RKJM, RKT, RKAS, KSP)." importance="Memastikan seluruh dokumen resmi memiliki kop, stempel, dan tanda tangan yang sah dan seragam." nextStep="Unggah logo sekolah dan stempel resmi." />
        
        <Card title="Logo & Profil Visual"`;
        
const newVisual = `return (
      <div className="space-y-6">
        <PageHelp title="Identitas Visual" description="Pusat pengaturan aset visual resmi sekolah. Diunggah sekali, otomatis digunakan di seluruh dokumen cetak (RKJM, RKT, RKAS, KSP)." importance="Memastikan seluruh dokumen resmi memiliki kop, stempel, dan tanda tangan yang sah dan seragam." nextStep="Unggah logo sekolah dan stempel resmi." />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className={\`p-4 rounded-xl border \${visualIdentity.logoSekolah ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}\`}>
             <p className="text-xs font-bold uppercase mb-1">Logo Sekolah</p>
             <p className="text-sm font-medium flex items-center gap-2">{visualIdentity.logoSekolah ? <><CheckCircle2 className="w-4 h-4" /> Tersedia</> : <><XCircle className="w-4 h-4" /> Kosong</>}</p>
           </div>
           <div className={\`p-4 rounded-xl border \${visualIdentity.logoPemda ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}\`}>
             <p className="text-xs font-bold uppercase mb-1">Logo Pemda</p>
             <p className="text-sm font-medium flex items-center gap-2">{visualIdentity.logoPemda ? <><CheckCircle2 className="w-4 h-4" /> Tersedia</> : <><XCircle className="w-4 h-4 text-slate-400" /> Opsional</>}</p>
           </div>
           <div className={\`p-4 rounded-xl border \${visualIdentity.stempel ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}\`}>
             <p className="text-xs font-bold uppercase mb-1">Stempel</p>
             <p className="text-sm font-medium flex items-center gap-2">{visualIdentity.stempel ? <><CheckCircle2 className="w-4 h-4" /> Tersedia</> : <><AlertTriangle className="w-4 h-4" /> Dianjurkan</>}</p>
           </div>
           <div className={\`p-4 rounded-xl border \${visualIdentity.ttdKepalaSekolah ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}\`}>
             <p className="text-xs font-bold uppercase mb-1">Tanda Tangan</p>
             <p className="text-sm font-medium flex items-center gap-2">{visualIdentity.ttdKepalaSekolah ? <><CheckCircle2 className="w-4 h-4" /> Tersedia</> : <><AlertTriangle className="w-4 h-4" /> Dianjurkan</>}</p>
           </div>
        </div>

        <Card title="Logo & Profil Visual"`;

if (content.includes(oldVisual)) {
  content = content.replace(oldVisual, newVisual);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
