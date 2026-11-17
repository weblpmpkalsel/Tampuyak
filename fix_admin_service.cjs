const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf-8');

const targetActivate = `    if (target.status === 'PENDING') {
      updates.role = 'SCHOOL_ADMIN' as any;
      const workspaceId = \`ws_\${target.npsn || targetUid}\`;
      updates.workspaceId = workspaceId;
      updates.schoolId = target.npsn || targetUid;
      
      try {
        await OrganizationService.createProfile(workspaceId, {
          schoolName: target.schoolName || '',
          principalName: target.principalName || '',
          phone: target.phone || '',
          province: target.province || '',
          district: target.district || '',
          npsn: target.npsn || ''
        });
      } catch (err) {
        console.error('Failed to provision organization', err);
      }
    }`;

const replaceActivate = `    if (target.status === 'PENDING') {
      updates.role = 'SCHOOL_ADMIN' as any;
    }`;

code = code.replace(targetActivate, replaceActivate);
fs.writeFileSync('src/services/admin/adminService.ts', code);
console.log('done');
