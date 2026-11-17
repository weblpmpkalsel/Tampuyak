const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. RKJMOrchestratorView (which I probably missed destructuring)
// wait, the error is in DocumentWorkspaceView for 9600.
code = code.replace(
  'const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {\n  const { settings } = useApp();',
  'const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {\n  const { settings, getActiveAcademicYear } = useApp();'
);
// just in case my first regex worked and added it partially:
code = code.replace(
  'const { settings, updateSetting } = useApp();\n  const [activeTab',
  'const { settings, updateSetting, getActiveAcademicYear } = useApp();\n  const [activeTab'
);
// wait, I can just replace `const { settings } = useApp();` if it is in the component.

const componentsToFix = [
  "RKTDerivationView",
  "RKASDerivationView",
  "MonitoringView",
  "PublishingCenterView",
  "LayoutContainer",
  "DocumentWorkspaceView",
  "RKJMOrchestratorView",
  "PrintDiagnosticView"
];

for (const comp of componentsToFix) {
  // Let's find the component declaration and its useApp
  const regex = new RegExp(`const ${comp} = [^{]*{\\s*const {([^}]*)} = useApp\\(\\);`, 'g');
  code = code.replace(regex, (match, destructure) => {
    if (!destructure.includes('getActiveAcademicYear')) {
      return match.replace(destructure, destructure + ', getActiveAcademicYear');
    }
    return match;
  });
}

// Special case for LayoutContainer where it might be structured differently
code = code.replace(
  'const { settings, updateSetting, addAcademicYear, switchAcademicYear } = useApp();',
  'const { settings, updateSetting, addAcademicYear, switchAcademicYear, getActiveAcademicYear } = useApp();'
);
code = code.replace(
  'const { settings, updateSetting, addAcademicYear } = useApp();',
  'const { settings, updateSetting, addAcademicYear, getActiveAcademicYear } = useApp();'
);
code = code.replace(
  'const { settings, showSuccess } = useApp();\n\n  const handleApproveRKT',
  'const { settings, showSuccess, getActiveAcademicYear } = useApp();\n\n  const handleApproveRKT'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Fixed missing getActiveAcademicYear");
