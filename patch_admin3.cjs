const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf8');

const activateUserRegex = /static async activateUser.*?\n.*?AuditAction\.ACTIVATE_USER, targetUid\);\n  \}/s;

const replacement = `static async activateUser(actorUid: string, actorRole: UserRole, targetUid: string): Promise<void> {
    this.verifyAdminOrOwner(actorRole);
    const target = await UserService.getUserProfile(targetUid);
    if (!target) throw new Error('User not found');
    if (target.role === 'OWNER') throw new Error('Cannot modify OWNER');
    if (target.role === 'SUPER_ADMIN' && actorRole === 'SUPER_ADMIN') {
      throw new Error('Only OWNER can activate SUPER_ADMIN');
    }

    const updates: Partial<UserProfile> = { status: 'ACTIVE' };

    if (target.status === 'PENDING') {
      updates.role = 'SCHOOL_ADMIN' as any;
      const workspaceId = \`ws_\${target.npsn || targetUid}\`;
      updates.workspaceId = workspaceId;
      updates.schoolId = target.npsn || targetUid;

      const OrganizationService = require('../firestore/organizationService').OrganizationService;
      try {
        await OrganizationService.createProfile(workspaceId, {
          schoolName: target.schoolName || '',
          npsn: target.npsn || '',
          nss: '',
          educationLevel: '',
          status: '',
          address: '',
          village: '',
          district: target.district || '',
          city: '',
          province: target.province || '',
          postalCode: '',
          phone: target.phone || '',
          email: target.email || '',
          website: '',
          principalName: target.principalName || '',
          principalNip: '',
          principalPhone: '',
          principalEmail: '',
          principalAppointmentDate: '',
          academicYear: '',
          semester: '',
          schoolVision: '',
          schoolMission: '',
          schoolMotto: ''
        });
      } catch (e) {
        console.error('Error creating organization profile:', e);
      }
    }

    await UserService.updateUserProfile(targetUid, updates);
    await AuditService.logEvent(actorUid, actorRole, AuditAction.ACTIVATE_USER, targetUid);
  }`;

code = code.replace(activateUserRegex, replacement);
fs.writeFileSync('src/services/admin/adminService.ts', code);
