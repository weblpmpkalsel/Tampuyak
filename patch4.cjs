const fs = require('fs');
let code = fs.readFileSync('src/enterprise/document/ksp/approval/KspApprovalStructure.ts', 'utf8');

code = code.replace(/config\.documentNumber \|\| '\.+'/g, "config.documentNumber || 'Belum diisi'");
code = code.replace(/'academicYear' in config \? \(config as any\)\.academicYear : '\.+'/g, "'academicYear' in config ? (config as any).academicYear : 'Belum diisi'");
code = code.replace(/config\.schoolCommitteeName \|\| '\.+'/g, "config.schoolCommitteeName || 'Belum diisi'");
code = code.replace(/config\.approvalDate \|\| '\.+'/g, "config.approvalDate || 'Belum diisi'");
code = code.replace(/config\.principalNip \|\| '\.+'/g, "config.principalNip || 'Belum diisi'");
code = code.replace(/config\.supervisorNip \|\| '\.+'/g, "config.supervisorNip || 'Belum diisi'");

fs.writeFileSync('src/enterprise/document/ksp/approval/KspApprovalStructure.ts', code);
