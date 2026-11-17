import React from 'react';
import { BookOpen, Target, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../Tampuyak';

export const LearningPlanningModule = () => {
  const { settings, updateSetting } = useApp();
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
  };

  const updateKesetaraan = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
  };

  const learningPolicy = settings?.learningPolicy || {
    principles: [],
    approach: '',
    planningPolicy: '',
    assessmentPolicy: [],
    inclusiveEducation: '',
    differentiationPolicy: '',
    digitalLearning: '',
    partnershipPolicy: ''
  };

  const updatePolicy = (field: string, value: any) => {
    updateSetting('learningPolicy', field, value);
  };

  const handleArrayChange = (field: 'principles' | 'assessmentPolicy', index: number, value: string) => {
    const arr = [...(learningPolicy[field] || [])];
    arr[index] = value;
    updatePolicy(field, arr);
  };

  const addArrayItem = (field: 'principles' | 'assessmentPolicy') => {
    const arr = [...(learningPolicy[field] || []), ''];
    updatePolicy(field, arr);
  };

  const removeArrayItem = (field: 'principles' | 'assessmentPolicy', index: number) => {
    const arr = [...(learningPolicy[field] || [])];
    arr.splice(index, 1);
    updatePolicy(field, arr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Perencanaan Pembelajaran (BAB IV)</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Prinsip Pembelajaran</label>
            {(learningPolicy.principles || []).map((p: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={p}
                  onChange={(e) => handleArrayChange('principles', idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem('principles', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                  Hapus
                </button>
              </div>
            ))}
            <button onClick={() => addArrayItem('principles')} className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Prinsip</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Pendekatan Pembelajaran</label>
            <textarea maxLength={2000}
              value={learningPolicy.approach || ''}
              onChange={(e) => updatePolicy('approach', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Perencanaan Pembelajaran</label>
            <textarea maxLength={2000}
              value={learningPolicy.planningPolicy || ''}
              onChange={(e) => updatePolicy('planningPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Kebijakan Asesmen</label>
            {(learningPolicy.assessmentPolicy || []).map((a: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={a}
                  onChange={(e) => handleArrayChange('assessmentPolicy', idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem('assessmentPolicy', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                  Hapus
                </button>
              </div>
            ))}
            <button onClick={() => addArrayItem('assessmentPolicy')} className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Kebijakan Asesmen</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Pemanfaatan Teknologi Digital</label>
            <textarea maxLength={2000}
              value={learningPolicy.digitalLearning || ''}
              onChange={(e) => updatePolicy('digitalLearning', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Pendidikan Inklusif</label>
            <textarea maxLength={2000}
              value={learningPolicy.inclusiveEducation || ''}
              onChange={(e) => updatePolicy('inclusiveEducation', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Pembelajaran Berdiferensiasi</label>
            <textarea maxLength={2000}
              value={learningPolicy.differentiationPolicy || ''}
              onChange={(e) => updatePolicy('differentiationPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Kemitraan Pembelajaran</label>
            <textarea maxLength={2000}
              value={learningPolicy.partnershipPolicy || ''}
              onChange={(e) => updatePolicy('partnershipPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {settings?.school?.level === 'PAUD' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Perencanaan Pembelajaran PAUD</label>
              <textarea maxLength={2000}
                value={paudMetadata.learningPlanning || ''}
                onChange={(e) => updatePaud('learningPlanning', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan perencanaan pembelajaran khusus PAUD..."
              />
            </div>
          )}

          {settings?.school?.level === 'Kesetaraan' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Perencanaan Andragogi (Kesetaraan)</label>
              <textarea maxLength={2000}
                value={kesetaraanMetadata.andragogyPlanning || ''}
                onChange={(e) => updateKesetaraan('andragogyPlanning', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan pendekatan andragogi untuk peserta didik..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
