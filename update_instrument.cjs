const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionInstrumentSelection.tsx', 'utf8');

if (!content.includes('PermissionGuard')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { PermissionGuard } from '../auth/SupervisionGuards';"
  );
  
  content = content.replace(
    "return (\n    <>\n      <div className=\"bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] mt-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500\">",
    "return (\n    <PermissionGuard requiredPermission=\"MANAGE_INSTRUMENT\" fallback={\n      <div className=\"bg-amber-50 rounded-xl p-6 border border-amber-200 mt-6\">\n        <p className=\"text-amber-800 font-medium text-sm text-center\">Instrumen belum dikonfigurasi. Menunggu Kepala Sekolah/Pengawas.</p>\n      </div>\n    }>\n    <>\n      <div className=\"bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] mt-6 overflow-hidden animate-in fade-in zoom-in-95 duration-500\">"
  );
  
  content = content.replace(
    /<\/div>\n    <\/div>\n    <\/>/g,
    "</div>\n    </div>\n    </>\n    </PermissionGuard>"
  );

  fs.writeFileSync('src/modules/supervision/ui/SupervisionInstrumentSelection.tsx', content);
}
