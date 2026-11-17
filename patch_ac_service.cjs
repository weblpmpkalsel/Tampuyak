const fs = require('fs');
let content = fs.readFileSync('src/enterprise/knowledge/services/AcademicCalendarService.ts', 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/enterprise/knowledge/services/AcademicCalendarService.ts', content);
console.log('patched AcademicCalendarService.ts');
