const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?\{followUp\.actionPlans\.map\(ap => \([\s\S]*?\}\)\]\}[\s\S]*?<\/div>\n        \)\}/m;

// wait, it is easier to just replace from <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> down to </div>\n        )}
// Let's check lines 185 to 270

const strToReplace = code.substring(
  code.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">'),
  code.indexOf(')}', code.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">') + 2000) + 2
);

const newContent = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {followUp.actionPlans.map(ap => (
              <div key={ap.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
                <div className="absolute top-5 right-5">
                  <span className={\`px-2 py-1 text-xs font-bold rounded-md 
                    \${ap.status === ActionPlanStatus.VERIFIED ? 'bg-indigo-100 text-indigo-800' : 
                      ap.status === ActionPlanStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800' : 
                      ap.status === ActionPlanStatus.REVISION_NEEDED ? 'bg-rose-100 text-rose-800' : 
                      ap.status === ActionPlanStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : 
                      'bg-slate-100 text-slate-600'}
                  \`}>
                    {ap.status === ActionPlanStatus.VERIFIED ? 'Terverifikasi' : 
                     ap.status === ActionPlanStatus.COMPLETED ? 'Selesai (Menunggu Verifikasi)' : 
                     ap.status === ActionPlanStatus.REVISION_NEEDED ? 'Perlu Perbaikan' : 
                     ap.status === ActionPlanStatus.IN_PROGRESS ? 'Sedang Berjalan' : 
                     'Belum Dimulai'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 pr-24">{ap.title}</h4>
                <p className="text-xs text-slate-500 mb-2 font-medium">{ap.category}</p>
                <p className="text-sm text-slate-600 mb-4">{ap.description}</p>
                
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm border border-slate-100">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center text-slate-600">
                      <Target className="w-4 h-4 mr-2 text-teal-600" />
                      <div>
                        <span className="block text-xs text-slate-400">Target</span>
                        <span className="font-bold truncate">{ap.target}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                      <div>
                        <span className="block text-xs text-slate-400">Deadline</span>
                        <span className="font-bold">{new Date(ap.targetDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600 border-t border-slate-200 pt-2 mt-2">
                    <BarChart2 className="w-4 h-4 mr-2 text-teal-600" />
                    <div>
                      <span className="text-xs text-slate-400 mr-2">Prioritas:</span>
                      <span className={\`font-bold \${ap.priority === RecommendationPriority.HIGH ? 'text-red-600' : ap.priority === RecommendationPriority.MEDIUM ? 'text-amber-600' : 'text-emerald-600'}\`}>{ap.priority}</span>
                    </div>
                  </div>
                  {ap.expectedEvidence && (
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="font-bold">Evidence:</span> {ap.expectedEvidence}
                    </div>
                  )}
                </div>

                {ap.status === ActionPlanStatus.COMPLETED && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleVerifyRtl(ap.id, true)}
                      className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Verifikasi
                    </button>
                    <button 
                      onClick={() => handleVerifyRtl(ap.id, false)}
                      className="flex-1 py-2 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors text-sm"
                    >
                      Kembalikan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}`;

code = code.replace(strToReplace, newContent);

fs.writeFileSync(file, code);
