import React from 'react';
import { FileText, Save, Users } from 'lucide-react';
import { useApp } from '../../../Tampuyak';

export const AdministrativeMetadataModule = () => {
  const { settings, updateSetting } = useApp();
  const admin = settings?.administrative || {
    documentNumber: settings?.administrasi?.nomorSurat || '',
    academicYear: settings?.academicYears?.find((y: any) => y.isActive)?.name || '',
    approvalDate: settings?.administrasi?.tanggalPenetapan || '',
    committeeName: settings?.komite?.name || '',
    principalName: settings?.principal?.name || '',
    principalNip: settings?.principal?.nip || '',
    supervisorName: settings?.pengawas?.name || '',
    supervisorNip: settings?.pengawas?.nip || '',
    educationOfficeName: settings?.kepalaDinas?.name || '',
    educationOfficeNip: settings?.kepalaDinas?.nip || '',
    educationOfficeRegion: settings?.kepalaDinas?.region || settings?.school?.regency || ''
  };

  const updateAdmin = (field: string, value: string) => {
    updateSetting('administrative', field, value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Administrasi Dokumen</h2>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Tim Penyusun (Drafting Team)</h2>
        </div>
        <div className="space-y-4">
          {(settings?.draftingTeam || []).map((member: any, idx: number) => (
            <div key={idx} className="flex gap-4 items-center">
              <input maxLength={255}
                type="text"
                placeholder="Nama Lengkap"
                value={member.name || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], name: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <input maxLength={255}
                type="text"
                placeholder="Peran (mis: Ketua Tim)"
                value={member.role || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], role: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                onClick={() => {
                  const n = [...(settings?.draftingTeam || [])];
                  n.splice(idx, 1);
                  updateSetting('draftingTeam', '', n);
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const n = [...(settings?.draftingTeam || []), { name: '', role: '' }];
              updateSetting('draftingTeam', '', n);
            }}
            className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            + Tambah Anggota Tim
          </button>
        </div>
      </div>
    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nomor Dokumen</label>
            <input maxLength={255}
              type="text"
              value={admin.documentNumber || ''}
              onChange={(e) => updateAdmin('documentNumber', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              placeholder="mis. 421.2/001/SD-XXX/2026"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Tahun Ajaran</label>
            <input maxLength={255}
              type="text"
              value={admin.academicYear || ''}
              onChange={(e) => updateAdmin('academicYear', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              placeholder="mis. 2026/2027"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Tempat Penetapan</label>
            <input maxLength={255}
              type="text"
              value={admin.establishmentPlace || ''}
              onChange={(e) => updateAdmin('establishmentPlace', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              placeholder="mis. Jakarta"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Tanggal Penetapan</label>
            <input
              type="date"
              value={admin.establishmentDate || ''}
              onChange={(e) => updateAdmin('establishmentDate', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Tim Penyusun (Drafting Team)</h2>
        </div>
        <div className="space-y-4">
          {(settings?.draftingTeam || []).map((member: any, idx: number) => (
            <div key={idx} className="flex gap-4 items-center">
              <input maxLength={255}
                type="text"
                placeholder="Nama Lengkap"
                value={member.name || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], name: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <input maxLength={255}
                type="text"
                placeholder="Peran (mis: Ketua Tim)"
                value={member.role || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], role: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                onClick={() => {
                  const n = [...(settings?.draftingTeam || [])];
                  n.splice(idx, 1);
                  updateSetting('draftingTeam', '', n);
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const n = [...(settings?.draftingTeam || []), { name: '', role: '' }];
              updateSetting('draftingTeam', '', n);
            }}
            className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            + Tambah Anggota Tim
          </button>
        </div>
      </div>
    </div>
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Pihak Penandatangan</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nama Pengawas Sekolah</label>
              <input maxLength={255}
                type="text"
                value={admin.supervisorName || ''}
                onChange={(e) => updateAdmin('supervisorName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="Nama lengkap dengan gelar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">NIP Pengawas Sekolah</label>
              <input maxLength={255}
                type="text"
                value={admin.supervisorNip || ''}
                onChange={(e) => updateAdmin('supervisorNip', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="NIP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nama Kepala Dinas Pendidikan</label>
              <input maxLength={255}
                type="text"
                value={admin.headOfOfficeName || ''}
                onChange={(e) => updateAdmin('headOfOfficeName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="Nama lengkap dengan gelar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">NIP Kepala Dinas Pendidikan</label>
              <input maxLength={255}
                type="text"
                value={admin.headOfOfficeNip || ''}
                onChange={(e) => updateAdmin('headOfOfficeNip', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="NIP"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Jabatan Kepala Dinas Pendidikan</label>
              <input maxLength={255}
                type="text"
                value={admin.headOfOfficePosition || ''}
                onChange={(e) => updateAdmin('headOfOfficePosition', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="Kepala Dinas Pendidikan..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nama Ketua Komite Sekolah</label>
              <input maxLength={255}
                type="text"
                value={admin.committeeName || ''}
                onChange={(e) => updateAdmin('committeeName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="Nama Lengkap"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Tim Penyusun (Drafting Team)</h2>
        </div>
        <div className="space-y-4">
          {(settings?.draftingTeam || []).map((member: any, idx: number) => (
            <div key={idx} className="flex gap-4 items-center">
              <input maxLength={255}
                type="text"
                placeholder="Nama Lengkap"
                value={member.name || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], name: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <input maxLength={255}
                type="text"
                placeholder="Peran (mis: Ketua Tim)"
                value={member.role || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], role: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                onClick={() => {
                  const n = [...(settings?.draftingTeam || [])];
                  n.splice(idx, 1);
                  updateSetting('draftingTeam', '', n);
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const n = [...(settings?.draftingTeam || []), { name: '', role: '' }];
              updateSetting('draftingTeam', '', n);
            }}
            className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            + Tambah Anggota Tim
          </button>
        </div>
      </div>
    </div>
  );
};
