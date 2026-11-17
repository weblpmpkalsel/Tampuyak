const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/userService.ts', 'utf8');

code = code.replace(
  "'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'HEADMASTER' | 'TEACHER' | 'VIEWER' | 'SCHOOL_ADMIN'",
  "'OWNER' | 'SUPER_ADMIN' | 'SCHOOL_ADMIN'"
);

const migrationLogic = `
      let needsUpdate = false;
      let newRole = profile.role;
      let newStatus = profile.status;
      let newWorkspaceId = profile.workspaceId;
      let newApprovalBypass = profile.approvalBypass;

      if (isOwner && (profile.role !== 'OWNER' || profile.status !== 'ACTIVE' || profile.workspaceId !== 'SYSTEM' || !profile.approvalBypass)) {
        newRole = 'OWNER';
        newStatus = 'ACTIVE';
        newWorkspaceId = 'SYSTEM';
        newApprovalBypass = true;
        needsUpdate = true;
      } else if (!isOwner && profile.role === 'OWNER') {
        newRole = 'SCHOOL_ADMIN';
        newStatus = 'PENDING';
        needsUpdate = true;
      }
      
      if (isSuperAdmin && !isOwner && (profile.role !== 'SUPER_ADMIN' || profile.status !== 'ACTIVE' || profile.workspaceId !== 'SYSTEM' || !profile.approvalBypass)) {
        newRole = 'SUPER_ADMIN';
        newStatus = 'ACTIVE';
        newWorkspaceId = 'SYSTEM';
        newApprovalBypass = true;
        needsUpdate = true;
      }

      // Migrate old roles
      if (!isOwner && !isSuperAdmin && (
        profile.role === 'VIEWER' as any || 
        profile.role === 'TEACHER' as any || 
        profile.role === 'OPERATOR' as any || 
        profile.role === 'HEADMASTER' as any || 
        profile.role === 'ADMIN' as any ||
        profile.role === 'school_admin' as any
      )) {
        newRole = 'SCHOOL_ADMIN';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await this.updateUserProfile(user.uid, {
          role: newRole,
          status: newStatus,
          workspaceId: newWorkspaceId,
          approvalBypass: newApprovalBypass
        }, isOwner ? 'OWNER' : undefined);
        profile.role = newRole;
        profile.status = newStatus;
        profile.workspaceId = newWorkspaceId;
        profile.approvalBypass = newApprovalBypass;
      }
`;

code = code.replace(
  /(let needsUpdate = false;.*?if \(needsUpdate\) \{.*?\n\s+\}.*?\n\s+\})/s,
  migrationLogic
);

// Also replace VIEWER with SCHOOL_ADMIN in the default creation:
// role: isOwner ? 'OWNER' : (isSuperAdmin ? 'SUPER_ADMIN' : 'VIEWER'),
code = code.replace(
  "role: isOwner ? 'OWNER' : (isSuperAdmin ? 'SUPER_ADMIN' : 'VIEWER')",
  "role: isOwner ? 'OWNER' : (isSuperAdmin ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN')"
);

fs.writeFileSync('src/services/firestore/userService.ts', code);
