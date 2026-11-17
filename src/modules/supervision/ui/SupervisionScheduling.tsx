import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import { PermissionGuard, OwnershipGuard } from '../auth/SupervisionGuards';
import { Calendar, Clock, UserCheck, AlertCircle, CheckCircle, Save, X } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { SupervisionPlan, SupervisionSchedule, SupervisionStatus } from '../types/SupervisionTypes';


export const SupervisionScheduling = ({ plan, onStartObservation, onStartPostObservation, onStartRtl }: { plan: SupervisionPlan, onStartObservation?: (id: string) => void, onStartPostObservation?: (id: string) => void, onStartRtl?: (id: string) => void }) => {
  const { repositories } = useSupervision();
  const supervisionRepo = repositories.getSupervisionRepository();
  const scheduleRepo = repositories.getScheduleRepository();
  const { state, dispatch, applicationService } = useSupervision();
  
  const schedules = state.schedules.schedules.filter(s => s.planId === plan.id);
  
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [supervisorName, setSupervisorName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState('90');
  const [startingPreObsId, setStartingPreObsId] = useState<string | null>(null);
  const [preObsNotes, setPreObsNotes] = useState('');

  if (plan.status === SupervisionStatus.DRAFT) {
    return null;
  }

  const handleEdit = (schedule: SupervisionSchedule) => {
    setEditingScheduleId(schedule.id);
    if (schedule.supervisor) {
      setSupervisorName(schedule.supervisor.name);
    } else {
      setSupervisorName('');
    }
    
    if (schedule.scheduledDate) {
      const d = new Date(schedule.scheduledDate);
      setScheduledDate(d.toISOString().split('T')[0]);
      setScheduledTime(d.toTimeString().split(' ')[0].slice(0, 5));
    } else {
      setScheduledDate('');
      setScheduledTime('');
    }
  };

  const handleStartPreObservation = async (schedule: SupervisionSchedule) => {
    try {
      const updatedSchedule = applicationService.startPreObservation({
        schedule,
        notes: preObsNotes
      });
      await scheduleRepo.update(updatedSchedule.id, updatedSchedule);
      
      const updatedSchedules = await scheduleRepo.findByPlanId(plan.id);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      setStartingPreObsId(null);
      setPreObsNotes('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSave = async (schedule: SupervisionSchedule) => {
    try {
      if (!supervisorName || !scheduledDate || !scheduledTime) {
        alert("Semua field (Supervisor, Tanggal, Jam) harus diisi.");
        return;
      }
      
      const dateTimeString = `${scheduledDate}T${scheduledTime}:00`;
      const dateObj = new Date(dateTimeString);
      
      const updatedSchedule = applicationService.scheduleSupervision({
        schedule,
        supervisorId: uuidv4(), // Auto-generated supervisor ID
        supervisorName,
        supervisorRole: 'Kepala Sekolah', // Assigned role
        scheduledDate: dateObj.getTime(),
      });

      await scheduleRepo.update(updatedSchedule.id, updatedSchedule);

      // Check if all schedules are now scheduled, if so we might update plan status
      // For now, just update schedules state
      
      // Update local state by fetching
      const updatedSchedules = await scheduleRepo.findByPlanId(plan.id);
      
      // Update store
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      
      // Update plan status if all schedules are done?
      // The plan status is updated here manually or leave it as READY_FOR_SCHEDULING/SCHEDULED.
      const allScheduled = updatedSchedules.every(s => s.status !== SupervisionStatus.DRAFT && s.status !== SupervisionStatus.READY_FOR_SCHEDULING);
      
      if (allScheduled && plan.status === SupervisionStatus.READY_FOR_SCHEDULING) {
        const updatedPlan = { ...plan, status: SupervisionStatus.SCHEDULED };
        await supervisionRepo.update(plan.id, updatedPlan);
        const plans = await supervisionRepo.findAll();
        dispatch({ type: 'SET_PLANS', payload: plans });
        dispatch({ type: 'SET_ACTIVE_PLAN', payload: plan.id });
      }

      setEditingScheduleId(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] mt-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 border-b border-[var(--color-eds-border)] bg-slate-50 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Penjadwalan Supervisi</h3>
            <p className="text-sm text-slate-500">Tentukan jadwal dan supervisor untuk setiap guru sasaran.</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-slate-600 font-medium text-sm">Belum ada guru yang ditugaskan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map(schedule => (
              <div key={schedule.id} className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{schedule.teacherSnapshot.name}</h4>
                    <p className="text-xs text-slate-500">{schedule.teacherSnapshot.subject} &bull; {schedule.teacherSnapshot.nip}</p>
                  </div>
                  {schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP ? (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      TINDAK LANJUT
                    </span>
                  ) : schedule.status === SupervisionStatus.POST_OBSERVATION ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      PASCA OBSERVASI
                    </span>
                  ) : schedule.status === SupervisionStatus.PRE_OBSERVATION ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      PRA OBSERVASI
                    </span>
                  ) : schedule.status === SupervisionStatus.SCHEDULED ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      TERJADWAL
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      BELUM DIJADWALKAN
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  {editingScheduleId === schedule.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Jam</label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Supervisor</label>
                        <input
                          type="text"
                          placeholder="Nama Supervisor"
                          value={supervisorName}
                          onChange={(e) => setSupervisorName(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingScheduleId(null)}
                          className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSave(schedule)}
                          className="flex-1 px-3 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex gap-6 mb-4 md:mb-0">
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          {schedule.scheduledDate ? new Date(schedule.scheduledDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2 text-slate-400" />
                          {schedule.scheduledDate ? new Date(schedule.scheduledDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <UserCheck className="w-4 h-4 mr-2 text-slate-400" />
                          {schedule.supervisor ? schedule.supervisor.name : '-'}
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

    </div>
  );
};
