const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');

code = code.replace(
  `onClick={() => handleActivateUser(u.id)} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100">Approve</button>`,
  `onClick={() => handleActivateUser(u.id)} disabled={profile.role !== 'OWNER' && u.role === 'SUPER_ADMIN'} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-100 disabled:opacity-50">Approve</button>`
);

code = code.replace(
  `onClick={() => handleRejectUser(u.id)} className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded hover:bg-red-100">Reject</button>`,
  `onClick={() => handleRejectUser(u.id)} disabled={profile.role !== 'OWNER' && u.role === 'SUPER_ADMIN'} className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded hover:bg-red-100 disabled:opacity-50">Reject</button>`
);

fs.writeFileSync('src/control/ControlCenter.tsx', code);
