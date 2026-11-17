const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  'const { settings, saveStatus, updateSetting } = useApp();',
  'const { settings, saveStatus, updateSetting, getActiveAcademicYear } = useApp();'
);

code = code.replace(
  'const RKJMPipelineView = ({ navigateToView }: any) => {\n  const { settings, showSuccess } = useApp();',
  'const RKJMPipelineView = ({ navigateToView }: any) => {\n  const { settings, showSuccess, getActiveAcademicYear } = useApp();'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Fixed manually");
