import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, FileText, Check, FileSignature } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { 
  SupervisionSchedule, 
  Observation,
  PostObservation,
  SupervisionStatus
} from '../types/SupervisionTypes';


interface Props {
  scheduleId: string;
  onClose: () => void;
}

export const SupervisionPostObservationSession: React.FC<Props> = ({ scheduleId, onClose }) => {
  const { repositories } = useSupervision();
  const scheduleRepo = repositories.getScheduleRepository();
  const observationRepo = repositories.getObservationRepository();
  const postObservationRepo = repositories.getPostObservationRepository();
  const { applicationService, dispatch } = useSupervision();
  const [schedule, setSchedule] = useState<SupervisionSchedule | null>(null);
  const [observation, setObservation] = useState<Observation | null>(null);
  const [postObservation, setPostObservation] = useState<PostObservation | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [assessorNotes, setAssessorNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const sched = await scheduleRepo.findById(scheduleId);
        if (!sched) throw new Error("Schedule not found");
        setSchedule(sched);

        const obs = await observationRepo.findByScheduleId(scheduleId);
        if (obs) {
          setObservation(obs);
        }

        let postObs = await postObservationRepo.findByScheduleId(scheduleId);
        if (!postObs) {
          const newPostObs = applicationService.startPostObservation({ schedule: sched });
          postObs = await postObservationRepo.create(newPostObs);
        }
        setPostObservation(postObs);
        setAssessorNotes(postObs.coaching.assessorNotes || '');
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [scheduleId]);

  const handleSaveNotes = async () => {
    if (!postObservation) return;
    try {
      const updated = applicationService.createCoachingNote({
        postObservation,
        assessorNotes
      });
      const saved = await postObservationRepo.update(updated.id, updated);
      setPostObservation(saved);
      alert('Catatan Coaching berhasil disimpan.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleFinishPostObservation = async () => {
    if (!postObservation || !schedule) return;
    try {
      // Teacher response simulation for development
      const answered = applicationService.submitTeacherResponse({
        postObservation,
        agreedCommitment: 'Saya akan mencoba menerapkan media interaktif di pertemuan berikutnya.'
      });
      
      const finished = applicationService.completePostObservation({
        postObservation: answered
      });
      
      await postObservationRepo.update(finished.id, finished);
      
      const updatedSchedule = { ...schedule, status: SupervisionStatus.WAITING_FOR_FOLLOW_UP };
      await scheduleRepo.update(schedule.id, updatedSchedule);
      
      const updatedSchedules = await scheduleRepo.findByPlanId(schedule.planId);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      onClose();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (!schedule || !postObservation || !observation) {
    return <div className="p-8 text-center text-red-500">Data tidak lengkap. Pastikan Observasi telah selesai.</div>;
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
              <FileSignature className="w-6 h-6 text-blue-600" />
              Sesi Coaching (Pasca Observasi)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {schedule.teacherSnapshot.name} &bull; {schedule.teacherSnapshot.subject}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveNotes}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Simpan Draft
          </button>
          <button 
            onClick={handleFinishPostObservation}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Selesaikan Coaching
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Rekap Hasil Observasi
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600">Skor Total Diisi</span>
                <span className="font-bold text-slate-800">{observation.scores.length} Indikator</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600">Catatan Asesor</span>
                <span className="font-bold text-slate-800">{observation.notes.length} Catatan</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600">Bukti Fisik</span>
                <span className="font-bold text-slate-800">{observation.evidences.length} File</span>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-bold text-sm rounded-lg hover:bg-indigo-50 transition-colors">
              Lihat Detail Observasi
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-800 mb-2 text-sm">Refleksi Guru (Pra/Pasca)</h3>
            <p className="text-emerald-900 text-sm font-medium italic">
              "Saya merasa kurang maksimal saat menggunakan media LCD karena sempat ada kendala teknis, sehingga waktu banyak terbuang."
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Catatan Coaching Asesor</h3>
            <p className="text-sm text-slate-600 mb-4">
              Tuliskan apresiasi, area pengembangan, dan saran perbaikan berdasarkan hasil observasi dan diskusi dengan guru.
            </p>
            <textarea
              value={assessorNotes}
              onChange={e => setAssessorNotes(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              placeholder="Contoh: Pendekatan ke siswa sudah sangat baik. Namun, penggunaan waktu perlu dikelola lebih ketat..."
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 mb-2 text-sm">Komitmen Guru (Tanggapan)</h3>
            <p className="text-amber-900 text-sm font-medium">
              Menunggu guru mengisi komitmen setelah catatan coaching ini dibagikan. 
              <br/><br/>
              <span className="text-xs opacity-75">(Dalam versi ini, mengklik "Selesaikan Coaching" akan mengisi bagian ini secara otomatis)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
