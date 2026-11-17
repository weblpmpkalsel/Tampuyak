const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');

code = code.replace(
  /AdminService\.approveWorkspace\(user\.uid, 'OWNER', id\)/g,
  "AdminService.approveWorkspace(user.uid, profile.role, id)"
);

code = code.replace(
  /AdminService\.rejectWorkspace\(user\.uid, 'OWNER', id\)/g,
  "AdminService.rejectWorkspace(user.uid, profile.role, id)"
);

code = code.replace(
  /AdminService\.suspendUser\(user\.uid, 'OWNER', uid\)/g,
  "AdminService.suspendUser(user.uid, profile.role, uid)"
);

code = code.replace(
  /AdminService\.activateUser\(user\.uid, 'OWNER', uid\)/g,
  "AdminService.activateUser(user.uid, profile.role, uid)"
);

code = code.replace(
  /AdminService\.changeUserRole\(user\.uid, 'OWNER', uid, newRole\)/g,
  "AdminService.changeUserRole(user.uid, profile.role, uid, newRole)"
);

fs.writeFileSync('src/control/ControlCenter.tsx', code);
