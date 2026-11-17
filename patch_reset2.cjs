const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');
code = code.replace(
  '<button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleActivateUser(u.id)}',
  '<React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleActivateUser(u.id)}'
);
code = code.replace(
  ' hover:bg-emerald-100">Activate</button>',
  ' hover:bg-emerald-100">Activate</button></React.Fragment>'
);

code = code.replace(
  '<button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleSuspendUser(u.id)}',
  '<React.Fragment><button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">Reset Password</button>\n                                 <button onClick={() => handleSuspendUser(u.id)}'
);
code = code.replace(
  ' hover:bg-red-100">Suspend</button>',
  ' hover:bg-red-100">Suspend</button></React.Fragment>'
);

fs.writeFileSync('src/control/ControlCenter.tsx', code);
