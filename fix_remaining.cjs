const fs = require('fs');
let codeView = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherView.tsx', 'utf8');

if (!codeView.includes("import { SupervisionTeacherRtlDashboard }")) {
  codeView = codeView.replace(
    "import { MockScheduleRepository } from '../persistence/mock/MockScheduleRepository';",
    "import { MockScheduleRepository } from '../persistence/mock/MockScheduleRepository';\nimport { SupervisionTeacherRtlDashboard } from './SupervisionTeacherRtlDashboard';"
  );
  fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherView.tsx', codeView);
}

let codeAcad = fs.readFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', 'utf8');
codeAcad = codeAcad.replace(
  "state.schedules.find(s => s.id === activeRtlScheduleId)!",
  "Object.values(state.schedules.items).find(s => s.id === activeRtlScheduleId)!"
);
fs.writeFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', codeAcad);
