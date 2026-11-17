const fs = require('fs');
let code = fs.readFileSync('src/services/admin/adminService.ts', 'utf8');

code = "import { OrganizationService } from '../firestore/organizationService';\n" + code;
code = code.replace("const OrganizationService = require('../firestore/organizationService').OrganizationService;", "");

fs.writeFileSync('src/services/admin/adminService.ts', code);
