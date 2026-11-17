const fs = require('fs');

const file = 'src/services/firestore/userService.ts';
let content = fs.readFileSync(file, 'utf8');

const queryMethod = `
  static async getActiveTeachersByWorkspace(workspaceId: string): Promise<UserProfile[]> {
    if (!workspaceId) return [];
    // Requires composite index for workspaceId + status + role
    const q = query(
      collection(db, this.collectionName), 
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'ACTIVE'),
      where('role', '==', 'TEACHER')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserProfile);
  }
`;

if (!content.includes('getActiveTeachersByWorkspace')) {
  content = content.replace('static async getPendingUsers', queryMethod + '\n  static async getPendingUsers');
  fs.writeFileSync(file, content);
}
