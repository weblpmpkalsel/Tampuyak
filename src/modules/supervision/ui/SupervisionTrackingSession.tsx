import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { 
  SupervisionSchedule, 
  ActionPlanStatus,
  FollowUp,
  ActionPlan,
  TrackingLog
} from '../types/SupervisionTypes';


interface Props {
  schedule: SupervisionSchedule;
  onClose: () => void;
}

export const SupervisionTrackingSession: React.FC<Props> = ({ schedule, onClose }) => {
  const { repositories } = useSupervision();
  const followUpRepo = repositories.getFollowUpRepository();
  const { applicationService } = useSupervision();
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [reviewingApId, setReviewingApId] = useState<string | null>(null);
  const [monitoringNotes, setMonitoringNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fu = await followUpRepo.findByScheduleId(schedule.id);
        setFollowUp(fu);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [schedule.id]);

  const handleStartTracking = async (actionPlanId: string) => {
    if (!followUp) return;
    try {
      const updated = applicationService.startTracking({ followUp, actionPlanId });
      const saved = await followUpRepo.update(updated.id, updated);
      setFollowUp(saved);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleScheduleReview = async () => {
    if (!followUp || !reviewingApId || !monitoringNotes || !nextReviewDate) {
      alert('Lengkapi catatan dan tanggal review.');
      return;
    }
    try {
      const updated = applicationService.scheduleFollowUpReview({ 
        followUp, 
        actionPlanId: reviewingApId,
        notes: monitoringNotes,
        nextReviewDate: new Date(nextReviewDate).getTime()
      });
      const saved = await followUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setReviewingApId(null);
      setMonitoringNotes('');
      setNextReviewDate('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleCompleteTracking = async (actionPlanId: string) => {
    if (!followUp) return;
    try {
      if (confirm('Selesaikan tracking untuk rencana tindak lanjut ini?')) {
        const updated = applicationService.completeTracking({ followUp, actionPlanId });
        const saved = await followUpRepo.update(updated.id, updated);
        setFollowUp(saved);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Memuat data tracking...</div>;
  }

  if (!followUp) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Belum ada data RTL/Tracking untuk jadwal ini.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold">Kembali</button>
      </div>
    );
  }

  const trackingPlans = followUp.actionPlans.filter(ap => 
    [ActionPlanStatus.VERIFIED, ActionPlanStatus.TRACKING_ACTIVE, ActionPlanStatus.FOLLOW_UP_REVIEW, ActionPlanStatus.TRACKING_COMPLETED].includes(ap.status)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="p-6 border-b border-slate-200 bg-indigo-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Pemantauan Peningkatan (Tracking)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {schedule.teacherSnapshot.name} &bull; {schedule.teacherSnapshot.subject}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {trackingPlans.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Belum ada RTL yang diverifikasi untuk ditracking.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trackingPlans.map(ap => (
              <div key={ap.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md mb-2 inline-block
                      ${ap.status === ActionPlanStatus.VERIFIED ? 'bg-indigo-100 text-indigo-800' : 
                        ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'bg-amber-100 text-amber-800' : 
                        ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'bg-blue-100 text-blue-800' : 
                        ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'bg-emerald-100 text-emerald-800' : 
                        'bg-slate-100 text-slate-600'}
                    `}>
                      {ap.status === ActionPlanStatus.VERIFIED ? 'Siap Ditracking' : 
                       ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'Tracking Aktif' : 
                       ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'Review Monitoring' : 
                       ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'Tracking Selesai' : 
                       ap.status}
                    </span>
                    <h4 className="font-bold text-lg text-slate-800">{ap.title}</h4>
                  </div>
                  
                  {/* Supervisor Actions based on status */}
                  <div className="flex gap-2">
                    {ap.status === ActionPlanStatus.VERIFIED && (
                      <button 
                        onClick={() => handleStartTracking(ap.id)}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Mulai Tracking
                      </button>
                    )}
                    {(ap.status === ActionPlanStatus.TRACKING_ACTIVE || ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW) && (
                      <>
                        <button 
                          onClick={() => setReviewingApId(ap.id)}
                          className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                        >
                          Monitoring & Review
                        </button>
                        <button 
                          onClick={() => handleCompleteTracking(ap.id)}
                          className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm"
                        >
                          Selesaikan Tracking
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h5 className="font-bold text-sm text-slate-700 mb-3">Log Peningkatan</h5>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {ap.trackingLogs && ap.trackingLogs.length > 0 ? ap.trackingLogs.map(log => (
                        <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {log.type === 'SUPERVISOR_MONITORING' ? <CheckCircle className="w-4 h-4 text-indigo-600" /> : <FileText className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold text-xs ${log.type === 'SUPERVISOR_MONITORING' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                {log.type === 'SUPERVISOR_MONITORING' ? 'Catatan Supervisor' : 'Progres Guru'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">{new Date(log.date).toLocaleDateString('id-ID')}</span>
                            </div>
                            <p className="text-sm text-slate-600">{log.notes}</p>
                            {log.evidenceUrl && (
                              <a href={log.evidenceUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-blue-600 hover:underline">
                                Lihat Evidence
                              </a>
                            )}
                            {log.nextReviewDate && (
                              <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Review Berikutnya: {new Date(log.nextReviewDate).toLocaleDateString('id-ID')}
                              </div>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="text-sm text-slate-500 italic pl-12">Belum ada log progres.</div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingApId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-indigo-50">
              <h2 className="text-xl font-bold text-slate-800">Catatan Monitoring</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Monitoring / Saran Perbaikan</label>
                <textarea
                  value={monitoringNotes}
                  onChange={e => setMonitoringNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Berikan umpan balik terhadap progres guru..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal Monitoring Berikutnya</label>
                <input
                  type="date"
                  value={nextReviewDate}
                  onChange={e => setNextReviewDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setReviewingApId(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleScheduleReview}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
