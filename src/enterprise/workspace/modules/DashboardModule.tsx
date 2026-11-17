import React from 'react';
 // assuming Card exists, or we use a basic div
import { LayoutDashboard } from 'lucide-react';

export const DashboardModule = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 bg-white rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Beranda Enterprise</h2>
        </div>
        <p className="text-slate-600 text-sm">
          Selamat datang di Enterprise Workspace baru. Beranda ini akan memberikan ringkasan kemajuan KSP dan metrik kepatuhan Anda.
        </p>
      </div>
    </div>
  );
};
