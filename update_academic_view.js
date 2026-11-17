const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', 'utf8');

if (!content.includes('RoleGuard')) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { RoleGuard, PermissionGuard } from '../auth/SupervisionGuards';"
  );
  
  content = content.replace(
    "export const SupervisionAcademicView = () => {",
    "const SupervisionAcademicViewInternal = () => {"
  );
  
  content += `\n\nexport const SupervisionAcademicView = () => {
  return (
    <RoleGuard allowedRoles={['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR']}>
      <SupervisionAcademicViewInternal />
    </RoleGuard>
  );
};
`;
  
  fs.writeFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', content);
}
