const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', 'utf8');

content = content.replace(
  /<button\n          onClick=\{\(\) => setShowModal\(true\)\}\n          className="px-4 py-2 bg-indigo-50 border border-indigo-100/g,
  "<PermissionGuard requiredPermission=\"MANAGE_TEACHER_ASSIGNMENT\">\n          <button\n            onClick={() => setShowModal(true)}\n            className=\"px-4 py-2 bg-indigo-50 border border-indigo-100"
);

fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', content);
