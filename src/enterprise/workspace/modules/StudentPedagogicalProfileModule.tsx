import React from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../../../Tampuyak';

const LEARNING_NEEDS_OPTIONS = [
  'Visual',
  'Auditori',
  'Kinestetik',
  'Membaca/Menulis',
  'Berbasis Proyek',
  'Berbasis Praktik',
  'Pembelajaran Digital',
  'Pembelajaran Berdiferensiasi',
  'Lainnya'
];

export const StudentPedagogicalProfileModule = () => {
  const { settings, updateSetting } = useApp();
  const profile = settings.studentProfile || {
    studentPotential: settings.karakteristik?.pesertaDidik || '',
    learningChallenges: '',
    recommendedLearningStrategy: ''
  };

  const handleUpdate = (field: string, value: any) => {
    updateSetting('studentProfile', '', {
      ...profile,
      [field]: value
    });
  };

  const toggleLearningNeed = (need: string) => {
    const current = profile.dominantLearningNeeds || [];
    if (current.includes(need)) {
      handleUpdate('dominantLearningNeeds', current.filter((n: string) => n !== need));
    } else {
      handleUpdate('dominantLearningNeeds', [...current, need]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Profil Pedagogik Peserta Didik</h2>
        </div>
        <p className="text-slate-600 text-sm mb-6">
          Petakan karakteristik peserta didik, kebutuhan belajar, potensi, dan strategi untuk menghasilkan pendekatan pendidikan berbasis data.
        </p>

        <div className="space-y-6">
          {/* Kebutuhan Belajar Dominan */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Kebutuhan Belajar Dominan
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LEARNING_NEEDS_OPTIONS.map((need) => {
                const isSelected = (profile.dominantLearningNeeds || []).includes(need);
                return (
                  <button
                    key={need}
                    onClick={() => toggleLearningNeed(need)}
                    className={`flex items-center justify-start px-3 py-2 text-sm rounded-lg border transition-colors ${
                      isSelected 
                        ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                      isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {need}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Potensi Peserta Didik */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Potensi Peserta Didik
            </label>
            <textarea maxLength={2000}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              rows={3}
              placeholder="Deskripsikan potensi, bakat, dan sifat positif populasi peserta didik secara keseluruhan..."
              value={profile.studentPotential || ''}
              onChange={(e) => handleUpdate('studentPotential', e.target.value)}
            />
          </div>

          {/* Tantangan Belajar */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Tantangan Belajar
            </label>
            <textarea maxLength={2000}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              rows={3}
              placeholder="Rincikan hambatan umum, kesulitan, atau tantangan klinis yang dihadapi peserta didik..."
              value={profile.learningChallenges || ''}
              onChange={(e) => handleUpdate('learningChallenges', e.target.value)}
            />
          </div>

          {/* Rekomendasi Strategi Pembelajaran */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Rekomendasi Strategi Pembelajaran
            </label>
            <textarea maxLength={2000}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              rows={3}
              placeholder="Uraikan strategi instruksional, pendekatan berdiferensiasi, dan intervensi yang ditargetkan..."
              value={profile.recommendedLearningStrategy || ''}
              onChange={(e) => handleUpdate('recommendedLearningStrategy', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
