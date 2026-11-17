const fs = require('fs');
let code = fs.readFileSync('src/control/ApprovalsView.tsx', 'utf8');

code = code.replace(
  "await AdminService.approveRequest(auth.currentUser.uid, 'SUPER_ADMIN', id);",
  "await AdminService.approveWorkspace(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);"
);

code = code.replace(
  "await AdminService.rejectRequest(auth.currentUser.uid, 'SUPER_ADMIN', id);",
  "await AdminService.rejectWorkspace(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);"
);

fs.writeFileSync('src/control/ApprovalsView.tsx', code);
