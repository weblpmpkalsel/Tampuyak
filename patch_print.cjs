const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(
  'const PrintDocumentRenderer = ({ docId, isPrintReady, exportDocx, setPrintMode, showToast }: any) => {\n  const { settings, getActiveAcademicYear } = useApp();',
  'const PrintDocumentRenderer = ({ docId, isPrintReady, exportDocx, setPrintMode, showToast }: any) => {\n  const { settings, getActiveAcademicYear, planning } = useApp();'
);

code = code.replace(
  'documentModel = generateAppDocument(docId, kg, settings);',
  'documentModel = generateAppDocument(docId, kg, { ...settings, planning });'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched print renderer parity!");
