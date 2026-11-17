const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// DashboardView
code = code.replace(
  'const { settings, updateSetting, getReadiness, addAcademicYear, switchAcademicYear } = useApp();',
  'const { settings, updateSetting, getReadiness, addAcademicYear, switchAcademicYear, getActiveAcademicYear } = useApp();'
);

code = code.replace(
  '{settings.academicYears?.find((y: any) => y.isActive)?.name ||\n              "2024/2025"}',
  '{getActiveAcademicYear()}'
);

// RKJMOrchestratorView
code = code.replace(
  'const { settings } = useApp();\n  const [activeTab, setActiveTab]',
  'const { settings, getActiveAcademicYear } = useApp();\n  const [activeTab, setActiveTab]'
);
code = code.replace(
  'Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}',
  'Tahun {getActiveAcademicYear()}'
);

// DocumentWorkspaceView
code = code.replace(
  'const { settings, updateSetting } = useApp();\n  const [activeTab, setActiveTab]',
  'const { settings, updateSetting, getActiveAcademicYear } = useApp();\n  const [activeTab, setActiveTab]'
);
code = code.replace(
  '<p className="text-sm font-bold text-slate-700">{settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</p>',
  '<p className="text-sm font-bold text-slate-700">{getActiveAcademicYear()}</p>'
);

// PrintDiagnosticView
code = code.replace(
  'const { settings } = useApp();',
  'const { settings, getActiveAcademicYear } = useApp();'
);
code = code.replace(
  'TAHUN {settings.academicYears?.find((y:any)=>y.isActive)?.name || "2024/2025"}',
  'TAHUN {getActiveAcademicYear()}'
);

// RKTDerivationView
code = code.replace(
  'const { settings, updateSetting } = useApp();\n  const [isSyncing, setIsSyncing]',
  'const { settings, updateSetting, getActiveAcademicYear } = useApp();\n  const [isSyncing, setIsSyncing]'
);
code = code.replace(
  'const currentYear = settings.academicYear || "2024/2025";',
  'const currentYear = getActiveAcademicYear();'
);

// RKASDerivationView
code = code.replace(
  'const { settings, showSuccess } = useApp();\n  const [syncStatus, setSyncStatus]',
  'const { settings, showSuccess, getActiveAcademicYear } = useApp();\n  const [syncStatus, setSyncStatus]'
);
code = code.replace(
  'const currentYear = settings?.academicYear || "2024/2025";',
  'const currentYear = getActiveAcademicYear();'
);

// MonitoringView
code = code.replace(
  'const { settings } = useApp();\n  const currentYear = settings.academicYear || "2024/2025";',
  'const { settings, getActiveAcademicYear } = useApp();\n  const currentYear = getActiveAcademicYear();'
);

// PublishingCenterView
code = code.replace(
  'const { settings } = useApp();\n  const [activeTab, setActiveTab]',
  'const { settings, getActiveAcademicYear } = useApp();\n  const [activeTab, setActiveTab]'
);
// In PublishingCenterView, we have two 2024/2025. Replace them globally inside the file.
code = code.replace(
  /Tahun \{settings\.academicYears\?\.find\(\(y:any\) => y\.isActive\)\?\.name \|\| "2024\/2025"\}/g,
  'Tahun {getActiveAcademicYear()}'
);

// SettingsView - in the sidebar
code = code.replace(
  /Tahun \{settings\.academicYears\?\.find\(\(y: any\) => y\.isActive\)\?\.name \|\| "2024\/2025"\}/g,
  'Tahun {getActiveAcademicYear()}'
);
// In LayoutContainer
code = code.replace(
  'const { settings, updateSetting } = useApp();',
  'const { settings, updateSetting, getActiveAcademicYear } = useApp();'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Academic Year Refactored");
