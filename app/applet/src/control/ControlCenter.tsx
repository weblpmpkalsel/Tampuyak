import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminService } from '../services/admin/adminService';
import { useAuth } from '../components/auth/AuthContext';
import { Building2, Users, FileText, CheckSquare, ShieldAlert, Activity, Settings, LayoutDashboard, Search, Eye, Filter, RefreshCw, CheckCircle, Ban } from 'lucide-react';
import { OwnerGuard } from '../components/auth/guards';

export default function ControlCenterWrapper() {
  const { userRole } = useAuth();
  return (
    <OwnerGuard userRole={userRole || 'VIEWER'}>
      <ControlCenter />
    </OwnerGuard>
  );
}

function ControlCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States
  const [users, setUsers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [traces, setTraces] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'health' || activeTab === 'dashboard') {
        import('../services/admin/identityTraceService').then(m => m.IdentityTraceService.getTraces(50).then(setTraces));
      }
      if (activeTab === 'users' || activeTab === 'dashboard') {
        const uSnap = await getDocs(query(collection(db, 'users')));
        setUsers(uSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
      if (activeTab === 'schools' || activeTab === 'dashboard') {
        const sSnap = await getDocs(query(collection(db, 'schools')));
        setSchools(sSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
      if (activeTab === 'approval' || activeTab === 'dashboard') {
        const rSnap = await getDocs(query(collection(db, 'workspaceRequests')));
        setRequests(rSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
      if (activeTab === 'workspace' || activeTab === 'dashboard') {
        const wSnap = await getDocs(query(collection(db, 'workspaces')));
        setWorkspaces(wSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
      if (activeTab === 'audit' || activeTab === 'dashboard') {
        const aSnap = await getDocs(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(100)));
        setAuditLogs(aSnap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (!user) return;
    try {
      await AdminService.approveWorkspace(user.uid, 'OWNER', id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id: string) => {
    if (!user) return;
    try {
      await AdminService.rejectWorkspace(user.uid, 'OWNER', id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleSuspendUser = async (uid: string) => {
    if (!user) return;
    try {
      await AdminService.suspendUser(user.uid, 'OWNER', uid);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleActivateUser = async (uid: string) => {
    if (!user) return;
    try {
      await AdminService.activateUser(user.uid, 'OWNER', uid);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleRoleChange = async (uid: string, newRole: any) => {
    if (!user) return;
    try {
      await AdminService.changeUserRole(user.uid, 'OWNER', uid, newRole);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'approval', label: 'Registration Approval', icon: CheckSquare },
    { id: 'schools', label: 'Schools', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'workspace', label: 'Workspace', icon: FileText },
    { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
    { id: 'health', label: 'Platform Health', icon: Activity },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-4 bg-slate-950 flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Control Center</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-0">
          <h1 className="text-xl font-bold text-slate-800">{navItems.find(i => i.id === activeTab)?.label}</h1>
          <div className="flex items-center space-x-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-full transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
                <StatCard title="Active Schools" value={schools.length} icon={Building2} color="bg-indigo-500" />
                <StatCard title="Workspaces" value={workspaces.length} icon={FileText} color="bg-emerald-500" />
                <StatCard title="Pending Requests" value={requests.filter(r => r.status === 'PENDING').length} icon={CheckSquare} color="bg-amber-500" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center"><CheckSquare className="w-4 h-4 mr-2" /> Recent Requests</h3>
                   {requests.filter(r => r.status === 'PENDING').slice(0, 5).map(req => (
                     <div key={req.id} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 rounded">
                        <div>
                          <div className="font-medium text-sm">{req.schoolId}</div>
                          <div className="text-xs text-slate-500">{new Date(req.submittedAt).toLocaleDateString()}</div>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">PENDING</span>
                     </div>
                   ))}
                   {requests.filter(r => r.status === 'PENDING').length === 0 && <div className="text-sm text-slate-500 italic py-4">No pending requests</div>}
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> System Logs</h3>
                   {auditLogs.slice(0, 5).map(log => (
                     <div key={log.id} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 rounded">
                        <div>
                          <div className="font-medium text-sm text-slate-700">{log.action}</div>
                          <div className="text-xs text-slate-500">{log.actorUid} &rarr; {log.targetId}</div>
                        </div>
                        <span className="text-[10px] text-slate-400">{log.timestamp ? new Date(log.timestamp?.seconds * 1000).toLocaleString() : ''}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-64 shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search requests..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Request ID</th>
                      <th className="p-4 font-semibold">School ID</th>
                      <th className="p-4 font-semibold">Requested By</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 text-sm text-slate-800 font-mono text-xs">{req.requestId}</td>
                        <td className="p-4 text-sm font-medium text-slate-800">{req.schoolId}</td>
                        <td className="p-4 text-sm text-slate-600">{req.requestedBy}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{new Date(req.submittedAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right space-x-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View Details"><Eye size={16} /></button>
                          {req.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleApprove(req.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Approve"><CheckCircle size={16} /></button>
                              <button onClick={() => handleReject(req.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Reject"><Ban size={16} /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">No registration requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                 <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-64 shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search users..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Workspace</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-blue-50/50">
                        <td className="p-4">
                          <div className="font-medium text-slate-800 text-sm">{u.displayName}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-700 font-mono text-xs">
                           <select 
                             value={u.role} 
                             onChange={(e) => handleRoleChange(u.id, e.target.value)}
                             disabled={u.role === 'OWNER'}
                             className="bg-transparent border-slate-300 rounded text-xs"
                           >
                             <option value="VIEWER">VIEWER</option>
                             <option value="TEACHER">TEACHER</option>
                             <option value="OPERATOR">OPERATOR</option>
                             <option value="HEADMASTER">HEADMASTER</option>
                             <option value="ADMIN">ADMIN</option>
                             {u.role === 'OWNER' && <option value="OWNER">OWNER</option>}
                           </select>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{u.workspaceId || '-'}</td>
                        <td className="p-4">
                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            u.status === 'DISABLED' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                           {u.role !== 'OWNER' && (
                             <>
                               {u.status === 'DISABLED' ? (
                                 <button onClick={() => handleActivateUser(u.id)} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100">Activate</button>
                               ) : (
                                 <button onClick={() => handleSuspendUser(u.id)} className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded hover:bg-red-100">Suspend</button>
                               )}
                             </>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {activeTab === 'schools' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                 <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-64 shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search schools..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">School ID</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">NPSN</th>
                      <th className="p-4 font-semibold">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map(s => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-sm font-mono text-xs">{s.id}</td>
                        <td className="p-4 text-sm font-medium text-slate-800">{s.schoolName || s.id}</td>
                        <td className="p-4 text-sm text-slate-600">{s.npsn || '-'}</td>
                        <td className="p-4 text-sm text-slate-600">{s.district ? `${s.district}, ${s.province}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                 <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-64 shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search workspaces..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Workspace ID</th>
                      <th className="p-4 font-semibold">School ID</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaces.map(w => (
                      <tr key={w.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-sm font-mono text-xs font-medium text-slate-800">{w.id}</td>
                        <td className="p-4 text-sm text-slate-600">{w.schoolId}</td>
                        <td className="p-4">
                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            w.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-slate-800">System Audit Trail</h3>
                 <button className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">Export CSV</button>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Timestamp</th>
                      <th className="p-4 font-semibold">Actor</th>
                      <th className="p-4 font-semibold">Action</th>
                      <th className="p-4 font-semibold">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-sm text-slate-500">{log.timestamp ? new Date(log.timestamp?.seconds * 1000).toLocaleString() : '-'}</td>
                        <td className="p-4 text-sm text-slate-800 font-medium">{log.actorUid} <span className="text-xs text-slate-400 block">{log.actorRole}</span></td>
                        <td className="p-4 text-sm font-mono text-xs font-bold text-blue-700">{log.action}</td>
                        <td className="p-4 text-sm text-slate-600">{log.targetId}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No logs found</td></tr>}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {activeTab === 'health' && (
             <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-blue-600" /> Identity Platform Health</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Current User UID</div>
                     <div className="text-sm font-mono text-slate-800 font-bold truncate" title={user.uid}>{user.uid}</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Firebase Auth</div>
                     <div className="flex items-center text-emerald-600 font-bold text-sm"><CheckCircle className="w-4 h-4 mr-1" /> PASS</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Firestore Profile</div>
                     <div className="flex items-center text-emerald-600 font-bold text-sm">{profile ? 'PASS' : 'FAIL'}</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Role & Status</div>
                     <div className="text-sm font-mono text-slate-800 font-bold">{profile.role} | {profile.status}</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Workspace ID</div>
                     <div className="text-sm font-mono text-slate-800 font-bold truncate" title={profile.workspaceId || 'N/A'}>{profile.workspaceId || 'N/A'}</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Organization ID</div>
                     <div className="text-sm font-mono text-slate-800 font-bold truncate" title={profile.organizationId || 'N/A'}>{profile.organizationId || 'N/A'}</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Session Validity</div>
                     <div className="flex items-center text-emerald-600 font-bold text-sm">VALID</div>
                   </div>
                   <div className="border border-slate-200 p-4 rounded-xl">
                     <div className="text-xs text-slate-500 font-medium mb-1">Current Route</div>
                     <div className="text-sm font-mono text-slate-800 font-bold">/control</div>
                   </div>
                 </div>
               </div>
               
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                   <h3 className="font-bold text-slate-800">Identity Trace Log (QA)</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead>
                       <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[10px] uppercase tracking-wider">
                         <th className="p-3 font-semibold">Time</th>
                         <th className="p-3 font-semibold">User</th>
                         <th className="p-3 font-semibold">Auth</th>
                         <th className="p-3 font-semibold">Profile</th>
                         <th className="p-3 font-semibold">Role</th>
                         <th className="p-3 font-semibold">Status</th>
                         <th className="p-3 font-semibold">Workspace</th>
                         <th className="p-3 font-semibold">Org</th>
                         <th className="p-3 font-semibold">Final Route</th>
                       </tr>
                     </thead>
                     <tbody>
                       {traces.map(t => (
                         <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                           <td className="p-3 text-xs text-slate-500">{t.timestamp ? new Date(t.timestamp?.seconds * 1000).toLocaleString() : '-'}</td>
                           <td className="p-3 text-xs text-slate-800 font-medium truncate max-w-[120px]" title={t.email}>{t.email}</td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.firebaseAuth === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps.firebaseAuth}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.firestoreProfile === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps.firestoreProfile}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.roleResolution === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps.roleResolution}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.statusResolution === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps.statusResolution}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.workspaceLookup === 'PASS' ? 'text-emerald-600' : t.steps.workspaceLookup === 'N/A' ? 'text-slate-400' : 'text-rose-600'}>{t.steps.workspaceLookup}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps.organizationLookup === 'PASS' ? 'text-emerald-600' : t.steps.organizationLookup === 'N/A' ? 'text-slate-400' : 'text-rose-600'}>{t.steps.organizationLookup}</span></td>
                           <td className="p-3 text-xs font-mono font-medium text-slate-700">{t.steps.finalRoute}</td>
                         </tr>
                       ))}
                       {traces.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-500">No identity traces found</td></tr>}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Settings className="mr-2 text-slate-600" /> System Settings</h3>
                <div className="max-w-xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Platform Mode</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-sm">
                      <option>Production</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Registration Policy</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-sm">
                      <option>Require Approval</option>
                      <option>Open Registration</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <button className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    Save Configuration
                  </button>
                </div>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white mr-4 shadow-sm`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
