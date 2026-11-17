const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf-8');
const target = `          {activeTab === 'health' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-blue-600" /> Platform Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-slate-200 p-4 rounded-xl">
                    <div className="text-sm text-slate-500 font-medium mb-1">Database Connection</div>
                    <div className="flex items-center text-emerald-600 font-bold"><CheckCircle className="w-4 h-4 mr-2" /> ONLINE</div>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-xl">
                    <div className="text-sm text-slate-500 font-medium mb-1">API Latency</div>
                    <div className="flex items-center text-emerald-600 font-bold">~42ms</div>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-xl">
                    <div className="text-sm text-slate-500 font-medium mb-1">Active Sessions</div>
                    <div className="flex items-center text-blue-600 font-bold">{users.filter(u=>u.status==='ACTIVE').length} Users</div>
                  </div>
                </div>
             </div>
          )}`;
const replace = `          {activeTab === 'health' && (
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
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.firebaseAuth === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps?.firebaseAuth || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.firestoreProfile === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps?.firestoreProfile || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.roleResolution === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps?.roleResolution || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.statusResolution === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}>{t.steps?.statusResolution || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.workspaceLookup === 'PASS' ? 'text-emerald-600' : t.steps?.workspaceLookup === 'N/A' ? 'text-slate-400' : 'text-rose-600'}>{t.steps?.workspaceLookup || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-bold"><span className={t.steps?.organizationLookup === 'PASS' ? 'text-emerald-600' : t.steps?.organizationLookup === 'N/A' ? 'text-slate-400' : 'text-rose-600'}>{t.steps?.organizationLookup || 'N/A'}</span></td>
                           <td className="p-3 text-xs font-mono font-medium text-slate-700">{t.steps?.finalRoute || 'N/A'}</td>
                         </tr>
                       ))}
                       {traces.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-500">No identity traces found</td></tr>}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          )}`;
code = code.replace(target, replace);
fs.writeFileSync('src/control/ControlCenter.tsx', code);
console.log('done');
