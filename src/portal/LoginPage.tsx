import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth/authService';
import { Eye, EyeOff } from 'lucide-react';

import { isDevAuthBypass } from '../services/auth/devAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await AuthService.login(formData.email, formData.password);
      
      
      
      // The session management and redirects will be handled by the layout or dashboard guard
      navigate('/dashboard');
    } catch (err: any) {
      let errMsg = 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Email atau kata sandi tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        errMsg = 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode login ini belum diaktifkan. Hubungi administrator.';
      }

      import('../services/firestore/auditService').then(m => {
        return m.AuditService.logEvent(
          'SYSTEM',
          'VIEWER' as any,
          'LOGIN_FAILED' as any,
          formData.email,
          { error: err.code || err.message }
        );
      }).catch(console.warn);

      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="h-12 w-auto object-contain" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Masuk ke Portal</h2>
            <p className="mt-2 text-sm text-slate-600">
              Atau{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                daftarkan institusi Anda
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Kata Sandi
                  </label>
                  <div className="relative mt-1">
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      autoComplete="current-password" 
                      required 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 pr-10 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1 hover:text-slate-700 focus:outline-none"
                      aria-label="Toggle password visibility"
                      title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="rememberMe" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-900">
                      Ingat saya
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Lupa kata sandi?
                    </Link>
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                    {loading ? 'Memproses...' : 'Masuk'}
                  </button>
                </div>
              </form>

              {isDevAuthBypass() && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-slate-50 px-2 text-slate-500">Development Only</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('[LoginPage] Developer Button Clicked');
                        navigate('/dashboard');
                      }}
                      className="flex w-full justify-center rounded-md border border-dashed border-slate-400 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Masuk Sebagai Developer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block border-l border-slate-200">
        <div className="absolute inset-0 bg-slate-100 flex flex-col justify-center items-center p-12 text-center">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Background" className="w-64 h-64 object-contain opacity-20 mb-8" />
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Akses Tersentralisasi</h3>
            <p className="text-slate-600 max-w-md">Pastikan Anda selalu menggunakan email institusi yang terdaftar untuk mengakses dokumen dan operasional sekolah Anda.</p>
        </div>
      </div>
    </div>
  );
}
