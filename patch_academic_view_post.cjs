const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { SupervisionObservationSession } from './SupervisionObservationSession';",
  `import { SupervisionObservationSession } from './SupervisionObservationSession';
import { SupervisionPostObservationSession } from './SupervisionPostObservationSession';`
);

code = code.replace(
  "const [activeObservationScheduleId, setActiveObservationScheduleId] = useState<string | null>(null);",
  `const [activeObservationScheduleId, setActiveObservationScheduleId] = useState<string | null>(null);
  const [activePostObservationScheduleId, setActivePostObservationScheduleId] = useState<string | null>(null);`
);

code = code.replace(
  "if (activeObservationScheduleId) {",
  `if (activePostObservationScheduleId) {
    return <SupervisionPostObservationSession scheduleId={activePostObservationScheduleId} onClose={() => setActivePostObservationScheduleId(null)} />;
  }

  if (activeObservationScheduleId) {`
);

code = code.replace(
  "<SupervisionScheduling plan={activePlan} onStartObservation={(scheduleId) => setActiveObservationScheduleId(scheduleId)} />",
  "<SupervisionScheduling plan={activePlan} onStartObservation={(scheduleId) => setActiveObservationScheduleId(scheduleId)} onStartPostObservation={(scheduleId) => setActivePostObservationScheduleId(scheduleId)} />"
);

fs.writeFileSync(file, code);
