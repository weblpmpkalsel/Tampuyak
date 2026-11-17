const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

// I might have passed scheduleId instead of schedule to SupervisionRtlSession
code = code.replace(
  "<SupervisionRtlSession scheduleId={rtlSessionFor} onClose={() => setRtlSessionFor(null)} />",
  "<SupervisionRtlSession schedule={activeSchedules.find(s => s.id === rtlSessionFor) || schedules.find(s => s.id === rtlSessionFor)!} onClose={() => setRtlSessionFor(null)} />"
);

fs.writeFileSync(file, code);
