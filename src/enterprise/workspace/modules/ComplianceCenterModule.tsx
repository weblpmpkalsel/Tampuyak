import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ComplianceCenterModule = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm opacity-70">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Pusat Kepatuhan</h2>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          Modul masa depan untuk mengaudit Kesesuaian Dokumen, Peraturan Pemerintah, dan Standar Persetujuan.
        </p>
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-sm font-medium">
          [Tempat Modul Masa Depan]
        </div>
      </div>
    </div>
  );
};
