const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const isSuperAdminDecl = `
  const isSuperAdmin = auth.currentUser ? PermissionService.getCache(auth.currentUser.uid)?.role === 'SUPER_ADMIN' : false;
`;

code = code.replace(
  'const { settings, saveStatus, updateSetting, getActiveAcademicYear, showToast } = useApp();',
  'const { settings, saveStatus, updateSetting, getActiveAcademicYear, showToast } = useApp();\n' + isSuperAdminDecl
);

const approvalButton = `
            {isSuperAdmin && (
              <button 
                onClick={() => setCurrentView('approvals')}
                className="relative p-2.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 font-bold text-sm"
              >
                Approvals
              </button>
            )}
`;

code = code.replace(
  '<button className="relative p-2.5 rounded-full text-[var(--color-eds-text-secondary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-text-primary)] transition-colors">',
  approvalButton + '\n            <button className="relative p-2.5 rounded-full text-[var(--color-eds-text-secondary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-text-primary)] transition-colors">'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
