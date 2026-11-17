const fs = require('fs');
let code = fs.readFileSync('src/enterprise/document/frontmatter/PrefaceBuilder.ts', 'utf8');

code = code.replace(/metadata\.schoolName \|\| '\.+'/g, "metadata.schoolName || 'Belum diisi'");
code = code.replace(/metadata\.academicYear \|\| '\.+'/g, "metadata.academicYear || 'Belum diisi'");
code = code.replace(/metadata\.regencyOrCity \|\| '\.+'/g, "metadata.regencyOrCity || 'Belum diisi'");
code = code.replace(/metadata\.approvalDate \|\| '\.+'/g, "metadata.approvalDate || 'Belum diisi'");
code = code.replace(/metadata\.principalName \|\| '\.+'/g, "metadata.principalName || 'Belum diisi'");
code = code.replace(/metadata\.principalNip \|\| '\.+'/g, "metadata.principalNip || 'Belum diisi'");

fs.writeFileSync('src/enterprise/document/frontmatter/PrefaceBuilder.ts', code);
