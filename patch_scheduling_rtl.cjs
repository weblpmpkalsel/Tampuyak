const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "export const SupervisionScheduling = ({ plan, onStartObservation, onStartPostObservation }: { plan: SupervisionPlan, onStartObservation?: (id: string) => void, onStartPostObservation?: (id: string) => void }) => {",
  "export const SupervisionScheduling = ({ plan, onStartObservation, onStartPostObservation, onStartRtl }: { plan: SupervisionPlan, onStartObservation?: (id: string) => void, onStartPostObservation?: (id: string) => void, onStartRtl?: (id: string) => void }) => {"
);

code = code.replace(
  `{schedule.status === SupervisionStatus.POST_OBSERVATION ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      PASCA OBSERVASI
                    </span>
                  ) :`,
  `{schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP ? (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      TINDAK LANJUT
                    </span>
                  ) : schedule.status === SupervisionStatus.POST_OBSERVATION ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      PASCA OBSERVASI
                    </span>
                  ) :`
);

code = code.replace(
  `                        {schedule.status === SupervisionStatus.POST_OBSERVATION && (
                          <button
                            onClick={() => onStartPostObservation && onStartPostObservation(schedule.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            Tindak Lanjut & Coaching
                          </button>
                        )}`,
  `                        {schedule.status === SupervisionStatus.POST_OBSERVATION && (
                          <button
                            onClick={() => onStartPostObservation && onStartPostObservation(schedule.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            Tindak Lanjut & Coaching
                          </button>
                        )}
                        {schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP && (
                          <button
                            onClick={() => onStartRtl && onStartRtl(schedule.id)}
                            className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
                          >
                            Kelola RTL
                          </button>
                        )}`
);

code = code.replace(
  "{schedule.status === SupervisionStatus.SCHEDULED || schedule.status === SupervisionStatus.PRE_OBSERVATION || schedule.status === SupervisionStatus.POST_OBSERVATION ? 'Ubah Jadwal' : 'Atur Jadwal'}",
  "{schedule.status === SupervisionStatus.SCHEDULED || schedule.status === SupervisionStatus.PRE_OBSERVATION || schedule.status === SupervisionStatus.POST_OBSERVATION || schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP ? 'Ubah Jadwal' : 'Atur Jadwal'}"
);

fs.writeFileSync(file, code);
