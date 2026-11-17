const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<span className=\{\`px-2 py-1 text-xs font-bold rounded-md [\s\S]*?<\/span>/m;

const replacement = `<span className={\`px-2 py-1 text-xs font-bold rounded-md 
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
                  </span>`;

code = code.replace(regex, replacement);

const regex2 = /<h4 className="font-bold text-slate-800 mb-2 pr-24">\{ap\.title\}<\/h4>[\s\S]*?<\/div>/m;
const replacement2 = `<h4 className="font-bold text-slate-800 pr-24">{ap.title}</h4>
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
                )}`;

code = code.replace(regex2, replacement2);

fs.writeFileSync(file, code);
