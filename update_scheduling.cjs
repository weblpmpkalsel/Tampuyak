const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionScheduling.tsx', 'utf8');

if (!content.includes('PermissionGuard')) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { PermissionGuard } from '../auth/SupervisionGuards';"
  );
  
  content = content.replace(
    /<button\s+onClick=\{\(\) => handleEdit\(schedule\)\}\s+className="text-xs font-bold text-blue-600/g,
    "<PermissionGuard requiredPermission=\"MANAGE_SCHEDULE\">\n                      <button\n                        onClick={() => handleEdit(schedule)}\n                        className=\"text-xs font-bold text-blue-600"
  );
  
  content = content.replace(
    /Atur Jadwal\s+<\/button>/g,
    "Atur Jadwal\n                      </button>\n                      </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => setStartingPreObsId\(schedule.id\)\}\s+className="w-full mt-4 px-4 py-2/g,
    "<PermissionGuard requiredPermission=\"APPROVE_PRE_OBSERVATION\">\n                  <button\n                    onClick={() => setStartingPreObsId(schedule.id)}\n                    className=\"w-full mt-4 px-4 py-2"
  );
  
  content = content.replace(
    /Mulai Telaah Pra-Observasi\s+<\/button>/g,
    "Mulai Telaah Pra-Observasi\n                  </button>\n                  </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => onStartObservation\?.+\s+className="w-full mt-4 px-4 py-2 bg-blue-50/g,
    "<PermissionGuard requiredPermission=\"CONDUCT_OBSERVATION\">\n                  <button\n                    onClick={() => onStartObservation?.(schedule.id)}\n                    className=\"w-full mt-4 px-4 py-2 bg-blue-50"
  );

  content = content.replace(
    /Mulai Observasi Kelas\s+<\/button>/g,
    "Mulai Observasi Kelas\n                  </button>\n                  </PermissionGuard>"
  );
  
  content = content.replace(
    /<button\s+onClick=\{\(\) => onStartPostObservation\?.+\s+className="w-full mt-4 px-4 py-2 bg-amber-50/g,
    "<PermissionGuard requiredPermission=\"CONDUCT_POST_OBSERVATION\">\n                  <button\n                    onClick={() => onStartPostObservation?.(schedule.id)}\n                    className=\"w-full mt-4 px-4 py-2 bg-amber-50"
  );

  content = content.replace(
    /Mulai Pasca Observasi\s+<\/button>/g,
    "Mulai Pasca Observasi\n                  </button>\n                  </PermissionGuard>"
  );

  content = content.replace(
    /<button\s+onClick=\{\(\) => onStartRtl\?.+\s+className="w-full mt-4 px-4 py-2 bg-purple-50/g,
    "<PermissionGuard requiredPermission=\"MANAGE_RTL\">\n                  <button\n                    onClick={() => onStartRtl?.(schedule.id)}\n                    className=\"w-full mt-4 px-4 py-2 bg-purple-50"
  );
  
  content = content.replace(
    /Tindak Lanjut & Monitoring\s+<\/button>/g,
    "Tindak Lanjut & Monitoring\n                  </button>\n                  </PermissionGuard>"
  );

  fs.writeFileSync('src/modules/supervision/ui/SupervisionScheduling.tsx', content);
}
