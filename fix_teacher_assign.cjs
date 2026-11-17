const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', 'utf8');

// Remove the misplaced </PermissionGuard> at the end
content = content.replace(
  /Tambahkan \(\{selectedTeachers\.size\}\) Guru\n              <\/button>\n                    <\/PermissionGuard>\n                  <\/div>\n                <\/div>/,
  "Tambahkan ({selectedTeachers.size}) Guru\n              </button>\n            </div>\n          </div>"
);

// Add guard to the Trash2 button
content = content.replace(
  /<button \n                      onClick=\{\(\) => handleRemoveTeacher\(schedule.id\)\}\n                      className="p-2 text-rose-500/g,
  "<PermissionGuard requiredPermission=\"MANAGE_TEACHER_ASSIGNMENT\">\n                    <button \n                      onClick={() => handleRemoveTeacher(schedule.id)}\n                      className=\"p-2 text-rose-500"
);

content = content.replace(
  /<Trash2 className="w-4 h-4" \/>\n                    <\/button>/g,
  "<Trash2 className=\"w-4 h-4\" />\n                    </button>\n                    </PermissionGuard>"
);

fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', content);
