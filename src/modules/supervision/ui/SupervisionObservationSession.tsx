import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Save, MessageSquare, Camera, StopCircle, User } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { 
  SupervisionSchedule, 
  SupervisionInstrument, 
  Observation, 
  ObservationStatus, 
  SupervisionStatus,
  EvidenceType
} from '../types/SupervisionTypes';


interface Props {
  scheduleId: string;
  onClose: () => void;
}

export const SupervisionObservationSession: React.FC<Props> = ({ scheduleId, onClose }) => {
  const { repositories } = useSupervision();
  const scheduleRepo = repositories.getScheduleRepository();
  const instrumentRepo = repositories.getInstrumentRepository();
  const observationRepo = repositories.getObservationRepository();
  const { applicationService, dispatch } = useSupervision();
  const [schedule, setSchedule] = useState<SupervisionSchedule | null>(null);
  const [instrument, setInstrument] = useState<SupervisionInstrument | null>(null);
  const [observation, setObservation] = useState<Observation | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [noteContent, setNoteContent] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const sched = await scheduleRepo.findById(scheduleId);
        if (!sched) throw new Error("Schedule not found");
        setSchedule(sched);

        // Fetch instruments to pick one for this session. 
        // In reality, instrument ID should be linked to plan or schedule.
        // We'll just grab the first one available.
        const instruments = await instrumentRepo.findAll();
        if (instruments.length > 0) {
          setInstrument(instruments[0]);
        }

        // Try to find existing observation
        const existingObs = await observationRepo.findByScheduleId(scheduleId);
        if (existingObs) {
          setObservation(existingObs);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [scheduleId]);

  const handleStartObservation = async () => {
    if (!schedule || !instrument) return;
    try {
      const newObs = applicationService.startObservation({
        schedule,
        instrument,
        className: schedule.teacherSnapshot.subject.replace(/Guru\s+/i, '') || '-',
        subjectName: schedule.teacherSnapshot.subject,
        studentCount: 30
      });
      const savedObs = await observationRepo.create(newObs);
      setObservation(savedObs);

      // Update schedule status
      const updatedSchedule = { ...schedule, status: SupervisionStatus.OBSERVATION };
      await scheduleRepo.update(schedule.id, updatedSchedule);
      setSchedule(updatedSchedule);

      // We might need to update global state schedules too, but we can rely on reload when closing
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleScoreChange = async (rubricItemId: string, score: number) => {
    if (!observation) return;
    try {
      const updatedObs = applicationService.scoreIndicator({
        observation,
        rubricItemId,
        score
      });
      const savedObs = await observationRepo.update(updatedObs.id, updatedObs);
      setObservation(savedObs);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddNote = async () => {
    if (!observation || !noteContent.trim()) return;
    try {
      const updatedObs = applicationService.addObservationNote({
        observation,
        content: noteContent
      });
      const savedObs = await observationRepo.update(updatedObs.id, updatedObs);
      setObservation(savedObs);
      setShowNoteModal(false);
      setNoteContent('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddEvidence = async () => {
    if (!observation || !evidenceUrl.trim()) return;
    try {
      const updatedObs = applicationService.addEvidence({
        observation,
        type: EvidenceType.IMAGE,
        url: evidenceUrl,
        description: evidenceDesc
      });
      const savedObs = await observationRepo.update(updatedObs.id, updatedObs);
      setObservation(savedObs);
      setShowEvidenceModal(false);
      setEvidenceUrl('');
      setEvidenceDesc('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleFinishObservation = async () => {
    if (!observation || !schedule) return;
    try {
      const finishedObs = applicationService.finishObservation(observation);
      await observationRepo.update(finishedObs.id, finishedObs);
      setObservation(finishedObs);

      const updatedSchedule = { ...schedule, status: SupervisionStatus.POST_OBSERVATION };
      await scheduleRepo.update(schedule.id, updatedSchedule);
      setSchedule(updatedSchedule);

      // Optionally refresh plan schedules
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

  if (!schedule || !instrument) {
    return <div className="p-8 text-center text-red-500">Data tidak ditemukan atau belum ada instrumen.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">Sesi Observasi</h2>
              {observation?.status === ObservationStatus.IN_PROGRESS && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  SEDANG BERLANGSUNG
                </span>
              )}
              {observation?.status === ObservationStatus.COMPLETED && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  SELESAI
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {schedule.teacherSnapshot.name} &bull; {schedule.teacherSnapshot.subject}
            </p>
          </div>
        </div>
        
        {observation?.status === ObservationStatus.IN_PROGRESS && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEvidenceModal(true)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center"
            >
              <Camera className="w-4 h-4 mr-2" />
              Bukti
            </button>
            <button 
              onClick={() => setShowNoteModal(true)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Catatan
            </button>
            <button 
              onClick={handleFinishObservation}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors flex items-center"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Akhiri Sesi
            </button>
          </div>
        )}
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {!observation ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mulai Sesi Observasi</h3>
            <p className="text-slate-600 font-medium mb-8 max-w-md">
              Pastikan Anda sudah berada di dalam kelas. Sesi observasi akan merekam waktu mulai dan memungkinkan Anda mengisi skor rubrik.
            </p>
            <button 
              onClick={handleStartObservation}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Mulai Observasi Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Instrument */}
            <div className="lg:col-span-2 space-y-8">
              {observation.session.instrumentSnapshot.categories.map(category => (
                <div key={category.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{category.name}</h3>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Bobot: {category.weight * 100}%
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {observation.session.instrumentSnapshot.items
                      .filter(item => item.categoryId === category.id)
                      .map(item => {
                        const scoreObj = observation.scores.find(s => s.rubricItemId === item.id);
                        const currentScore = scoreObj ? scoreObj.score : null;
                        
                        return (
                          <div key={item.id} className="p-5">
                            <p className="text-slate-700 font-medium mb-4">{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: item.maxScore }, (_, i) => i + 1).map(val => (
                                <button
                                  key={val}
                                  onClick={() => handleScoreChange(item.id, val)}
                                  disabled={observation.status !== ObservationStatus.IN_PROGRESS}
                                  className={`
                                    w-12 h-12 rounded-xl font-bold text-lg transition-all
                                    ${currentScore === val 
                                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-2' 
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                    ${observation.status !== ObservationStatus.IN_PROGRESS && currentScore !== val ? 'opacity-50 cursor-not-allowed' : ''}
                                  `}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sidebar: Notes & Evidences */}
            <div className="space-y-6">
              {/* Info Session */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Info Sesi
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mulai</span>
                    <span className="font-bold text-slate-800">
                      {new Date(observation.session.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {observation.session.endTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Selesai</span>
                      <span className="font-bold text-slate-800">
                        {new Date(observation.session.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Kelas</span>
                    <span className="font-bold text-slate-800">{observation.session.className || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Notes List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-amber-600" />
                  Catatan ({observation.notes.length})
                </h4>
                {observation.notes.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Belum ada catatan.</p>
                ) : (
                  <div className="space-y-3">
                    {observation.notes.map(note => (
                      <div key={note.id} className="bg-amber-50 rounded-lg p-3 text-sm text-amber-900 border border-amber-100">
                        <div className="text-xs text-amber-600 font-bold mb-1">
                          {new Date(note.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {note.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Evidences List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-600" />
                  Bukti Fisik ({observation.evidences.length})
                </h4>
                {observation.evidences.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Belum ada bukti.</p>
                ) : (
                  <div className="space-y-3">
                    {observation.evidences.map(ev => (
                      <div key={ev.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-sm text-blue-900 truncate">
                          <p className="font-bold truncate">{ev.description || 'Tanpa Keterangan'}</p>
                          <a href={ev.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                            Lihat Tautan
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-50">
              <h2 className="text-xl font-bold text-slate-800">Tambah Catatan</h2>
            </div>
            <div className="p-6">
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={4}
                placeholder="Tuliskan kejadian spesifik atau pengamatan kualitatif..."
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <h2 className="text-xl font-bold text-slate-800">Tambah Bukti</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tautan Bukti (Foto/Dokumen)</label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={e => setEvidenceUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Keterangan Singkat</label>
                <input
                  type="text"
                  value={evidenceDesc}
                  onChange={e => setEvidenceDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Misal: Foto papan tulis bab 3"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddEvidence}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Bukti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
