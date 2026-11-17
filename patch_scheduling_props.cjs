const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "export const SupervisionScheduling = ({ plan }: { plan: SupervisionPlan }) => {",
  "export const SupervisionScheduling = ({ plan, onStartObservation }: { plan: SupervisionPlan, onStartObservation?: (id: string) => void }) => {"
);

code = code.replace(
  `                      <div className="flex gap-2">
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
                      </div>`,
  `                      <div className="flex gap-2">
                        {schedule.status === SupervisionStatus.SCHEDULED && (
                          <button
                            onClick={() => setStartingPreObsId(schedule.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                          >
                            Mulai Pra Observasi
                          </button>
                        )}
                        {schedule.status === SupervisionStatus.PRE_OBSERVATION && (
                          <button
                            onClick={() => onStartObservation && onStartObservation(schedule.id)}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            Mulai Observasi
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

fs.writeFileSync(file, code);
