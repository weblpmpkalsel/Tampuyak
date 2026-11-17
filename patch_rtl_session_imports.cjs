const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

// fix unused ScheduleStatus
code = code.replace(
  /ScheduleStatus\n} from '\.\.\/types\/SupervisionTypes';/,
  "} from '../types/SupervisionTypes';"
);
code = code.replace(
  /,\n  ScheduleStatus\n} from '\.\.\/types\/SupervisionTypes';/,
  "\n} from '../types/SupervisionTypes';"
);

// fix applicationService.startFollowUp
code = code.replace(
  "applicationService.startFollowUp(schedule.id, 'Peningkatan Berkelanjutan')",
  "applicationService.startFollowUp({ schedule })"
);

// fix mockFollowUpRepo.save
code = code.replace(
  "fu = await mockFollowUpRepo.save(newFu);",
  "fu = await mockFollowUpRepo.create(newFu);"
);

// fix applicationService.completeActionPlan
code = code.replace(
  "await applicationService.completeActionPlan(followUp.id);",
  "await applicationService.completeActionPlan({ followUp });"
);

fs.writeFileSync(file, code);
