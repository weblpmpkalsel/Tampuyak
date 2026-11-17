const fs = require('fs');
const file = 'src/modules/supervision/persistence/mock/MockFollowUpRepository.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async findByScheduleId",
  "async findAll(): Promise<FollowUp[]> {\n    return Array.from(mockFollowUps.values());\n  }\n\n  async findByScheduleId"
);

fs.writeFileSync(file, code);
