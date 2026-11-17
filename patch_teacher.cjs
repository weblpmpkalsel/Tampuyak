const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherAssignment.tsx';
let content = fs.readFileSync(file, 'utf8');

const logCode = `
  console.log("Trace - Total teachers loaded:", teachers.length);
  console.log("Trace - Assigned teachers count:", assignedTeacherIds.length);
  console.log("Trace - Filtered teachers count:", availableTeachers.length);
  if (availableTeachers.length === 0) {
    console.log("Trace - Identify why availableTeachers.length becomes zero: teachers array is empty because it is loaded from UserService instead of Data Sekolah (Enterprise Master Data), or all teachers are already assigned.");
  }
`;

content = content.replace(
  'const availableTeachers = teachers.filter(t => !assignedTeacherIds.includes(t.id));',
  'const availableTeachers = teachers.filter(t => !assignedTeacherIds.includes(t.id));\n' + logCode
);

fs.writeFileSync(file, content);
