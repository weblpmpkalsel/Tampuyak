const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

if (!code.includes('import { EnterpriseWorkspaceShell }')) {
  // Just prepend it to the file
  code = "import { EnterpriseWorkspaceShell } from './enterprise/workspace/EnterpriseWorkspaceShell';\n" + code;
  fs.writeFileSync('src/Tampuyak.tsx', code);
}
