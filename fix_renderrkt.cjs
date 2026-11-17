const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexRKT = /const renderRKT = \(\) => \([\s\S]*?\n  \);\n/s;
const newRenderRKT = `const renderRKT = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Rencana Kerja Tahunan (RKT) - Tahun {activeYear}</h3>
          <p className="text-blue-700 text-sm">Diturunkan secara otomatis dari RKJM.</p>
        </div>
      </div>
      
      {currentYearPlan.rkt.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada turunan program RKT untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.rkt.map((act: any, idx: number) => {
             const parentObj = planning.objectives.find((o:any) => o.id === act.rkjmObjectiveId);
             return (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                     <div>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Induk RKJM: {parentObj?.strategicObjective}</span>
                        <h4 className="font-bold text-slate-800 text-lg">{act.activity}</h4>
                        <p className="text-sm text-slate-500">Sub-Kegiatan: {act.subActivity || act.activity}</p>
                     </div>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase">{act.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target</span><span className="font-medium text-sm text-slate-800">{act.successTarget || act.target}</span></div>
                    <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jadwal</span><span className="font-medium text-sm text-slate-800">{act.schedule || 'Semester 1'}</span></div>
                    <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Output</span><span className="font-medium text-sm text-slate-800">{act.output || '-'}</span></div>
                    <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outcome</span><span className="font-medium text-sm text-slate-800">{act.outcome || '-'}</span></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                     <div className="space-y-2">
                        <div className="flex items-start gap-2"><Users className="w-4 h-4 text-slate-400 shrink-0" /><span><strong>Penanggung Jawab:</strong> {act.personResponsible || parentObj?.responsibleUnit}</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /><span><strong>Bukti:</strong> {act.evidence || 'Dokumentasi'}</span></div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span><strong>Risiko:</strong> {act.risk || '-'}</span></div>
                        <div className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /><span><strong>Mitigasi:</strong> {act.mitigation || '-'}</span></div>
                     </div>
                  </div>
                  <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 p-2 rounded inline-block">
                    Relasi SNP: {act.relatedSnp || parentObj?.associatedSnp}
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );\n`;

code = code.replace(regexRKT, newRenderRKT);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed renderRKT');
