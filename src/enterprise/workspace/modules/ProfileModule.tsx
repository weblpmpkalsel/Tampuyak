import React, { useState, useEffect } from 'react';
import { Building, Target, List, Flag, Map, Users, Plus, Trash2 } from 'lucide-react';
import { KnowledgeSuggestionPanel } from '../components/KnowledgeSuggestionPanel';

export const ProfileModule = ({ settings, updateSetting, activeModuleId }: any) => {
  const profile = settings?.enterpriseProfile || {};
  const identity = profile.identity || { 
    npsn: settings?.school?.npsn || '', 
    name: settings?.school?.name || '', 
    address: settings?.school?.address || '', 
    principalName: settings?.principal?.name || '', 
    principalNip: settings?.principal?.nip || '',
    status: settings?.school?.status || 'Negeri', 
    accreditation: settings?.school?.akreditasi || 'Belum Terakreditasi' 
  };
  const vision = profile.vision || settings?.identitas?.visi || '';
  const mission = profile.mission || (settings?.identitas?.misi?.length > 0 ? settings?.identitas?.misi : ['']);
  const goals = profile.goals || (settings?.identitas?.tujuan?.length > 0 ? settings?.identitas?.tujuan : ['']);
  const characteristics = profile.characteristics || {
    lokasi: settings?.potensi?.daerah || [],
    lingkungan: settings?.karakteristik?.sosialBudaya || '',
    pesertaDidik: settings?.karakteristik?.pesertaDidik || '',
    pendidik: settings?.karakteristik?.pendidik || '',
    orangTua: settings?.karakteristik?.kondisiNyata || ''
  };

  const kesetaraanMetadata = profile.kesetaraanMetadata || {};
  const paudMetadata = profile.paudMetadata || {};

  const updateIdentity = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'identity', { ...identity, [field]: value });
  };

  const updateCharacteristics = (field: string, value: any) => {
    updateSetting('enterpriseProfile', 'characteristics', { ...characteristics, [field]: value });
  };

  const updateKesetaraan = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'kesetaraanMetadata', { ...kesetaraanMetadata, [field]: value });
  };

  const updatePaud = (field: string, value: string) => {
    updateSetting('enterpriseProfile', 'paudMetadata', { ...paudMetadata, [field]: value });
  };

  const isBab1 = activeModuleId === 'bab1-karakteristik';
  const isBab2 = activeModuleId === 'bab2-arah-strategis';
  const [activeTab, setActiveTab] = useState(isBab2 ? 'vmt' : 'identity');
  
  useEffect(() => {
    if (isBab2) setActiveTab('vmt');
    else if (isBab1 && activeTab === 'vmt') setActiveTab('identity');
  }, [activeModuleId]);

  const tabs = isBab2 ? [
    { id: 'vmt', label: 'Visi, Misi, Tujuan', icon: Target }
  ] : [
    { id: 'identity', label: 'Identitas Sekolah', icon: Building },
    { id: 'characteristics', label: 'Karakteristik', icon: Map }
  ];

  const handleArrayChange = (type: 'mission'|'goals', index: number, value: string) => {
    const arr = type === 'mission' ? [...mission] : [...goals];
    arr[index] = value;
    updateSetting('enterpriseProfile', type, arr);
  };

  const addArrayItem = (type: 'mission'|'goals') => {
    const arr = type === 'mission' ? [...mission, ''] : [...goals, ''];
    updateSetting('enterpriseProfile', type, arr);
  };

  const removeArrayItem = (type: 'mission'|'goals', index: number) => {
    const arr = type === 'mission' ? [...mission] : [...goals];
    arr.splice(index, 1);
    updateSetting('enterpriseProfile', type, arr);
  };

  const lokasiOptions = ["Perkotaan", "Pedesaan", "Pegunungan", "Pesisir", "Kepulauan", "Perbatasan", "Kawasan Industri", "Kawasan Pertanian"];

  const toggleLokasi = (opt: string) => {
    const current = characteristics.lokasi || [];
    if (current.includes(opt)) {
      updateCharacteristics("lokasi", current.filter((i: string) => i !== opt));
    } else {
      updateCharacteristics("lokasi", [...current, opt]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profil Satuan Pendidikan Strategis</h2>
              <p className="text-sm text-slate-500">Informasi profil terpusat untuk pembuatan KSP Gold.</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'identity' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Sekolah</label>
                  <input maxLength={255}
                    type="text"
                    value={identity.name}
                    onChange={(e) => updateIdentity('name', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    placeholder="mis. SDN 1 Tampuyak"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">NPSN</label>
                  <input maxLength={255}
                    type="text"
                    value={identity.npsn}
                    onChange={(e) => updateIdentity('npsn', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    placeholder="mis. 10293847"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nama Kepala Sekolah</label>
                    <input maxLength={255}
                      type="text"
                      value={identity.principalName || ''}
                      onChange={(e) => updateIdentity('principalName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      placeholder="mis. Budi Santoso, S.Pd"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">NIP Kepala Sekolah</label>
                    <input maxLength={255}
                      type="text"
                      value={identity.principalNip || ''}
                      onChange={(e) => updateIdentity('principalNip', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      placeholder="NIP Kepala Sekolah"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select
                      value={identity.status}
                      onChange={(e) => updateIdentity('status', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    >
                      <option>Negeri</option>
                      <option>Swasta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Akreditasi</label>
                    <select
                      value={identity.accreditation}
                      onChange={(e) => updateIdentity('accreditation', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>TT</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Alamat</label>
                  <textarea maxLength={2000}
                    value={identity.address}
                    onChange={(e) => updateIdentity('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    placeholder="Alamat lengkap sekolah"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vmt' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-indigo-500" />
                  School Vision
                </label>
                <KnowledgeSuggestionPanel 
                  category="SCHOOL_VISION"
                  context={{ 
                    location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                  }}
                  onSelect={(text, mode) => {
                    if (mode === 'replace') {
                      updateSetting('enterpriseProfile', 'vision', text);
                    } else {
                      const current = vision || '';
                      const newValue = current ? `${current}\n\n${text}` : text;
                      updateSetting('enterpriseProfile', 'vision', newValue);
                    }
                  }}
                />
                <textarea maxLength={2000}
                  value={vision}
                  onChange={(e) => updateSetting('enterpriseProfile', 'vision', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                  placeholder="Masukkan pernyataan visi sekolah..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <List className="w-4 h-4 text-emerald-500" />
                  School Mission
                </label>
                <KnowledgeSuggestionPanel 
                  category="SCHOOL_MISSION"
                  context={{ 
                    location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                  }}
                  onSelect={(text, mode) => {
                    if (mode === 'replace') {
                      updateSetting('enterpriseProfile', 'mission', text.split('\n').filter(Boolean));
                    } else {
                      const newItems = text.split('\n').filter(Boolean);
                      updateSetting('enterpriseProfile', 'mission', [...mission, ...newItems]);
                    }
                  }}
                />
                <div className="space-y-3">
                  {mission.map((m: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-8 h-10 flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold rounded-lg shrink-0">
                        {idx + 1}
                      </div>
                      <input maxLength={255}
                        type="text"
                        value={m}
                        onChange={(e) => handleArrayChange('mission', idx, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                        placeholder="Pernyataan misi..."
                      />
                      <button
                        onClick={() => removeArrayItem('mission', idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('mission')}
                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 py-2 px-3 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Tambah Misi
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  School Goals
                </label>
                <KnowledgeSuggestionPanel 
                  category="SCHOOL_GOALS"
                  context={{ 
                    location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                  }}
                  onSelect={(text, mode) => {
                    if (mode === 'replace') {
                      updateSetting('enterpriseProfile', 'goals', text.split('\n').filter(Boolean));
                    } else {
                      const newItems = text.split('\n').filter(Boolean);
                      updateSetting('enterpriseProfile', 'goals', [...goals, ...newItems]);
                    }
                  }}
                />
                <div className="space-y-3">
                  {goals.map((g: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-8 h-10 flex items-center justify-center bg-amber-50 text-amber-700 font-bold rounded-lg shrink-0">
                        {idx + 1}
                      </div>
                      <input maxLength={255}
                        type="text"
                        value={g}
                        onChange={(e) => handleArrayChange('goals', idx, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                        placeholder="Pernyataan tujuan..."
                      />
                      <button
                        onClick={() => removeArrayItem('goals', idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('goals')}
                    className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 py-2 px-3 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Tambah Tujuan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">Jenis Lokasi</label>
                <div className="flex flex-wrap gap-2">
                  {lokasiOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleLokasi(opt)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        characteristics.lokasi?.includes(opt) 
                          ? "bg-indigo-600 text-white border-indigo-600" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 mb-2 block">Konteks Lingkungan</label>
                <KnowledgeSuggestionPanel 
                  category="SCHOOL_ENVIRONMENT"
                  context={{ 
                    location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                  }}
                  onSelect={(text, mode) => {
                    if (mode === 'replace') {
                      updateCharacteristics('lingkungan', text);
                    } else {
                      const current = characteristics.lingkungan || '';
                      const newValue = current ? `${current}\n\n${text}` : text;
                      updateCharacteristics('lingkungan', newValue);
                    }
                  }}
                />
                <textarea maxLength={2000}
                  value={characteristics.lingkungan}
                  onChange={(e) => updateCharacteristics('lingkungan', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                  placeholder="Deskripsikan lingkungan sosial dan fisik..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 mb-2 block">Karakteristik Peserta Didik</label>
                <KnowledgeSuggestionPanel 
                  category="STUDENT_CHARACTERISTICS"
                  context={{ 
                    location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                  }}
                  onSelect={(text, mode) => {
                    if (mode === 'replace') {
                      updateCharacteristics('pesertaDidik', text);
                    } else {
                      const current = characteristics.pesertaDidik || '';
                      const newValue = current ? `${current}\n\n${text}` : text;
                      updateCharacteristics('pesertaDidik', newValue);
                    }
                  }}
                />
                <textarea maxLength={2000}
                  value={characteristics.pesertaDidik}
                  onChange={(e) => updateCharacteristics('pesertaDidik', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                  placeholder="Deskripsikan demografi dan kebutuhan belajar peserta didik..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Profil Pendidik</label>
                  <KnowledgeSuggestionPanel 
                    category="TEACHER_CHARACTERISTICS"
                    context={{ 
                      location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                    }}
                    onSelect={(text, mode) => {
                      if (mode === 'replace') {
                        updateCharacteristics('pendidik', text);
                      } else {
                        const current = characteristics.pendidik || '';
                        const newValue = current ? `${current}\n\n${text}` : text;
                        updateCharacteristics('pendidik', newValue);
                      }
                    }}
                  />
                  <textarea maxLength={2000}
                    value={characteristics.pendidik}
                    onChange={(e) => updateCharacteristics('pendidik', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                    placeholder="Deskripsikan kualifikasi dan karakteristik pendidik..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 mb-2 block">Profil Orang Tua</label>
                  <KnowledgeSuggestionPanel 
                    category="PARENT_CHARACTERISTICS"
                    context={{ 
                      location: characteristics.lokasi && characteristics.lokasi.length > 0 ? characteristics.lokasi[0] : undefined
                    }}
                    onSelect={(text, mode) => {
                      if (mode === 'replace') {
                        updateCharacteristics('orangTua', text);
                      } else {
                        const current = characteristics.orangTua || '';
                        const newValue = current ? `${current}\n\n${text}` : text;
                        updateCharacteristics('orangTua', newValue);
                      }
                    }}
                  />
                  <textarea maxLength={2000}
                    value={characteristics.orangTua}
                    onChange={(e) => updateCharacteristics('orangTua', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                    placeholder="Deskripsikan demografi dan keterlibatan orang tua..."
                  />
                </div>
              </div>

              {settings?.school?.level === 'Kesetaraan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Karakteristik Tutor (Kesetaraan)</label>
                    <textarea maxLength={2000}
                      value={kesetaraanMetadata.tutorCharacteristics || ''}
                      onChange={(e) => updateKesetaraan('tutorCharacteristics', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                      placeholder="Deskripsikan karakteristik tutor kesetaraan..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 mb-2 block">Kemitraan DUDI (Kesetaraan)</label>
                    <textarea maxLength={2000}
                      value={kesetaraanMetadata.partnershipDUDI || ''}
                      onChange={(e) => updateKesetaraan('partnershipDUDI', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                      placeholder="Deskripsikan kemitraan dengan DUDI..."
                    />
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
