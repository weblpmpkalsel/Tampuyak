import React, { useState } from 'react';
import { RoleGuard, PermissionGuard } from '../auth/SupervisionGuards';
import { Stethoscope, FileText, Plus, FileEdit, FileSignature } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { selectActivePlan } from '../context/SupervisionSelectors';
import { SupervisionProgramWizard } from './SupervisionProgramWizard';
import { SupervisionTeacherAssignment } from './SupervisionTeacherAssignment';
import { SupervisionInstrumentLibrary } from './SupervisionInstrumentLibrary';
import { SupervisionInstrumentSelection } from './SupervisionInstrumentSelection';
import { SupervisionScheduling } from './SupervisionScheduling';
import { SupervisionObservationSession } from './SupervisionObservationSession';
import { SupervisionPostObservationSession } from './SupervisionPostObservationSession';
import { SupervisionRtlSession } from './SupervisionRtlSession';
import { SupervisionTrackingSession } from './SupervisionTrackingSession';
import { SupervisionExecutiveDashboard } from './SupervisionExecutiveDashboard';
import { SupervisionPublishingView } from './SupervisionPublishingView';
import { FileOutput } from 'lucide-react';
import { BarChart3 } from 'lucide-react';

const SupervisionAcademicViewInternal = () => {
  const { state } = useSupervision();
  const activePlan = selectActivePlan(state);
  
  const [showWizard, setShowWizard] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);
  const [showPublishing, setShowPublishing] = useState(false);
  const [activeObservationScheduleId, setActiveObservationScheduleId] = useState<string | null>(null);
  const [activePostObservationScheduleId, setActivePostObservationScheduleId] = useState<string | null>(null);
  const [activeRtlScheduleId, setActiveRtlScheduleId] = useState<string | null>(null);
  const [activeTrackingScheduleId, setActiveTrackingScheduleId] = useState<string | null>(null);

  if (showPublishing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setShowPublishing(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Kembali ke Supervisi</button>
        </div>
        <SupervisionPublishingView />
      </div>
    );
  }

  if (showExecutiveDashboard) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setShowExecutiveDashboard(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Kembali ke Supervisi</button>
        </div>
        <SupervisionExecutiveDashboard />
      </div>
    );
  }

  if (showLibrary) {
    return <SupervisionInstrumentLibrary onClose={() => setShowLibrary(false)} />;
  }

  if (activeTrackingScheduleId) {
    return <SupervisionTrackingSession schedule={state.schedules.schedules.find(s => s.id === activeTrackingScheduleId)!} onClose={() => setActiveTrackingScheduleId(null)} />;
  }

  if (activeRtlScheduleId) {
    return <SupervisionRtlSession schedule={state.schedules.schedules.find(s => s.id === activeRtlScheduleId)!} onClose={() => setActiveRtlScheduleId(null)} />;
  }

  if (activePostObservationScheduleId) {
    return <SupervisionPostObservationSession scheduleId={activePostObservationScheduleId} onClose={() => setActivePostObservationScheduleId(null)} />;
  }

  if (activeObservationScheduleId) {
    return <SupervisionObservationSession scheduleId={activeObservationScheduleId} onClose={() => setActiveObservationScheduleId(null)} />;
  }
  
  if (showWizard) {
    return <SupervisionProgramWizard onCancel={() => setShowWizard(false)} onSaved={() => setShowWizard(false)} />;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)] flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2 flex items-center">
            <Stethoscope className="w-8 h-8 mr-4 text-[var(--color-eds-text-primary)] font-bold" />
            Supervisi Akademik
          </h1>
          <p className="text-[var(--color-eds-text-primary)] font-medium">
            Kelola program supervisi, observasi kelas, dan tindak lanjut evaluasi guru secara terstruktur.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard requiredPermission="PUBLISH_REPORT">
          <button
            onClick={() => setShowPublishing(true)}
            className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-100 transition-colors flex items-center"
          >
            <FileOutput className="w-4 h-4 mr-2" />
            Publishing
          </button>
          </PermissionGuard>
          <button
            onClick={() => setShowExecutiveDashboard(true)}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg shadow-sm hover:bg-indigo-100 transition-colors flex items-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-colors flex items-center"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Pustaka
          </button>
        </div>
      </div>

      {!activePlan ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] animate-in fade-in zoom-in-95 duration-500 bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)]">
          <div className="w-20 h-20 bg-[#E8F0FE] text-[var(--color-eds-primary)] rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-eds-text-primary)] mb-3 tracking-tight">
            Belum ada Program Supervisi
          </h2>
          <p className="text-base text-[var(--color-eds-text-primary)] max-w-md mb-8 leading-relaxed font-medium">
            Anda belum memiliki Program Supervisi Akademik aktif. Buat program baru untuk mulai merencanakan jadwal observasi dan instrumen penilaian.
          </p>
          <PermissionGuard requiredPermission="MANAGE_PROGRAM">
          <button
            onClick={() => setShowWizard(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Buat Program Supervisi
          </button>
          </PermissionGuard>
        </div>
      ) : (
        /* Active Plan Draft View (Preview pending S7.2/Dashboard) */
        <>
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-6 border-b border-blue-100 bg-blue-50 flex items-center justify-between">
            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3 inline-block">DRAFT</span>
              <h3 className="text-xl font-bold text-slate-800">{activePlan.title}</h3>
            </div>
            <PermissionGuard requiredPermission="MANAGE_PROGRAM">
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors flex items-center"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              Edit Program
            </button>
            </PermissionGuard>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-slate-500 mb-1">Tahun Ajaran & Semester</h4>
              <p className="font-medium text-slate-900">{activePlan.calendarSnapshot.academicYear} - {activePlan.calendarSnapshot.semester}</p>
            </div>
            {(() => {
              try {
                const desc = JSON.parse(activePlan.description);
                return (
                  <>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 mb-1">Periode</h4>
                      <p className="font-medium text-slate-900">{desc.periode}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-bold text-slate-500 mb-1">Fokus Supervisi</h4>
                      <p className="font-medium text-slate-900">{desc.fokus}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-bold text-slate-500 mb-1">Sasaran Guru</h4>
                      <p className="font-medium text-slate-900">{desc.sasaran}</p>
                    </div>
                  </>
                );
              } catch (e) {
                return (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-slate-500 mb-1">Deskripsi</h4>
                    <p className="font-medium text-slate-900">{activePlan.description}</p>
                  </div>
                );
              }
            })()}
          </div>
        </div>
        <SupervisionTeacherAssignment planId={activePlan.id} />
        <SupervisionInstrumentSelection plan={activePlan} />
        <SupervisionScheduling plan={activePlan} onStartObservation={(scheduleId) => setActiveObservationScheduleId(scheduleId)} onStartPostObservation={(scheduleId) => setActivePostObservationScheduleId(scheduleId)} onStartRtl={(scheduleId) => setActiveRtlScheduleId(scheduleId)} />
      </>
      )}
    </div>
  );
};


export const SupervisionAcademicView = () => {
  return (
    <RoleGuard allowedRoles={['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR']}>
      <SupervisionAcademicViewInternal />
    </RoleGuard>
  );
};
