const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');

const oldTd = `<td className="p-4 text-sm text-slate-700 font-mono text-xs">
                           {u.role === 'OWNER' ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                               <ShieldAlert className="w-3 h-3 mr-1" /> Platform Owner
                             </span>
                           ) : (
                             <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                               className="bg-transparent border-slate-300 rounded text-xs"
                             >
                               <option value="VIEWER">VIEWER</option>
                               <option value="TEACHER">TEACHER</option>
                               <option value="OPERATOR">OPERATOR</option>
                               <option value="HEADMASTER">HEADMASTER</option>
                               <option value="ADMIN">ADMIN</option>
                               {profile.role === 'OWNER' && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                             </select>
                           )}
                        </td>`;

const newTd = `<td className="p-4 text-sm text-slate-700 font-mono text-xs">
                           {u.role === 'OWNER' ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                               <ShieldAlert className="w-3 h-3 mr-1" /> Platform Owner
                             </span>
                           ) : (
                             <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                               disabled={profile.role !== 'OWNER' && u.role === 'SUPER_ADMIN'}
                               className="bg-transparent border-slate-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               <option value="VIEWER">VIEWER</option>
                               <option value="TEACHER">TEACHER</option>
                               <option value="OPERATOR">OPERATOR</option>
                               <option value="HEADMASTER">HEADMASTER</option>
                               <option value="ADMIN">ADMIN</option>
                               {(profile.role === 'OWNER' || u.role === 'SUPER_ADMIN') && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                             </select>
                           )}
                        </td>`;

code = code.replace(oldTd, newTd);
fs.writeFileSync('src/control/ControlCenter.tsx', code);
