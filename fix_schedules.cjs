const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "activeSchedules.find",
  "state.schedules.find"
);

fs.writeFileSync(file, code);
