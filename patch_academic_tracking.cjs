const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { SupervisionTrackingSession }")) {
  code = code.replace(
    "import { SupervisionRtlSession } from './SupervisionRtlSession';",
    "import { SupervisionRtlSession } from './SupervisionRtlSession';\nimport { SupervisionTrackingSession } from './SupervisionTrackingSession';"
  );
}

if (!code.includes("activeTrackingScheduleId")) {
  code = code.replace(
    "const [activeRtlScheduleId, setActiveRtlScheduleId] = useState<string | null>(null);",
    "const [activeRtlScheduleId, setActiveRtlScheduleId] = useState<string | null>(null);\n  const [activeTrackingScheduleId, setActiveTrackingScheduleId] = useState<string | null>(null);"
  );
  
  code = code.replace(
    "if (activeRtlScheduleId) {",
    "if (activeTrackingScheduleId) {\n    return <SupervisionTrackingSession schedule={state.schedules.schedules.find(s => s.id === activeTrackingScheduleId)!} onClose={() => setActiveTrackingScheduleId(null)} />;\n  }\n\n  if (activeRtlScheduleId) {"
  );
}

// Ensure Supervisor can click on it.
// We need to add a button in the dashboard for Tracking if the schedule is DONE or RTL VERIFIED.
// For now, let's just make the "Pemantauan RTL" action visible instead of "Buka dashboard tracking" or similar.
// Wait, currently AcademicView has a table `Schedules Table`.
const replacementAction = `
                        {schedule.status === SupervisionStatus.DONE && (
                          <button 
                            onClick={() => setActiveTrackingScheduleId(schedule.id)}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center font-medium gap-1 text-xs px-3"
                          >
                            <FileSignature className="w-4 h-4" />
                            Tracking Peningkatan
                          </button>
                        )}
                        {schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP && (
`;

code = code.replace(
  "{schedule.status === SupervisionStatus.WAITING_FOR_FOLLOW_UP && (",
  replacementAction
);

fs.writeFileSync(file, code);
