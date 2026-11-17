const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherAssignment.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetReplace = `const availableTeachers = teachers.filter(t => !assignedTeacherIds.includes(t.id));`;
const newContent = `const availableTeachers = teachers.filter(t => !assignedTeacherIds.includes(t.id));
  
  console.log("Trace - Total teachers loaded:", teachers.length);
  console.log("Trace - Assigned teachers count:", assignedTeacherIds.length);
  console.log("Trace - Filtered teachers count:", availableTeachers.length);`;

content = content.replace(targetReplace, newContent);

fs.writeFileSync(file, content);
