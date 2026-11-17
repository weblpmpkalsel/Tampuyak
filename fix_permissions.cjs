const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/auth/SupervisionPermissions.ts', 'utf8');

content = content.replace(/'TEACHER' \| /g, '');
content = content.replace(/ \| 'TEACHER'/g, '');

const permissions = {
  VIEW_TEACHER_DASHBOARD: "['TEACHER']",
  UPLOAD_PRE_OBSERVATION: "['TEACHER']",
  ACKNOWLEDGE_POST_OBSERVATION: "['TEACHER']",
  ACKNOWLEDGE_RTL: "['TEACHER']"
};

content = content.replace(/\['TEACHER'\]/g, "['HEADMASTER', 'SUPERVISOR', 'ASSESSOR']");
content = content.replace(/'TEACHER', /g, '');
content = content.replace(/, 'TEACHER'/g, '');

fs.writeFileSync('src/modules/supervision/auth/SupervisionPermissions.ts', content);
