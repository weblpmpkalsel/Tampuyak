const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { SupervisionPostObservationSession } from './SupervisionPostObservationSession';",
  `import { SupervisionPostObservationSession } from './SupervisionPostObservationSession';
import { SupervisionRtlSession } from './SupervisionRtlSession';`
);

code = code.replace(
  "const [activePostObservationScheduleId, setActivePostObservationScheduleId] = useState<string | null>(null);",
  `const [activePostObservationScheduleId, setActivePostObservationScheduleId] = useState<string | null>(null);
  const [activeRtlScheduleId, setActiveRtlScheduleId] = useState<string | null>(null);`
);

code = code.replace(
  "if (activePostObservationScheduleId) {",
  `if (activeRtlScheduleId) {
    return <SupervisionRtlSession scheduleId={activeRtlScheduleId} onClose={() => setActiveRtlScheduleId(null)} />;
  }

  if (activePostObservationScheduleId) {`
);

code = code.replace(
  "<SupervisionScheduling plan={activePlan} onStartObservation={(scheduleId) => setActiveObservationScheduleId(scheduleId)} onStartPostObservation={(scheduleId) => setActivePostObservationScheduleId(scheduleId)} />",
  "<SupervisionScheduling plan={activePlan} onStartObservation={(scheduleId) => setActiveObservationScheduleId(scheduleId)} onStartPostObservation={(scheduleId) => setActivePostObservationScheduleId(scheduleId)} onStartRtl={(scheduleId) => setActiveRtlScheduleId(scheduleId)} />"
);

fs.writeFileSync(file, code);
