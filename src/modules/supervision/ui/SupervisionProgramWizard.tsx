import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { useSupervision } from '../context/useSupervision';
import { SupervisionStatus } from '../types/SupervisionTypes';


export const SupervisionProgramWizard = ({ onCancel, onSaved }: { onCancel: () => void, onSaved: () => void }) => {
  const { repositories } = useSupervision();
  const supervisionRepo = repositories.getSupervisionRepository();
  const { state, dispatch, applicationService } = useSupervision();
  
  // Use existing draft or initial empty state
  const initialDraft: any = state.draft.planDraft || {};
  
  const [academicYear, setAcademicYear] = useState(initialDraft.academicYear || '2026/2027');
  const [semester, setSemester] = useState(initialDraft.semester || 'Ganjil');
  const [periode, setPeriode] = useState(initialDraft.periode || '');
  const [fokus, setFokus] = useState(initialDraft.fokus || '');
  const [sasaran, setSasaran] = useState(initialDraft.sasaran || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Create description from custom fields
      const description = JSON.stringify({
        periode,
        fokus,
        sasaran
      });

      // Construct Title
      const title = `Program Supervisi ${semester} ${academicYear}`;

      // Run Domain Logic via Application Service
      const plan = applicationService.createSupervisionPlan({
        title,
        description,
        academicYear,
        semester
      });

      // Override status to DRAFT
      plan.status = SupervisionStatus.DRAFT;

      // Save to repository
      const savedPlan = await supervisionRepo.create({
        planId: plan.id,
        title: plan.title,
        academicYear: plan.calendarSnapshot.academicYear,
        semester: plan.calendarSnapshot.semester
      });
      
      // Update with the stringified description
      const finalPlan = await supervisionRepo.update(savedPlan.id, { description });

      // Clear draft form in context
      dispatch({ type: 'CLEAR_DRAFTS' });

      // Update plans in context
      const existingPlans = await supervisionRepo.findAll();
      dispatch({ type: 'SET_PLANS', payload: existingPlans });

      // Set active plan
      dispatch({ type: 'SET_ACTIVE_PLAN', payload: finalPlan.id });

      onSaved();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSaveDraft = () => {
    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        key: 'planDraft',
        value: {
          academicYear,
          semester,
          periode,
          fokus,
          sasaran
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-eds-text-primary)] mb-1">
            Buat Program Supervisi
          </h2>
          <p className="text-sm text-[var(--color-eds-text-secondary)]">
            Tentukan parameter utama untuk program supervisi akademik semester ini.
          </p>
        </div>
        <button 
          onClick={() => {
            handleAutoSaveDraft();
            onCancel();
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-eds-border)] bg-slate-50">
          <h3 className="font-bold text-slate-800">Detail Program</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tahun Ajaran</label>
              <select 
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                onBlur={handleAutoSaveDraft}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Semester</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                onBlur={handleAutoSaveDraft}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Periode Pelaksanaan</label>
            <input 
              type="text" 
              placeholder="Contoh: Agustus - November 2026"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              onBlur={handleAutoSaveDraft}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Rentang waktu pelaksanaan observasi dan tindak lanjut.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fokus Supervisi</label>
            <textarea 
              rows={3}
              placeholder="Contoh: Penggunaan media pembelajaran interaktif berbasis teknologi..."
              value={fokus}
              onChange={(e) => setFokus(e.target.value)}
              onBlur={handleAutoSaveDraft}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sasaran Guru</label>
            <textarea 
              rows={3}
              placeholder="Contoh: 12 Guru Kelas dan 4 Guru Mata Pelajaran"
              value={sasaran}
              onChange={(e) => setSasaran(e.target.value)}
              onBlur={handleAutoSaveDraft}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--color-eds-border)] bg-slate-50 flex justify-end">
          <button 
            onClick={handleSaveDraft}
            disabled={isSaving || !periode || !fokus || !sasaran}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
        </div>
      </div>
    </div>
  );
};
