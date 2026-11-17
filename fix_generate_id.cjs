const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "  private generateId(): string {\n    return 'dom-' + Math.random().toString(36).substr(2, 9);\n  }",
  "  private generateId(): string {\n    // Ideally use uuid or let repo generate. Using crypto.randomUUID if available or fallback.\n    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'dom-' + Math.random().toString(36).substring(2, 11);\n  }"
);
fs.writeFileSync(file, content);
