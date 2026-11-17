import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function RejectedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Registrasi Ditolak</h2>
        <p className="text-slate-600 mb-8 px-4">
          Mohon maaf, pengajuan pendaftaran institusi Anda telah ditolak oleh Administrator.
        </p>
        
        <div className="bg-white py-6 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Apa yang bisa dilakukan?</h3>
            <p className="text-sm text-slate-600 mb-4">
                Hal ini mungkin terjadi karena ketidaksesuaian data NPSN atau instansi sudah terdaftar sebelumnya.
            </p>
            <div className="space-y-3">
                <a href="mailto:support@tampuyak.os" className="flex w-full justify-center rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Hubungi Administrator
                </a>
                <Link to="/register" className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Ajukan Ulang
                </Link>
            </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
