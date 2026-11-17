import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Target, Calendar, BarChart2 } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { 
  FollowUp,
  ActionPlanStatus,
  RecommendationPriority,
  EvidenceType
} from '../types/SupervisionTypes';


interface Props {
  scheduleId: string;
  onClose: () => void;
}

export const SupervisionTeacherRtlRecord: React.FC<Props> = ({ scheduleId, onClose }) => {
  const { repositories } = useSupervision();
  const followUpRepo = repositories.getFollowUpRepository();
  const { applicationService } = useSupervision();
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status/Evidence Modals
  const [updatingApId, setUpdatingApId] = useState<string | null>(null);
  const [status, setStatus] = useState<ActionPlanStatus>(ActionPlanStatus.IN_PROGRESS);
  const [teacherNotes, setTeacherNotes] = useState('');
  
  const [uploadingApId, setUploadingApId] = useState<string | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  
  const [addingLogApId, setAddingLogApId] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [logEvidenceUrl, setLogEvidenceUrl] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fu = await followUpRepo.findByScheduleId(scheduleId);
        setFollowUp(fu);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [scheduleId]);

  const handleUpdateTracking = async () => {
    if (!followUp || !addingLogApId) return;
    try {
      const updated = applicationService.updateTracking({
        followUp,
        actionPlanId: addingLogApId,
        notes: logNotes,
        evidenceUrl: logEvidenceUrl
      });
      const saved = await followUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setAddingLogApId(null);
      setLogNotes('');
      setLogEvidenceUrl('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdateStatus = async () => {
    if (!followUp || !updatingApId) return;
    try {
      const updated = applicationService.updateActionProgress({
        followUp,
        actionPlanId: updatingApId,
        status,
        teacherNotes
      });
      const saved = await followUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setUpdatingApId(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUploadEvidence = async () => {
    if (!followUp || !uploadingApId) return;
    try {
      const updated = applicationService.submitActionEvidence({
        followUp,
        actionPlanId: uploadingApId,
        type: EvidenceType.DOCUMENT_LINK,
        url: evidenceUrl,
        description: evidenceDesc
      });
      const saved = await followUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setUploadingApId(null);
      setEvidenceUrl('');
      setEvidenceDesc('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (!followUp) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Belum ada RTL yang ditetapkan untuk jadwal ini.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="p-6 border-b border-slate-200 bg-teal-50 flex items-center gap-4">
        <button 
          onClick={onClose}
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Dashboard Pelaksanaan RTL (Guru)</h2>
          <p className="text-sm text-slate-500">Perbarui progress dan unggah bukti pelaksanaan.</p>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {followUp.actionPlans.map(ap => (
            <div key={ap.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-md mb-2 inline-block
                    ${ap.status === ActionPlanStatus.VERIFIED ? 'bg-indigo-100 text-indigo-800' : 
                      ap.status === ActionPlanStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800' : 
                      ap.status === ActionPlanStatus.REVISION_NEEDED ? 'bg-rose-100 text-rose-800' : 
                      ap.status === ActionPlanStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : 
                      ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'bg-amber-100 text-amber-800' : 
                      ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'bg-indigo-100 text-indigo-800' : 
                      ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-slate-100 text-slate-600'}
                  `}>
                    {ap.status === ActionPlanStatus.VERIFIED ? 'Terverifikasi' : 
                     ap.status === ActionPlanStatus.COMPLETED ? 'Selesai (Menunggu Verifikasi)' : 
                     ap.status === ActionPlanStatus.REVISION_NEEDED ? 'Perlu Perbaikan' : 
                     ap.status === ActionPlanStatus.IN_PROGRESS ? 'Sedang Berjalan' : 
                     ap.status === ActionPlanStatus.TRACKING_ACTIVE ? 'Tracking Aktif' : 
                     ap.status === ActionPlanStatus.FOLLOW_UP_REVIEW ? 'Menunggu Review' : 
                     ap.status === ActionPlanStatus.TRACKING_COMPLETED ? 'Tracking Selesai' : 
                     'Belum Dimulai'}
                  </span>
                  <h4 className="font-bold text-lg text-slate-800">{ap.title}</h4>
                  <p className="text-sm font-medium text-slate-500">{ap.category}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500 mb-1">Target Penyelesaian:</div>
                  <div className="font-bold text-slate-700">{new Date(ap.targetDate).toLocaleDateString('id-ID')}</div>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 text-sm">{ap.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h5 className="font-bold text-sm text-slate-700 mb-2">Detail RTL</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target</span>
                      <span className="font-bold text-slate-700">{ap.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prioritas</span>
                      <span className={`font-bold ${ap.priority === RecommendationPriority.HIGH ? 'text-red-600' : ap.priority === RecommendationPriority.MEDIUM ? 'text-amber-600' : 'text-emerald-600'}`}>{ap.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Evidence</span>
                      <span className="font-bold text-slate-700">{ap.expectedEvidence || '-'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  
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
                          Input Bukti Pelaksanaan
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

                </div>
              </div>

              {/* Status and Notes Section */}
              {(ap.teacherNotes || ap.verifierNotes || (ap.evidences && ap.evidences.length > 0)) && (
                <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
                  {ap.teacherNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                      <span className="font-bold text-blue-900 block mb-1">Catatan Anda:</span>
                      <span className="text-blue-800">{ap.teacherNotes}</span>
                    </div>
                  )}
                  {ap.verifierNotes && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm">
                      <span className="font-bold text-amber-900 block mb-1">Catatan Verifikator (Kepala Sekolah):</span>
                      <span className="text-amber-800">{ap.verifierNotes}</span>
                    </div>
                  )}

                  {ap.trackingLogs && ap.trackingLogs.length > 0 && (
                    <div className="mt-6">
                      <span className="font-bold text-slate-700 text-sm mb-4 block">Log Tracking:</span>
                      <div className="space-y-3">
                        {ap.trackingLogs.map(log => (
                          <div key={log.id} className={`p-4 rounded-xl border ${log.type === 'SUPERVISOR_MONITORING' ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-xs font-bold ${log.type === 'SUPERVISOR_MONITORING' ? 'text-indigo-800' : 'text-emerald-800'}`}>
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

                  {ap.evidences && ap.evidences.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-700 text-sm mb-2 block">Bukti Diunggah:</span>
                      <div className="flex flex-wrap gap-2">
                        {ap.evidences.map(ev => (
                          <a key={ev.id} href={ev.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-200 transition-colors">
                            {ev.description || 'Lihat Bukti'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Modal */}
      {updatingApId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-teal-50">
              <h2 className="text-xl font-bold text-slate-800">Perbarui Progress RTL</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as ActionPlanStatus)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value={ActionPlanStatus.NOT_STARTED}>Belum Dimulai</option>
                  <option value={ActionPlanStatus.IN_PROGRESS}>Sedang Berjalan</option>
                  <option value={ActionPlanStatus.COMPLETED}>Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Pelaksanaan</label>
                <textarea
                  value={teacherNotes}
                  onChange={e => setTeacherNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Ceritakan proses pelaksanaan sejauh ini..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setUpdatingApId(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {uploadingApId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-teal-50">
              <h2 className="text-xl font-bold text-slate-800">Input Bukti</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tautan Bukti (Google Drive/Lainnya)</label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={e => setEvidenceUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="https://docs.google.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi/Nama File</label>
                <input
                  type="text"
                  value={evidenceDesc}
                  onChange={e => setEvidenceDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="Misal: Sertifikat Pelatihan"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setUploadingApId(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUploadEvidence}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm rounded-xl transition-colors"
                >
                  Unggah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

    </div>
  );
};
