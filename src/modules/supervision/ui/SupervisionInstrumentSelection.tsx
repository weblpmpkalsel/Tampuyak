import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '../auth/SupervisionGuards';
import { FileSignature, CheckCircle, AlertCircle, Eye, Info } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { SupervisionInstrument, SupervisionPlan } from '../types/SupervisionTypes';


export const SupervisionInstrumentSelection = ({ plan }: { plan: SupervisionPlan }) => {
  const { repositories } = useSupervision();
  const instrumentRepo = repositories.getInstrumentRepository();
  const supervisionRepo = repositories.getSupervisionRepository();
  const { applicationService, dispatch, state } = useSupervision();
  const [templates, setTemplates] = useState<SupervisionInstrument[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await instrumentRepo.findAll();
    setTemplates(data);
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const assignedTeachersCount = state.schedules.schedules.filter(s => s.planId === plan.id).length;

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const updatedPlan = applicationService.configureProgramInstrument({
        plan,
        template: selectedTemplate
      });

      await supervisionRepo.update(plan.id, updatedPlan);

      dispatch({ type: 'SET_ACTIVE_PLAN', payload: plan.id });
      
      const updatedPlans = await supervisionRepo.findAll();
      dispatch({ type: 'SET_PLANS', payload: updatedPlans });
      
      setShowReview(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (plan.instrumentSnapshot) {
    return (
      <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mt-6 flex items-start">
        <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-emerald-900 mb-1">Instrumen Telah Dikonfigurasi</h3>
          <p className="text-emerald-700 text-sm">
            Program ini menggunakan instrumen: <strong>{plan.instrumentSnapshot.name}</strong>.
            Status program saat ini: <strong>READY_FOR_SCHEDULING</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard requiredPermission="MANAGE_INSTRUMENT" fallback={
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mt-6">
        <p className="text-amber-800 font-medium text-sm text-center">Instrumen belum dikonfigurasi. Menunggu Kepala Sekolah/Pengawas.</p>
      </div>
    }>
    <>
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] mt-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-6 border-b border-[var(--color-eds-border)] bg-slate-50 flex items-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Konfigurasi Instrumen</h3>
            <p className="text-sm text-slate-500">Pilih template instrumen untuk program supervisi ini.</p>
          </div>
        </div>
        
        <div className="p-6">
          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
              <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-slate-600 font-medium text-sm">Pustaka instrumen masih kosong.</p>
              <p className="text-slate-500 text-xs mt-1">Buat template instrumen terlebih dahulu di menu Pustaka Instrumen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`border p-4 rounded-xl cursor-pointer transition-all ${selectedTemplateId === template.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{template.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {template.categories.length} Kategori &bull; {template.items.length} Indikator
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowReview(true)}
                  disabled={!selectedTemplateId}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Konfigurasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Review Konfigurasi Program</h2>
              <p className="text-sm text-slate-500 mt-1">Pastikan data berikut sudah benar sebelum program dikunci.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                  Setelah Anda mengonfirmasi, instrumen akan di-snapshot dan <strong>dikunci</strong>. Anda tidak dapat mengubah template instrumen setelah ini.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Tahun Ajaran</span>
                  <span className="text-slate-800 font-bold text-sm">{plan.calendarSnapshot.academicYear}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Semester</span>
                  <span className="text-slate-800 font-bold text-sm">{plan.calendarSnapshot.semester}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Guru Sasaran</span>
                  <span className="text-slate-800 font-bold text-sm">{assignedTeachersCount} Guru</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Template Instrumen</span>
                  <span className="text-slate-800 font-bold text-sm">{selectedTemplate.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Jumlah Rubrik</span>
                  <span className="text-slate-800 font-bold text-sm">{selectedTemplate.categories.length} Kategori</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Jumlah Indikator</span>
                  <span className="text-slate-800 font-bold text-sm">{selectedTemplate.items.length} Indikator</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowReview(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleApplyTemplate}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
              >
                Kunci & Siapkan Program
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    </PermissionGuard>
  );
};
