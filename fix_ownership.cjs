const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionScheduling.tsx', 'utf8');

// Update import to include OwnershipGuard
content = content.replace(
  "import { PermissionGuard } from '../auth/SupervisionGuards';",
  "import { PermissionGuard, OwnershipGuard } from '../auth/SupervisionGuards';"
);

const oldButtons = `                      <div className="flex gap-2">
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
                        {schedule.status === SupervisionStatus.POST_OBSERVATION && (
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
                        )}
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          {schedule.status === SupervisionStatus.SCHEDULED || schedule.status === SupervisionStatus.PRE_OBSERVATION || schedule.status === SupervisionStatus.POST_OBSERVATION || schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP ? 'Ubah Jadwal' : 'Atur Jadwal'}
                        </button>
                      </div>`;

const newButtons = `                      <div className="flex gap-2">
                        {schedule.status === SupervisionStatus.SCHEDULED && (
                          <OwnershipGuard resourceOwnerId={schedule.supervisor?.id || ''}>
                            <PermissionGuard requiredPermission="APPROVE_PRE_OBSERVATION">
                              <button
                                onClick={() => setStartingPreObsId(schedule.id)}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                              >
                                Mulai Pra Observasi
                              </button>
                            </PermissionGuard>
                          </OwnershipGuard>
                        )}
                        {schedule.status === SupervisionStatus.PRE_OBSERVATION && (
                          <OwnershipGuard resourceOwnerId={schedule.supervisor?.id || ''}>
                            <PermissionGuard requiredPermission="CONDUCT_OBSERVATION">
                              <button
                                onClick={() => onStartObservation && onStartObservation(schedule.id)}
                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
                              >
                                Mulai Observasi
                              </button>
                            </PermissionGuard>
                          </OwnershipGuard>
                        )}
                        {schedule.status === SupervisionStatus.POST_OBSERVATION && (
                          <OwnershipGuard resourceOwnerId={schedule.supervisor?.id || ''}>
                            <PermissionGuard requiredPermission="CONDUCT_POST_OBSERVATION">
                              <button
                                onClick={() => onStartPostObservation && onStartPostObservation(schedule.id)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                              >
                                Tindak Lanjut & Coaching
                              </button>
                            </PermissionGuard>
                          </OwnershipGuard>
                        )}
                        {schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP && (
                          <OwnershipGuard resourceOwnerId={schedule.supervisor?.id || ''}>
                            <PermissionGuard requiredPermission="MANAGE_RTL">
                              <button
                                onClick={() => onStartRtl && onStartRtl(schedule.id)}
                                className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
                              >
                                Kelola RTL
                              </button>
                            </PermissionGuard>
                          </OwnershipGuard>
                        )}
                        <PermissionGuard requiredPermission="MANAGE_SCHEDULE">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            {schedule.status === SupervisionStatus.SCHEDULED || schedule.status === SupervisionStatus.PRE_OBSERVATION || schedule.status === SupervisionStatus.POST_OBSERVATION || schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP ? 'Ubah Jadwal' : 'Atur Jadwal'}
                          </button>
                        </PermissionGuard>
                      </div>`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync('src/modules/supervision/ui/SupervisionScheduling.tsx', content);
