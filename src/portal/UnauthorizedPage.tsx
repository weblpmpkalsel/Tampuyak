import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100 mb-6">
          <AlertTriangle className="h-12 w-12 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Akses Ditolak</h2>
        <p className="text-slate-600 mb-8 px-4">
          Anda tidak memiliki izin untuk mengakses sumber daya ini atau sesi Anda telah berakhir.
        </p>
        
        <div className="mt-4 flex flex-col space-y-4">
          <Link to="/login" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg inline-block shadow-sm">
            Masuk Kembali
          </Link>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
