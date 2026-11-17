const fs = require('fs');
let code = fs.readFileSync('src/control/ApprovalsView.tsx', 'utf-8');
code = code.replace("import { useApp } from '../portal/PortalDashboardGuard';", "import { useApp } from '../Tampuyak';");
code = code.replace("export function ApprovalsView() {", "export function ApprovalsView({ onClose }: { onClose?: () => void }) {\n  const app = useApp();");
code = code.replace("      await AdminService.activateUser(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);\n      fetchData();", "      await AdminService.activateUser(auth.currentUser.uid, 'SUPER_ADMIN' as any, id);\n      fetchData();\n      if (onClose) onClose();\n      else if (app?.setCurrentView) app.setCurrentView('dashboard');");
fs.writeFileSync('src/control/ApprovalsView.tsx', code);
console.log('done');
