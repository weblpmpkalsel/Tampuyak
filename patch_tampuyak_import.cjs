const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importStr = `
import { ApprovalsView } from "./control/ApprovalsView";
import { auth } from "./lib/firebase";
import { PermissionService } from "./services/auth/permissionService";
`;

code = importStr + code;
fs.writeFileSync('src/Tampuyak.tsx', code);
