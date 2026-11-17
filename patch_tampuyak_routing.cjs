const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  '{currentView === "beranda" && (',
  '{currentView === "approvals" && <ApprovalsView />}\n            {currentView === "beranda" && ('
);

fs.writeFileSync('src/Tampuyak.tsx', code);
