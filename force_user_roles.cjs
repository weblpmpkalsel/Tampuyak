const fs = require('fs');

const file = 'src/services/firestore/userService.ts';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export type UserRole =')) {
    lines[i] = "export type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'OPERATOR' | 'HEADMASTER' | 'VIEWER' | 'ADMIN' | 'school_admin';";
  }
}

fs.writeFileSync(file, lines.join('\n'));
