const fs = require('fs');
let code = fs.readFileSync('src/control/ApprovalsView.tsx', 'utf8');

code = code.replace(
  /<td className="p-4 text-sm text-slate-800 font-mono text-xs">\{req.requestId\}<\/td>/g,
  '<td className="p-4 text-sm text-slate-800 font-mono text-xs">{req.email}</td>'
);
code = code.replace(
  /<td className="p-4 text-sm font-medium text-slate-800">\{req.schoolId\}<\/td>/g,
  '<td className="p-4 text-sm font-medium text-slate-800">{req.schoolName || req.npsn}</td>'
);
code = code.replace(
  /<td className="p-4 text-sm text-slate-600">\{req.requestedBy\}<\/td>/g,
  '<td className="p-4 text-sm text-slate-600">{req.displayName}</td>'
);

// We need to fix the columns header
code = code.replace(
  /<th className="text-left p-4 font-semibold text-slate-600 w-1\/4">Request ID<\/th>/g,
  '<th className="text-left p-4 font-semibold text-slate-600 w-1/4">Email</th>'
);
code = code.replace(
  /<th className="text-left p-4 font-semibold text-slate-600">School ID<\/th>/g,
  '<th className="text-left p-4 font-semibold text-slate-600">School / NPSN</th>'
);
code = code.replace(
  /<th className="text-left p-4 font-semibold text-slate-600">Requested By<\/th>/g,
  '<th className="text-left p-4 font-semibold text-slate-600">Requester</th>'
);

fs.writeFileSync('src/control/ApprovalsView.tsx', code);
