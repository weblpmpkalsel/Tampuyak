const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', 'utf8');

if (!content.includes('PermissionGuard')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { PermissionGuard } from '../auth/SupervisionGuards';"
  );
  
  content = content.replace(
    /<button\s+onClick=\{\(\) => setShowModal\(true\)\}\s+className="px-4 py-2 bg-blue-50/g,
    "<PermissionGuard requiredPermission=\"MANAGE_TEACHER_ASSIGNMENT\">\n            <button\n              onClick={() => setShowModal(true)}\n              className=\"px-4 py-2 bg-blue-50"
  );
  
  content = content.replace(
    /Tambah Guru\s+<\/button>/g,
    "Tambah Guru\n            </button>\n            </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => handleRemove\(schedule\.id\)\}\s+className="p-2 text-red-500/g,
    "<PermissionGuard requiredPermission=\"MANAGE_TEACHER_ASSIGNMENT\">\n                    <button\n                      onClick={() => handleRemove(schedule.id)}\n                      className=\"p-2 text-red-500"
  );
  
  content = content.replace(
    /<\/button>\s+<\/div>\s+<\/div>/g,
    "</button>\n                    </PermissionGuard>\n                  </div>\n                </div>"
  );

  fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', content);
}
