const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexMonitoring = /const renderMonitoring = \(\) => \([\s\S]*?\n  \);\n/s;
const newRenderMonitoring = `const renderMonitoring = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* IMPLEMENTATION SECTION */}
      <div>
        <div className="flex justify-between items-center bg-cyan-50 border border-cyan-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-cyan-900 text-lg">Implementasi (Pelaksanaan) - Tahun {activeYear}</h3>
            <p className="text-cyan-700 text-sm">Pelaksanaan dari kegiatan RKAS.</p>
          </div>
        </div>
        
        {(!currentYearPlan.implementation || currentYearPlan.implementation.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Belum ada data implementasi untuk Tahun {activeYear}.</p>
           </div>
        ) : (
           <div className="space-y-4">
             {currentYearPlan.implementation.map((impl: any, idx: number) => {
               const parentRkas = currentYearPlan.rkas.find((r:any) => r.id === impl.rkasId);
               return (
                 <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-cyan-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                       <div>
                          <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Anggaran RKAS: {parentRkas?.budgetItem}</span>
                          <h4 className="font-bold text-slate-800 text-lg">Pelaksanaan: {impl.progress}</h4>
                       </div>
                       <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold uppercase">{impl.completionPercentage}% Selesai</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-lg mb-3">
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biaya Aktual</span><span className="font-medium text-sm text-slate-800">Rp {(impl.actualCost || 0).toLocaleString('id-ID')}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Selesai</span><span className="font-medium text-sm text-slate-800">{impl.completionDate}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Penanggung Jawab</span><span className="font-medium text-sm text-slate-800">{impl.responsibleOfficer}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bukti/Foto</span><span className="font-medium text-sm text-blue-600 underline cursor-pointer">{impl.evidence}</span></div>
                    </div>
                    <p className="text-sm text-slate-600"><strong className="text-slate-800">Catatan Pelaksanaan:</strong> {impl.notes}</p>
                 </div>
               )
             })}
           </div>
        )}
      </div>

      {/* MONITORING SECTION */}
      <div>
        <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-amber-900 text-lg">Monitoring - Tahun {activeYear}</h3>
            <p className="text-amber-700 text-sm">Pengawasan capaian pelaksanaan program.</p>
          </div>
        </div>
        
        {(!currentYearPlan.monitoring || currentYearPlan.monitoring.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Belum ada data monitoring untuk Tahun {activeYear}.</p>
           </div>
        ) : (
           <div className="space-y-4">
             {currentYearPlan.monitoring.map((mon: any, idx: number) => {
               const parentRkas = currentYearPlan.rkas.find((r:any) => r.id === mon.rkasId);
               return (
                 <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                       <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Implementasi RKAS: {parentRkas?.budgetItem}</span>
                          <h4 className="font-bold text-slate-800 text-lg">Status: {mon.performanceStatus}</h4>
                       </div>
                       <span className={\`px-3 py-1 rounded-full text-xs font-bold uppercase \${mon.trafficLight === 'Hijau' ? 'bg-emerald-100 text-emerald-800' : mon.trafficLight === 'Kuning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}\`}>Indikator: {mon.trafficLight}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg mb-3">
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian</span><span className="font-medium text-sm text-slate-800">{mon.achievement}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Variansi (Kendala)</span><span className="font-medium text-sm text-slate-800">{mon.variance}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rekomendasi</span><span className="font-medium text-sm text-slate-800">{mon.recommendation}</span></div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><strong className="text-slate-800">Tindak Lanjut:</strong> {mon.followUpAction}</p>
                      <p><strong className="text-slate-800">Catatan Supervisor:</strong> {mon.supervisorNotes}</p>
                    </div>
                 </div>
               )
             })}
           </div>
        )}
      </div>

      {/* EVALUATION SECTION */}
      <div>
        <div className="flex justify-between items-center bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-purple-900 text-lg">Evaluasi - Tahun {activeYear}</h3>
            <p className="text-purple-700 text-sm">Kesimpulan capaian target strategis tahunan RKJM.</p>
          </div>
        </div>
        
        {(!currentYearPlan.evaluation || currentYearPlan.evaluation.length === 0) ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Belum ada data evaluasi untuk Tahun {activeYear}.</p>
           </div>
        ) : (
           <div className="space-y-4">
             {currentYearPlan.evaluation.map((ev: any, idx: number) => {
               const parentObj = planning.objectives.find((o:any) => o.id === ev.objectiveId);
               return (
                 <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                       <div>
                          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Induk RKJM: {parentObj?.strategicObjective}</span>
                          <h4 className="font-bold text-slate-800 text-lg">Hasil: {ev.status}</h4>
                       </div>
                       <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">{ev.programEffectiveness}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-lg mb-3">
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian Kinerja</span><span className="font-medium text-sm text-slate-800">{ev.achievement}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi Anggaran</span><span className="font-medium text-sm text-slate-800">{ev.budgetRealization}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lesson Learned</span><span className="font-medium text-sm text-slate-800">{ev.lessonsLearned}</span></div>
                      <div><span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rencana Perbaikan</span><span className="font-medium text-sm text-slate-800">{ev.improvementPlan}</span></div>
                    </div>
                    <div className="text-sm text-slate-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <strong className="text-slate-800 block mb-1">Rekomendasi Tahun Berikutnya:</strong> 
                      {ev.nextYearRecommendation}
                    </div>
                 </div>
               )
             })}
           </div>
        )}
      </div>

    </div>
  );\n`;

code = code.replace(regexMonitoring, newRenderMonitoring);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed renderMonitoring');
