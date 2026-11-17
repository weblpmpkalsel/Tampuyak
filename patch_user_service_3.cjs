const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/userService.ts', 'utf8');

code = code.replace(
  "static async updateUserProfile(uid: string, data: Partial<UserProfile>, actorRole?: UserRole): Promise<void> {",
  "static async updateUserProfile(uid: string, data: Partial<UserProfile>, currentUserRole?: UserRole): Promise<void> {"
);

code = code.replace(
  "if (data.role === 'OWNER' && actorRole !== 'OWNER') {",
  "if (data.role === 'OWNER' && currentUserRole !== 'OWNER') {"
);

fs.writeFileSync('src/services/firestore/userService.ts', code);
