import React from 'react';
import { Target } from 'lucide-react';
import { useApp } from '../../../Tampuyak';

export const EvaluationHubModule = () => {
  const { settings, updateSetting } = useApp();
  const paudMetadata = settings?.enterpriseProfile?.paudMetadata || {};
  const kesetaraanMetadata = settings?.enterpriseProfile?.kesetaraanMetadata || {};

  const updatePaud = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
  };

  const updateKesetaraan = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
  };

  const evaluation = settings?.evaluation || {
    evaluationMechanisms: [],
    schedule: '',
    responsibleParties: [],
    monitoringPolicy: '',
    academicSupervision: '',
    continuousImprovement: '',
    qualityAssurance: '',
    followUpPlanning: '',
    schoolLevelMentoring: ''
  };

  const updateEval = (field: string, value: any) => {
    updateSetting('evaluation', field, value);
  };

  const handleArrayChange = (field: 'evaluationMechanisms' | 'responsibleParties' | 'professionalDevelopment', index: number, value: string) => {
    const arr = [...(evaluation[field] || [])];
    arr[index] = value;
    updateEval(field, arr);
  };

  const addArrayItem = (field: 'evaluationMechanisms' | 'responsibleParties' | 'professionalDevelopment') => {
    const arr = [...(evaluation[field] || []), ''];
    updateEval(field, arr);
  };

  const removeArrayItem = (field: 'evaluationMechanisms' | 'responsibleParties' | 'professionalDevelopment', index: number) => {
    const arr = [...(evaluation[field] || [])];
    arr.splice(index, 1);
    updateEval(field, arr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Evaluasi & Pengembangan (BAB V)</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Mekanisme Evaluasi</label>
            {(evaluation.evaluationMechanisms || []).map((m: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={m}
                  onChange={(e) => handleArrayChange('evaluationMechanisms', idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem('evaluationMechanisms', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('evaluationMechanisms')} className="text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Mekanisme</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Jadwal Evaluasi</label>
            <input maxLength={255}
              type="text"
              value={evaluation.schedule || ''}
              onChange={(e) => updateEval('schedule', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Pihak yang Bertanggung Jawab</label>
            {(evaluation.responsibleParties || []).map((m: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={m}
                  onChange={(e) => handleArrayChange('responsibleParties', idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem('responsibleParties', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('responsibleParties')} className="text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Pihak Terlibat</button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Kebijakan Monitoring</label>
            <textarea maxLength={2000}
              value={evaluation.monitoringPolicy || ''}
              onChange={(e) => updateEval('monitoringPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Pengembangan Profesional Pendidik</label>
            {(evaluation.professionalDevelopment || []).map((m: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={m}
                  onChange={(e) => handleArrayChange('professionalDevelopment', idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem('professionalDevelopment', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('professionalDevelopment')} className="text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Program Pengembangan</button>
          </div>

            <label className="text-sm font-bold text-slate-900">Tindak Lanjut & Peningkatan Berkelanjutan</label>
            <textarea maxLength={2000}
              value={evaluation.followUpPlanning || ''}
              onChange={(e) => updateEval('followUpPlanning', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {settings?.school?.level === 'PAUD' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Asesmen Otentik (PAUD)</label>
              <textarea maxLength={2000}
                value={paudMetadata.authenticAssessment || ''}
                onChange={(e) => updatePaud('authenticAssessment', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan asesmen otentik untuk anak usia dini..."
              />
            </div>
          )}

          {settings?.school?.level === 'Kesetaraan' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Evaluasi Program Keterampilan (Kesetaraan)</label>
              <textarea maxLength={2000}
                value={kesetaraanMetadata.programEvaluation || ''}
                onChange={(e) => updateKesetaraan('programEvaluation', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors resize-none"
                placeholder="Deskripsikan evaluasi program vokasional..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
