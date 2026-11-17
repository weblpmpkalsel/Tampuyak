const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "<SupervisionRtlSession scheduleId={activeRtlScheduleId} onClose={() => setActiveRtlScheduleId(null)} />",
  "<SupervisionRtlSession schedule={activeSchedules.find(s => s.id === activeRtlScheduleId)!} onClose={() => setActiveRtlScheduleId(null)} />"
);

fs.writeFileSync(file, code);
