const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionPublishingView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("MockPostObservationRepository")) {
  code = code.replace(
    "import { MockFollowUpRepository } from '../persistence/mock/MockFollowUpRepository';",
    "import { MockFollowUpRepository } from '../persistence/mock/MockFollowUpRepository';\nimport { MockPostObservationRepository } from '../persistence/mock/MockPostObservationRepository';"
  );
  code = code.replace(
    "const fuRepo = new MockFollowUpRepository();",
    "const fuRepo = new MockFollowUpRepository();\nconst poRepo = new MockPostObservationRepository();"
  );
}

code = code.replace(
  "fuRepo.findAll()",
  "fuRepo.findAll(),\n          poRepo.findAll()"
);

code = code.replace(
  "const [plans, schedules, observations, followUps] = await Promise.all([",
  "const [plans, schedules, observations, followUps, postObservations] = await Promise.all(["
);

code = code.replace(
  "setData({ plans, schedules, observations, followUps });",
  "setData({ plans, schedules, observations, followUps, postObservations });"
);

fs.writeFileSync(file, code);
