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
  
  // also protect specific buttons inside SupervisionAcademicViewInternal
  content = content.replace(
    /<button\s+onClick=\{\(\) => setShowPublishing\(true\)\}/g,
    "<PermissionGuard requiredPermission=\"PUBLISH_REPORT\">\n          <button\n            onClick={() => setShowPublishing(true)}"
  );
  
  content = content.replace(
    /Publishing\s+<\/button>/g,
    "Publishing\n          </button>\n          </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => setShowWizard\(true\)\}\s+className="px-5 py-2.5 bg-blue-600/g,
    "<PermissionGuard requiredPermission=\"MANAGE_PROGRAM\">\n          <button\n            onClick={() => setShowWizard(true)}\n            className=\"px-5 py-2.5 bg-blue-600"
  );
  
  content = content.replace(
    /Buat Program Supervisi\s+<\/button>/g,
    "Buat Program Supervisi\n          </button>\n          </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => setShowWizard\(true\)\}\s+className="px-4 py-2 bg-white/g,
    "<PermissionGuard requiredPermission=\"MANAGE_PROGRAM\">\n            <button\n              onClick={() => setShowWizard(true)}\n              className=\"px-4 py-2 bg-white"
  );
  
  content = content.replace(
    /Edit Program\s+<\/button>/g,
    "Edit Program\n            </button>\n            </PermissionGuard>"
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
