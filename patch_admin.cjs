const fs = require('fs');
const file = 'src/services/admin/adminService.ts';
let code = fs.readFileSync(file, 'utf8');
if (!code.includes('rejectUser(')) {
  const replacement = `  static async activateUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    if (actorRole !== 'OWNER') {
      const target = await UserService.getUserProfile(targetUid);
      if (target?.role === 'SUPER_ADMIN') throw new Error('Cannot modify SUPER_ADMIN');
    }
    await UserService.updateUserProfile(targetUid, { status: 'ACTIVE' });
    await AuditService.logEvent(actorUid, 'USER_ACTIVATED', { targetUid });
  }

  static async rejectUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    if (actorRole !== 'OWNER') {
      const target = await UserService.getUserProfile(targetUid);
      if (target?.role === 'SUPER_ADMIN') throw new Error('Cannot modify SUPER_ADMIN');
    }
    await UserService.updateUserProfile(targetUid, { status: 'REJECTED' });
    await AuditService.logEvent(actorUid, 'USER_REJECTED', { targetUid });
  }`;
  
  // Wait, let's just use regex to insert rejectUser
  code = code.replace(/static async activateUser.*?\n.*?targetUid \}\);\n  \}/s, replacement);
  fs.writeFileSync(file, code);
}
