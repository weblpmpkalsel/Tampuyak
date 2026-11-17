const fs = require('fs');
let code = fs.readFileSync('src/control/ApprovalsView.tsx', 'utf8');

code = code.replace(
  "const rSnap = await getDocs(query(collection(db, 'workspaceRequests')));",
  "const rSnap = await getDocs(query(collection(db, 'users')));" // Wait, I should add where clause
);
code = code.replace(
  "setRequests(rSnap.docs.map(d => ({ ...d.data(), id: d.id })));",
  "setRequests(rSnap.docs.map(d => ({ ...d.data(), id: d.id })).filter(d => d.status === 'PENDING'));"
);

// We should also replace handleApprove to use AdminService.activateUser
code = code.replace(
  "await AdminService.approveWorkspace(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);",
  "await AdminService.activateUser(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);"
);

// We should replace handleReject to use AdminService.rejectUser
code = code.replace(
  "await AdminService.rejectWorkspace(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);",
  "await AdminService.rejectUser(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);"
);

fs.writeFileSync('src/control/ApprovalsView.tsx', code);
