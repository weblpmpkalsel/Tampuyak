const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/organizationService.ts', 'utf-8');

const additionalMethod = `  static async setupOrganization(uid: string, profileData: Omit<OrganizationProfile, 'workspaceId' | 'version' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const workspaceId = \`ws_\${profileData.npsn || uid}\`;
    await this.createProfile(workspaceId, profileData);
    
    // Also update the user's profile to assign this workspaceId
    const { UserService } = await import('./userService');
    await UserService.updateUserProfile(uid, {
      workspaceId,
      schoolId: profileData.npsn || uid
    });
  }`;

code = code.replace("  static async createProfile", additionalMethod + "\n\n  static async createProfile");
fs.writeFileSync('src/services/firestore/organizationService.ts', code);
console.log('done');
