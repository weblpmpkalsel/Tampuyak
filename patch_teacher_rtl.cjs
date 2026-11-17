const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherRtlDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add TRACKING_ACTIVE, FOLLOW_UP_REVIEW, TRACKING_COMPLETED to Teacher RTL status display
code = code.replace(
  "ap.status === ActionPlanStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :",
  `ap.status === ActionPlanStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : 
                      ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'bg-amber-100 text-amber-800' : 
                      ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'bg-indigo-100 text-indigo-800' : 
                      ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'bg-emerald-100 text-emerald-800' :`
);

code = code.replace(
  "ap.status === ActionPlanStatus.IN_PROGRESS ? 'Sedang Berjalan' :",
  `ap.status === ActionPlanStatus.IN_PROGRESS ? 'Sedang Berjalan' : 
                     ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'Tracking Aktif' : 
                     ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'Menunggu Review' : 
                     ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'Tracking Selesai' :`
);

// We need to add state for adding Tracking Log
code = code.replace(
  "const [evidenceDesc, setEvidenceDesc] = useState('');",
  `const [evidenceDesc, setEvidenceDesc] = useState('');
  
  const [addingLogApId, setAddingLogApId] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [logEvidenceUrl, setLogEvidenceUrl] = useState('');`
);

// We need to add handleUpdateTracking
code = code.replace(
  "const handleUpdateStatus = async () => {",
  `const handleUpdateTracking = async () => {
    if (!followUp || !addingLogApId) return;
    try {
      const updated = applicationService.updateTracking({
        followUp,
        actionPlanId: addingLogApId,
        notes: logNotes,
        evidenceUrl: logEvidenceUrl
      });
      const saved = await mockFollowUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setAddingLogApId(null);
      setLogNotes('');
      setLogEvidenceUrl('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdateStatus = async () => {`
);

// Update Aksi buttons
const replaceAksi = `
                  <h5 className="font-bold text-sm text-slate-700 mb-2">Aksi</h5>
                  <div className="space-y-3">
                    {[ActionPlanStatus.NOT_STARTED, ActionPlanStatus.IN_PROGRESS, ActionPlanStatus.REVISION_NEEDED].includes(ap.status) && (
                      <>
                        <button 
                          onClick={() => {
                            setUpdatingApId(ap.id);
                            setStatus(ap.status);
                            setTeacherNotes(ap.teacherNotes || '');
                          }}
                          className="w-full px-4 py-2 bg-white border border-teal-200 text-teal-700 font-bold rounded-lg hover:bg-teal-50 transition-colors text-sm"
                        >
                          Perbarui Progress
                        </button>
                        <button 
                          onClick={() => setUploadingApId(ap.id)}
                          className="w-full px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-sm hover:bg-teal-700 transition-colors text-sm flex justify-center items-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Unggah Bukti Pelaksanaan
                        </button>
                      </>
                    )}
                    
                    {[ActionPlanStatus.TRACKING_ACTIVE, ActionPlanStatus.FOLLOW_UP_REVIEW].includes(ap.status) && (
                      <button 
                        onClick={() => setAddingLogApId(ap.id)}
                        className="w-full px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-lg hover:bg-amber-100 transition-colors text-sm"
                      >
                        Tambah Progres Tracking
                      </button>
                    )}
                  </div>
`;

code = code.replace(
  /<h5 className="font-bold text-sm text-slate-700 mb-2">Aksi<\/h5>[\s\S]*?<\/div>\n                <\/div>/,
  replaceAksi + "\n                </div>"
);

// Display Tracking logs
const trackingLogsRender = `
                  {ap.trackingLogs && ap.trackingLogs.length > 0 && (
                    <div className="mt-6">
                      <span className="font-bold text-slate-700 text-sm mb-4 block">Log Tracking:</span>
                      <div className="space-y-3">
                        {ap.trackingLogs.map(log => (
                          <div key={log.id} className={\`p-4 rounded-xl border \${log.type === 'SUPERVISOR_MONITORING' ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}\`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={\`text-xs font-bold \${log.type === 'SUPERVISOR_MONITORING' ? 'text-indigo-800' : 'text-emerald-800'}\`}>
                                {log.type === 'SUPERVISOR_MONITORING' ? 'Catatan Supervisor' : 'Progres Anda'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">{new Date(log.date).toLocaleDateString('id-ID')}</span>
                            </div>
                            <p className="text-sm text-slate-700">{log.notes}</p>
                            {log.evidenceUrl && (
                              <a href={log.evidenceUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-blue-600 hover:underline">
                                Lihat Evidence Tambahan
                              </a>
                            )}
                            {log.nextReviewDate && (
                              <div className="mt-2 text-xs text-amber-700 font-bold bg-amber-100/50 p-2 rounded border border-amber-200">
                                Jadwal Review Berikutnya: {new Date(log.nextReviewDate).toLocaleDateString('id-ID')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
`;

code = code.replace(
  "                  {ap.evidences && ap.evidences.length > 0 && (",
  trackingLogsRender + "\n                  {ap.evidences && ap.evidences.length > 0 && ("
);

// Add Add Tracking Log Modal
const addLogModal = `
      {/* Add Tracking Log Modal */}
      {addingLogApId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-amber-50">
              <h2 className="text-xl font-bold text-slate-800">Tambah Progres Tracking</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Refleksi / Progres Lanjutan</label>
                <textarea
                  value={logNotes}
                  onChange={e => setLogNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500"
                  rows={4}
                  placeholder="Ceritakan progres implementasi lanjutan Anda..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tautan Bukti Tambahan (Opsional)</label>
                <input
                  type="url"
                  value={logEvidenceUrl}
                  onChange={e => setLogEvidenceUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500"
                  placeholder="https://docs.google.com/..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setAddingLogApId(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateTracking}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Progres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  "    </div>\n  );\n};",
  addLogModal + "\n    </div>\n  );\n};"
);

fs.writeFileSync(file, code);
