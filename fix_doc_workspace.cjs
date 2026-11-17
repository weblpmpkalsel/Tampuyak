const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  "const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {\n  const { settings, getActiveAcademicYear } = useApp();",
  "const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {\n  const { settings, updateSetting, getActiveAcademicYear } = useApp();"
);

fs.writeFileSync('src/Tampuyak.tsx', code);
