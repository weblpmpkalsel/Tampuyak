const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');

const oldBtns = `{u.role !== 'OWNER' && (
                             <React.Fragment>
                               {u.status === 'DISABLED' ? (
                                 <React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>
                                 <button onClick={() => handleActivateUser(u.id)} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100">Activate</button></React.Fragment>
                               ) : (
                                 <React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>
                                 <button onClick={() => handleSuspendUser(u.id)} className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded hover:bg-red-100">Suspend</button></React.Fragment>
                               )}
                             </React.Fragment>
                           )}`;

const newBtns = `{u.role !== 'OWNER' && (
                             <React.Fragment>
                               {u.status === 'DISABLED' ? (
                                 <React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>
                                 <button onClick={() => handleActivateUser(u.id)} disabled={profile.role !== 'OWNER' && u.role === 'SUPER_ADMIN'} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100 disabled:opacity-50">Activate</button></React.Fragment>
                               ) : (
                                 <React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>
                                 <button onClick={() => handleSuspendUser(u.id)} disabled={profile.role !== 'OWNER' && u.role === 'SUPER_ADMIN'} className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded hover:bg-red-100 disabled:opacity-50">Suspend</button></React.Fragment>
                               )}
                             </React.Fragment>
                           )}`;

code = code.replace(oldBtns, newBtns);
fs.writeFileSync('src/control/ControlCenter.tsx', code);
