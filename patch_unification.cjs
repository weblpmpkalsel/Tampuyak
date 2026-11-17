const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. Extract the planning block
const planningBlockRegex = /  const planning = React\.useMemo\(\(\) => \{[\s\S]*?  \}, \[settings\.analisis\]\);\n/m;
const match = code.match(planningBlockRegex);
if (!match) {
  console.error("Could not find the planning block");
  process.exit(1);
}
const planningBlock = match[0];

// Remove it from its original location (RelationalPlanningView)
code = code.replace(planningBlock, '');

// Insert `const { planning } = useApp();` into RelationalPlanningView
// Right before `const currentYearPlan = ...` or similar. Wait, where was it?
// It was right after `const [isSyncing, setIsSyncing] = useState(false);`
code = code.replace(
  /const \[isSyncing, setIsSyncing\] = useState\(false\);\n/,
  "const [isSyncing, setIsSyncing] = useState(false);\n  const { planning } = useApp();\n"
);

// 2. Insert the planning block into AppProvider
// Right before the `if (!isReady) {` check in AppProvider
const insertPointAppProvider = "  if (!isReady) {";
code = code.replace(
  insertPointAppProvider,
  planningBlock + "\n" + insertPointAppProvider
);

// 3. Expose planning in AppContext.Provider
const providerValuePoint = "        updateAcademicYear,\n        getActiveAcademicYear,\n";
code = code.replace(
  providerValuePoint,
  providerValuePoint + "        planning,\n"
);

// 4. In DocumentWorkspaceView, get planning from useApp()
// const { settings, updateSetting, getActiveAcademicYear, showToast } = useApp();
code = code.replace(
  /const \{ settings, updateSetting, getActiveAcademicYear, showToast \} = useApp\(\);/,
  "const { settings, updateSetting, getActiveAcademicYear, showToast, planning } = useApp();"
);

// 5. In DocumentWorkspaceView, inject planning into generateAppDocument
code = code.replace(
  /const documentModel = generateAppDocument\(docId, kg, settings\);/g,
  "const documentModel = generateAppDocument(docId, kg, { ...settings, planning });"
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Unified planning state applied!");
