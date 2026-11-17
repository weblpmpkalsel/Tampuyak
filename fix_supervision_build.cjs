const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherAssignment.tsx', 'utf8');

// There is an error with map function probably:
// "setTeachers(users.map(u => ({"
// Let's verify what the users array looks like from getPendingUsers
// It returns UserProfile[] which has uid, displayName etc.
