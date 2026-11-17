const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexRKAS = /const renderRKAS = \(\) => \([\s\S]*?\n  \);\n/s;
const newRenderRKAS = `const renderRKAS = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-emerald-900 text-lg">Rencana Anggaran (RKAS) - Tahun {activeYear}</h3>
          <p className="text-emerald-700 text-sm">Alokasi dana untuk implementasi RKT.</p>
        </div>
      </div>
      
      {currentYearPlan.rkas.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada rincian anggaran RKAS untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.rkas.map((item: any, idx: number) => {
             const parentRkt = currentYearPlan.rkt.find((r:any) => r.id === item.rktActivityId);
             const rkjmObj = planning.objectives.find((o:any) => o.id === parentRkt?.rkjmObjectiveId);
             return (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                     <div>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Program Induk: {parentRkt?.activity} ({rkjmObj?.strategicObjective})</span>
                        <h4 className="font-bold text-slate-800 text-lg">{item.budgetItem}</h4>
                        <p className="text-sm text-slate-500 font-medium">Kategori: {item.budgetCategory || 'Operasional'}</p>
                     </div>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase">{item.fundingStatus || item.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-3 mb-4">
                    <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume</span><span className="font-medium text-sm text-slate-800">{item.quantity || 1} {item.unit || 'Paket'}</span></div>
                    <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Satuan</span><span className="font-medium text-sm text-slate-800">Rp {(item.price || item.amount).toLocaleString('id-ID')}</span></div>
                    <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kode Rekening</span><span className="font-medium text-sm text-slate-800">{item.accountCode}</span></div>
                    <div><span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Anggaran</span><span className="font-bold text-lg text-emerald-700">Rp {(item.total || item.amount).toLocaleString('id-ID')}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <span className="flex items-center"><Database className="w-3.5 h-3.5 mr-1 text-slate-400" /> Sumber: <strong>{item.fundingSource}</strong></span>
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Waktu: <strong>{item.implementationMonth || 'Semester 1'}</strong></span>
                    <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> PJ: <strong>{item.responsiblePerson || 'Bendahara'}</strong></span>
                    <span className="flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Prioritas: <strong>{item.priorityLevel || 'Tinggi'}</strong></span>
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );\n`;

code = code.replace(regexRKAS, newRenderRKAS);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed renderRKAS');
