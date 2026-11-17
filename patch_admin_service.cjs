const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf8');

const oldDemote = `    // Demote current owner to SUPER_ADMIN, promote new owner to OWNER
    await UserService.updateUserProfile(newOwnerUid, { role: 'OWNER', status: 'ACTIVE', workspaceId: 'SYSTEM', approvalBypass: true });
    await UserService.updateUserProfile(currentOwnerUid, { role: 'SUPER_ADMIN', approvalBypass: false });`;

const newDemote = `    // Demote current owner to SUPER_ADMIN, promote new owner to OWNER
    await UserService.updateUserProfile(newOwnerUid, { role: 'OWNER', status: 'ACTIVE', workspaceId: 'SYSTEM', approvalBypass: true }, currentOwnerRole);
    await UserService.updateUserProfile(currentOwnerUid, { role: 'SUPER_ADMIN', approvalBypass: false }, currentOwnerRole);`;

code = code.replace(oldDemote, newDemote);
fs.writeFileSync('src/services/admin/adminService.ts', code);
