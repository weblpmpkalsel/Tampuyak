const fs = require('fs');
const path = require('path');

const panelPath = path.join(process.cwd(), 'src/ksp/KSPValidationPanel.tsx');
let content = fs.readFileSync(panelPath, 'utf8');

content = content.replace(
  `import { enterpriseComplianceEngine } from '../enterprise/compliance/ComplianceEngine';`,
  `import { enterpriseComplianceEngine } from '../enterprise/compliance/engine/ComplianceEngine';`
);

fs.writeFileSync(panelPath, content);
console.log('Patched KSPValidationPanel imports');
