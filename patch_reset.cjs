const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');
code = code.replace(
  '<button onClick={() => handleActivateUser(u.id)}',
  '<button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleActivateUser(u.id)}'
);
code = code.replace(
  '<button onClick={() => handleSuspendUser(u.id)}',
  '<button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleSuspendUser(u.id)}'
);
fs.writeFileSync('src/control/ControlCenter.tsx', code);
