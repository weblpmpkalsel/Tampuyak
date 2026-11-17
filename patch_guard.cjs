const fs = require('fs');
let code = fs.readFileSync('src/portal/PortalDashboardGuard.tsx', 'utf8');

code = code.replace(
  "if (profile.role === 'OWNER' || profile.role === 'SUPER_ADMIN') {",
  "if (profile.role === 'OWNER') {"
);

fs.writeFileSync('src/portal/PortalDashboardGuard.tsx', code);
