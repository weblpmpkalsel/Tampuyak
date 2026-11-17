const fs = require('fs');

const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const startStr = 'const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {';
const endStr = 'const GlobalWorkflowStepper = ({ currentView, settings, navigateToView }: any) => {';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  
  const newComp = fs.readFileSync('workspace_comp.txt', 'utf8');
  
  fs.writeFileSync(file, before + newComp + after);
  console.log("Successfully replaced DocumentWorkspaceView");
} else {
  console.log("Could not find start or end strings");
}
