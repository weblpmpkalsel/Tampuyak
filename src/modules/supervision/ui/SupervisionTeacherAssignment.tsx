import React, { useState, useEffect, useMemo } from 'react';
import { PermissionGuard } from '../auth/SupervisionGuards';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { TeacherSnapshot } from '../types/SupervisionTypes';
import { useApp } from '../../../Tampuyak';


export const SupervisionTeacherAssignment = ({ planId }: { planId: string }) => {
  const { settings } = useApp();
  const rawTeachers = settings?.guru || [];

  const { repositories } = useSupervision();
  const scheduleRepo = repositories.getScheduleRepository();
  const { state, dispatch, applicationService } = useSupervision();
  const schedules = state.schedules.schedules;
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const teachers: TeacherSnapshot[] = useMemo(() => {
    return rawTeachers.map((g: any) => ({
      id: String(g.id || Math.random().toString(36).substr(2, 9)),
      nip: g.nip || '-',
      name: g.nama || 'Tanpa Nama',
      subject: g.mapel || g.jabatan || 'Guru Kelas',
      rank: g.pangkat || g.golongan || '-'
    }));
  }, [rawTeachers]);

  useEffect(() => {
    scheduleRepo.findByPlanId(planId).then(updatedSchedules => {
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    });
  }, [planId, dispatch, scheduleRepo]);

  // Assigned teachers
  const assignedTeacherIds = schedules.map(s => s.teacherSnapshot.id);

  const handleAddTeachers = async () => {
    try {
      const promises = Array.from(selectedTeachers).map(async (teacherId) => {
        const teacher = teachers.find(t => t.id === teacherId)!;
        
        // UC02a: Create via Application Service.
        const schedule = applicationService.assignTeacher({
          planId,
          teacherId: teacher.id,
          teacherNip: teacher.nip,
          teacherName: teacher.name,
          teacherSubject: teacher.subject,
          teacherRank: teacher.rank
        });

        return scheduleRepo.create(schedule);
      });

      await Promise.all(promises);
      
      const updatedSchedules = await scheduleRepo.findByPlanId(planId);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
      setShowModal(false);
      setSelectedTeachers(new Set());
      
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan guru sasaran');
    }
  };

  const handleRemoveTeacher = async (scheduleId: string) => {
    if (confirm('Hapus guru ini dari sasaran supervisi?')) {
      await scheduleRepo.delete(scheduleId);
      const updatedSchedules = await scheduleRepo.findByPlanId(planId);
      dispatch({ type: 'SET_SCHEDULES', payload: updatedSchedules });
    }
  };

  const availableTeachers = teachers.filter(t => !assignedTeacherIds.includes(t.id));
  
  console.log("Trace - Total teachers loaded:", teachers.length);
  console.log("Trace - Assigned teachers count:", assignedTeacherIds.length);
  console.log("Trace - Filtered teachers count:", availableTeachers.length);
  
      
        if (availableTeachers.length === 0) {
      }


  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 border-b border-[var(--color-eds-border)] flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Guru Sasaran Supervisi</h3>
            <p className="text-sm text-slate-500">Kelola daftar guru yang akan diobservasi pada program ini.</p>
          </div>
        </div>
        <PermissionGuard requiredPermission="MANAGE_TEACHER_ASSIGNMENT">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-lg shadow-sm hover:bg-indigo-100 transition-colors flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Tambah Guru
            </button>
            </PermissionGuard>
      </div>
      
      {schedules.length === 0 ? (
        <div className="p-8 text-center bg-slate-50">
          <p className="text-slate-500 font-medium">Belum ada guru sasaran yang ditambahkan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Nama Guru / NIP</th>
                <th className="px-6 py-4">Mata Pelajaran</th>
                <th className="px-6 py-4">Pangkat / Gol</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{schedule.teacherSnapshot.name}</div>
                    <div className="text-slate-500">{schedule.teacherSnapshot.nip}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{schedule.teacherSnapshot.subject}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{schedule.teacherSnapshot.rank}</td>
                  <td className="px-6 py-4 text-right">
                    <PermissionGuard requiredPermission="MANAGE_TEACHER_ASSIGNMENT">
                    <button 
                      onClick={() => handleRemoveTeacher(schedule.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Guru"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Pilih Guru Sasaran</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {availableTeachers.length === 0 ? (
                <div className="p-6 text-center text-slate-500">Semua guru telah ditambahkan ke program ini.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {availableTeachers.map(teacher => (
                    <li key={teacher.id} className="p-4 hover:bg-slate-50 flex items-center cursor-pointer" onClick={() => {
                      const next = new Set(selectedTeachers);
                      if (next.has(teacher.id)) next.delete(teacher.id);
                      else next.add(teacher.id);
                      setSelectedTeachers(next);
                    }}>
                      <div className="mr-4">
                        <input 
                          type="checkbox" 
                          checked={selectedTeachers.has(teacher.id)}
                          onChange={() => {}} 
                          className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{teacher.name}</div>
                        <div className="text-sm text-slate-500">{teacher.nip} &bull; {teacher.subject}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleAddTeachers}
                disabled={selectedTeachers.size === 0}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambahkan ({selectedTeachers.size}) Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
