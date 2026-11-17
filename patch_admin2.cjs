const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf8');
const rejectCode = `  static async rejectUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');
    if (target.role === 'SUPER_ADMIN' && actorRole === 'SUPER_ADMIN') {
      throw new Error('Only OWNER can reject SUPER_ADMIN');
    }
    await UserService.updateUserProfile(targetUid, { status: 'REJECTED' });
    await AuditService.logEvent(actorUid, actorRole, AuditAction.REJECT_USER, targetUid);
  }

`;
code = code.replace("static async changeUserRole", rejectCode + "static async changeUserRole");
fs.writeFileSync('src/services/admin/adminService.ts', code);
