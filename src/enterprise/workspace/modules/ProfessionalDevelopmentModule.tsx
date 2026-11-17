import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useApp } from '../../../Tampuyak';

export const ProfessionalDevelopmentModule = () => {
  const { settings, updateSetting } = useApp();
  const evaluation = settings?.evaluation || {
    professionalDevelopment: []
  };

  const updateEval = (field: string, value: any) => {
    updateSetting('evaluation', field, value);
  };

  const handleArrayChange = (index: number, value: string) => {
    const arr = [...(evaluation.professionalDevelopment || [])];
    arr[index] = value;
    updateEval('professionalDevelopment', arr);
  };

  const addArrayItem = () => {
    const arr = [...(evaluation.professionalDevelopment || []), ''];
    updateEval('professionalDevelopment', arr);
  };

  const removeArrayItem = (index: number) => {
    const arr = [...(evaluation.professionalDevelopment || [])];
    arr.splice(index, 1);
    updateEval('professionalDevelopment', arr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Pengembangan Profesional (BAB V)</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">Kebijakan Pengembangan Profesional</label>
            {(evaluation.professionalDevelopment || []).map((m: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input maxLength={255}
                  type="text"
                  value={m}
                  onChange={(e) => handleArrayChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
                />
                <button onClick={() => removeArrayItem(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem()} className="text-sm font-bold text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors">+ Tambah Kebijakan</button>
          </div>
        </div>
      </div>
    </div>
  );
};
