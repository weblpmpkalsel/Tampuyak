const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf8');

code = `import { doc, setDoc, serverTimestamp } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';\n` + code;

code = code.replace(
  /static async transferOwnership\([\s\S]*?AuditAction.OWNER_TRANSFER, newOwnerUid\);\s*\}/,
  `static async transferOwnership(currentOwnerUid: string, currentOwnerRole: UserRole, newOwnerUid: string): Promise<void> {
    if (currentOwnerRole !== 'OWNER') {
      throw new Error('Only current OWNER can transfer ownership');
    }
    const newOwner = await UserService.getUserProfile(newOwnerUid);
    if (!newOwner) throw new Error('New owner user not found');
    
    // Replace ownerUid inside system/platform
    const systemRef = doc(db, 'system', 'platform');
    await setDoc(systemRef, {
      ownerUid: newOwnerUid,
      ownerEmail: newOwner.email,
      transferredAt: serverTimestamp()
    }, { merge: true });

    // Demote current owner to SUPER_ADMIN, promote new owner to OWNER
    await UserService.updateUserProfile(newOwnerUid, { role: 'OWNER', status: 'ACTIVE', workspaceId: 'SYSTEM', approvalBypass: true });
    await UserService.updateUserProfile(currentOwnerUid, { role: 'SUPER_ADMIN', approvalBypass: false });
    await AuditService.logEvent(currentOwnerUid, currentOwnerRole, AuditAction.OWNER_TRANSFER, newOwnerUid);
  }`
);

fs.writeFileSync('src/services/admin/adminService.ts', code);
