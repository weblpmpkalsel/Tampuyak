import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminService } from '../services/admin/adminService';
import { Search, Eye, CheckCircle, Ban } from 'lucide-react';
import { useApp } from '../Tampuyak';
import { PermissionService } from '../services/auth/permissionService';
import { auth } from '../lib/firebase';
import { getEffectiveUser } from '../services/auth/devAuth';

export function ApprovalsView({ onClose }: { onClose?: () => void }) {
  const app = useApp();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rSnap = await getDocs(query(collection(db, 'users')));
      setRequests(rSnap.docs.map(d => ({ ...d.data(), id: d.id })).filter((d: any) => d.status === 'PENDING'));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const user = getEffectiveUser(auth.currentUser);
    if (!user) return;
    try {
      await AdminService.activateUser(user.uid, 'SUPER_ADMIN' as any, id);
      fetchData();
      if (onClose) onClose();
      else if (app?.setCurrentView) app.setCurrentView('dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    const user = getEffectiveUser(auth.currentUser);
    if (!user) return;
    try {
      await AdminService.rejectUser(user.uid, 'SUPER_ADMIN' as any, id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-bold text-slate-800">Persetujuan Pendaftaran</h2>
        <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-64 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input maxLength={255} type="text" placeholder="Cari permohonan..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Email Pemohon</th>
              <th className="p-4 font-semibold">Nama Pemohon</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Memuat permohonan...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Tidak ada permohonan pendaftaran.</td></tr>
            ) : (
              requests.map(req => (
                <tr key={req.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 text-sm text-slate-800 font-mono text-xs">{req.email}</td>
                  <td className="p-4 text-sm text-slate-600">{req.displayName}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    {req.status === 'PENDING' && (
                      <React.Fragment>
                        <button onClick={() => handleApprove(req.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Setujui"><CheckCircle size={16} /></button>
                        <button onClick={() => handleReject(req.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Tolak"><Ban size={16} /></button>
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
