const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/userService.ts', 'utf8');

const oldUpdate = `  static async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, this.collectionName, uid);
    await updateDoc(userRef, data);
  }`;

const newUpdate = `  static async updateUserProfile(uid: string, data: Partial<UserProfile>, actorRole?: UserRole): Promise<void> {
    if (data.role === 'OWNER' && actorRole !== 'OWNER') {
      throw new Error('ACCESS DENIED: Cannot promote to OWNER');
    }
    const userRef = doc(db, this.collectionName, uid);
    await updateDoc(userRef, data);
  }`;

code = code.replace(oldUpdate, newUpdate);

// Also need to patch syncUser where it calls updateUserProfile, so it passes 'OWNER' if it isOwner
const oldSyncUpdate = `      if (needsUpdate) {
        await this.updateUserProfile(user.uid, {
          role: profile.role,
          status: profile.status,
          workspaceId: profile.workspaceId,
          approvalBypass: profile.approvalBypass
        });
      }`;

const newSyncUpdate = `      if (needsUpdate) {
        await this.updateUserProfile(user.uid, {
          role: profile.role,
          status: profile.status,
          workspaceId: profile.workspaceId,
          approvalBypass: profile.approvalBypass
        }, isOwner ? 'OWNER' : undefined);
      }`;

code = code.replace(oldSyncUpdate, newSyncUpdate);

fs.writeFileSync('src/services/firestore/userService.ts', code);
