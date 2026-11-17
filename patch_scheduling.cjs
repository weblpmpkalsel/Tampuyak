const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { MockSupervisionRepository } from '../persistence/mock/MockSupervisionRepository';",
  "import { MockSupervisionRepository } from '../persistence/mock/MockSupervisionRepository';\nimport { MockScheduleRepository } from '../persistence/mock/MockScheduleRepository';"
);

code = code.replace(
  "const mockSupervisionRepo = new MockSupervisionRepository();",
  "const mockSupervisionRepo = new MockSupervisionRepository();\nconst mockScheduleRepo = new MockScheduleRepository();"
);

code = code.replace(
  "await mockSupervisionRepo.saveSchedule(updatedSchedule);",
  "await mockScheduleRepo.update(updatedSchedule.id, updatedSchedule);"
);

code = code.replace(
  "const updatedSchedules = await mockSupervisionRepo.findSchedulesByPlanId(plan.id);",
  "const updatedSchedules = await mockScheduleRepo.findByPlanId(plan.id);"
);

fs.writeFileSync(file, code);
