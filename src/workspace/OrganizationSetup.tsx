import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../services/firestore/organizationService';
import { auth } from '../lib/firebase';
import { UserService } from '../services/firestore/userService';
import { getEffectiveUser } from '../services/auth/devAuth';

export default function OrganizationSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    schoolName: '', 
    npsn: '', 
    educationLevel: 'SD', 
    status: 'Negeri',
    address: '', 
    village: '', 
    district: '', 
    city: '', 
    province: '', 
    postalCode: ''
  });

  useEffect(() => {
    // Empty effect or remove it entirely
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const user = getEffectiveUser(auth.currentUser);
    if (!user) {
      setError('Not authenticated');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await OrganizationService.setupOrganization(user.uid, formData as any);
      // Wait a moment for firestore to sync before navigating
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to save organization profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="mb-8 border-b border-slate-200 pb-5">
            <h2 className="text-2xl font-bold text-slate-900">Pengaturan Organisasi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Silakan lengkapi profil organisasi Anda untuk melanjutkan.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Identitas Sekolah</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Nama Sekolah</label>
                  <input maxLength={255} type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">NPSN</label>
                  <input maxLength={255} type="text" name="npsn" value={formData.npsn} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Tingkat Pendidikan (Jenjang)</label>
                  <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                    <option value="PAUD">PAUD</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                    <option value="SLB">SLB</option>
                    <option value="Kesetaraan">Kesetaraan</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status Sekolah</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Lokasi Sekolah</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Alamat</label>
                  <input maxLength={255} type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Desa/Kelurahan</label>
                  <input maxLength={255} type="text" name="village" value={formData.village} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kecamatan</label>
                  <input maxLength={255} type="text" name="district" value={formData.district} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kabupaten/Kota</label>
                  <input maxLength={255} type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Provinsi</label>
                  <input maxLength={255} type="text" name="province" value={formData.province} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kode Pos</label>
                  <input maxLength={255} type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-200">
            <button type="button" onClick={handleSubmit} disabled={loading} className="w-full inline-flex justify-center items-center rounded border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan dan Masuk Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

