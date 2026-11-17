import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../services/auth/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      await AuthService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim tautan. Periksa kembali email Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <Link to="/">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="h-12 w-auto object-contain" />
            </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Atur Ulang Sandi</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Masukkan email yang terdaftar untuk menerima tautan atur ulang.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-4">
              <p className="text-sm text-emerald-700">Tautan atur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                {loading ? 'Mengirim...' : 'Kirim Tautan'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
