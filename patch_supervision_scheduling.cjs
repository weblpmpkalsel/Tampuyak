const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [duration, setDuration] = useState('90');",
  `const [duration, setDuration] = useState('90');
  const [startingPreObsId, setStartingPreObsId] = useState<string | null>(null);
  const [preObsNotes, setPreObsNotes] = useState('');`
);

code = code.replace(
  "const allScheduled = updatedSchedules.every(s => s.status !== SupervisionStatus.DRAFT && s.status !== SupervisionStatus.READY_FOR_SCHEDULING);",
  `const handleStartPreObservation = async (schedule: SupervisionSchedule) => {
    try {
      const updatedSchedule = applicationService.startPreObservation({
        schedule,
        notes: preObsNotes
      });
      await mockScheduleRepo.update(updatedSchedule.id, updatedSchedule);
      
      const updatedSchedules = await mockScheduleRepo.findByPlanId(plan.id);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      setStartingPreObsId(null);
      setPreObsNotes('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const allScheduled = updatedSchedules.every(s => s.status !== SupervisionStatus.DRAFT && s.status !== SupervisionStatus.READY_FOR_SCHEDULING);`
);

code = code.replace(
  "{schedule.status === SupervisionStatus.SCHEDULED ? (",
  `{schedule.status === SupervisionStatus.PRE_OBSERVATION ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      PRA OBSERVASI
                    </span>
                  ) : schedule.status === SupervisionStatus.SCHEDULED ? (`
);

code = code.replace(
  "<button\n                        onClick={() => handleEdit(schedule)}\n                        className=\"px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors\"\n                      >\n                        {schedule.status === SupervisionStatus.SCHEDULED ? 'Ubah Jadwal' : 'Atur Jadwal'}\n                      </button>",
  `<div className="flex gap-2">
                        {schedule.status === SupervisionStatus.SCHEDULED && (
                          <button
                            onClick={() => setStartingPreObsId(schedule.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                          >
                            Mulai Pra Observasi
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          {schedule.status === SupervisionStatus.SCHEDULED || schedule.status === SupervisionStatus.PRE_OBSERVATION ? 'Ubah Jadwal' : 'Atur Jadwal'}
                        </button>
                      </div>`
);

const modalCode = `
      {startingPreObsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                Mulai Pra Observasi
              </h2>
              <button onClick={() => setStartingPreObsId(null)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Tahap Pra Observasi akan dimulai. Guru sasaran akan menerima notifikasi untuk mengunggah Modul Ajar dan mengisi Refleksi Awal.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Awal (Opsional)</label>
                <textarea
                  value={preObsNotes}
                  onChange={e => setPreObsNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Berikan instruksi atau catatan khusus kepada guru..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setStartingPreObsId(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const s = schedules.find(x => x.id === startingPreObsId);
                    if (s) handleStartPreObservation(s);
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm rounded-xl transition-colors"
                >
                  Kirim ke Guru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  "</div>\n    </div>\n  );\n};",
  "</div>\n" + modalCode + "\n    </div>\n  );\n};"
);

fs.writeFileSync(file, code);
