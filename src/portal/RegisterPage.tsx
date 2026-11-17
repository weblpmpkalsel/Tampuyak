import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth/authService';
import { UserService } from '../services/firestore/userService';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  
  const [formData, setFormData] = useState({
    school_name: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.agreeTerms) {
      setError('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const user = await AuthService.register(formData.email, formData.password);
      
      // 2. Create User Profile with exact requested fields
      await UserService.createUserProfile({
        uid: user.uid,
        email: user.email || formData.email,
        displayName: formData.school_name || formData.email.split('@')[0],
        schoolName: formData.school_name,
        role: 'SCHOOL_ADMIN',
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // 6. Redirect to pending
      navigate('/dashboard');
    } catch (err: any) {
      let errMsg = 'Gagal mendaftar. Silakan coba lagi.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email sudah digunakan. Silakan gunakan email lain atau masuk.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Kata sandi terlalu lemah. Minimal 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode pendaftaran ini belum diaktifkan. Hubungi administrator.';
      }
      import('../services/firestore/auditService').then(m => {
        return m.AuditService.logEvent(
          'SYSTEM',
          'VIEWER' as any,
          'REGISTER_FAILED' as any,
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-[72px] h-[72px] md:w-24 md:h-24 object-contain" />
        </div>
        <h2 className="mt-6 text-center text-[36px] md:text-3xl font-bold tracking-tight text-slate-900">
          Registrasi Institusi
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Atau{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            masuk jika sudah memiliki akun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Account Info */}
              <div className="col-span-1">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Informasi Akun</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Nama Sekolah / Institusi</label>
                <div className="mt-1">
                  <input name="school_name" type="text" placeholder="Contoh: SDN 1 Sukamaju" required value={formData.school_name} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Utama</label>
                <div className="mt-1">
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
                <div className="relative mt-1">
                  <input name="password" type={showPasswordRegister ? "text" : "password"} required value={formData.password} onChange={handleChange} className="block w-full min-h-[48px] appearance-none rounded-md border border-slate-300 px-3 py-2 pr-10 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                  <button
                    type="button"
                    onClick={() => setShowPasswordRegister(!showPasswordRegister)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1 hover:text-slate-700 focus:outline-none"
                    aria-label="Toggle password visibility"
                    title={showPasswordRegister ? "Sembunyikan sandi" : "Lihat sandi"}
                  >
                    {showPasswordRegister ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              </div>
            <div className="flex items-center">
              <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-slate-900">
                Saya menyetujui <a href="#" className="text-blue-600 hover:text-blue-500">Syarat dan Ketentuan</a> serta Kebijakan Privasi
              </label>
            </div>

            <div>
              <button type="submit" disabled={loading} className="flex w-full min-h-[50px] items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
