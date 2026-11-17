const fs = require('fs');

const fullCode = `import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Plus, CheckCircle, Calendar, BarChart2 } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { 
  SupervisionSchedule, 
  ActionPlanStatus,
  RecommendationPriority,
  FollowUp,
  ScheduleStatus
} from '../types/SupervisionTypes';
import { MockFollowUpRepository } from '../persistence/mock/MockFollowUpRepository';

const mockFollowUpRepo = new MockFollowUpRepository();

interface Props {
  schedule: SupervisionSchedule;
  onClose: () => void;
}

export const SupervisionRtlSession: React.FC<Props> = ({ schedule, onClose }) => {
  const { applicationService } = useSupervision();
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add RTL Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pelatihan');
  const [expectedEvidence, setExpectedEvidence] = useState('');
  const [target, setTarget] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<RecommendationPriority>(RecommendationPriority.MEDIUM);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        let fu = await mockFollowUpRepo.findByScheduleId(schedule.id);
        if (!fu) {
          const newFu = applicationService.startFollowUp(schedule.id, 'Peningkatan Berkelanjutan');
          fu = await mockFollowUpRepo.save(newFu);
        }
        setFollowUp(fu);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [schedule.id, applicationService]);

  const handleVerifyRtl = async (actionPlanId: string, isApproved: boolean) => {
    if (!followUp) return;
    try {
      const verifierNotes = isApproved ? 'Bagus, RTL telah selesai dengan baik.' : 'Mohon lengkapi bukti yang diperlukan sesuai dengan deskripsi.';
      const updated = applicationService.verifyActionPlan({
        followUp,
        actionPlanId,
        isApproved,
        verifierNotes
      });
      const saved = await mockFollowUpRepo.update(updated.id, updated);
      setFollowUp(saved);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleFinishRtl = async () => {
    if (!followUp) return;
    try {
      if (confirm('Apakah Anda yakin ingin mengakhiri sesi supervisi ini? Status jadwal akan menjadi Selesai.')) {
        await applicationService.completeActionPlan(followUp.id);
        alert('Supervisi telah selesai sepenuhnya.');
        onClose();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddRtl = async () => {
    if (!followUp) return;
    if (!title || !description || !target || !targetDate) {
      alert('Mohon lengkapi semua field yang wajib.');
      return;
    }

    try {
      const updated = applicationService.createActionPlan({
        followUp,
        title,
        description,
        category,
        target,
        targetDate: new Date(targetDate).getTime(),
        priority,
        expectedEvidence
      });
      const saved = await mockFollowUpRepo.update(updated.id, updated);
      setFollowUp(saved);
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setTarget('');
      setTargetDate('');
      setPriority(RecommendationPriority.MEDIUM);
      setCategory('Pelatihan');
      setExpectedEvidence('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Memuat RTL...</div>;
  }

  if (!followUp) {
    return <div className="p-8 text-center text-slate-500">Terjadi kesalahan saat memuat RTL.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-6 h-6 text-teal-600" />
              Rencana Tindak Lanjut (RTL)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {schedule.teacherSnapshot.name} &bull; {schedule.teacherSnapshot.subject}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFinishRtl}
            className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-sm hover:bg-teal-700 transition-colors flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Akhiri Supervisi
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Daftar RTL</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah RTL Baru
          </button>
        </div>

        {followUp.actionPlans.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Target className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Belum ada Rencana Tindak Lanjut yang dibuat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}
      </div>

      {/* Add RTL Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-teal-50">
              <h2 className="text-xl font-bold text-slate-800">Tambah RTL</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Pelatihan">Pelatihan / Diklat</option>
                    <option value="Mentoring">Mentoring / Coaching</option>
                    <option value="Tugas Tambahan">Tugas Tambahan</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Judul RTL</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Misal: Ikut Pelatihan Media Interaktif"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi & Langkah</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Deskripsikan langkah spesifik yang harus dilakukan..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Target</label>
                  <input
                    type="text"
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Misal: Sertifikat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Evidence yang Diharapkan</label>
                  <input
                    type="text"
                    value={expectedEvidence}
                    onChange={e => setExpectedEvidence(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="Misal: Sertifikat PDF, Foto Kegiatan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Prioritas</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as RecommendationPriority)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value={RecommendationPriority.LOW}>Rendah (LOW)</option>
                    <option value={RecommendationPriority.MEDIUM}>Sedang (MEDIUM)</option>
                    <option value={RecommendationPriority.HIGH}>Tinggi (HIGH)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddRtl}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan RTL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/modules/supervision/ui/SupervisionRtlSession.tsx', fullCode);
