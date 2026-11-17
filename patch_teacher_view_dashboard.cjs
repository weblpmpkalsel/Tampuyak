const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionTeacherView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "export const SupervisionTeacherView = () => {",
  `import { SupervisionTeacherRtlDashboard } from './SupervisionTeacherRtlDashboard';

export const SupervisionTeacherView = () => {`
);

code = code.replace(
  "const [reflectionFor, setReflectionFor] = useState<string | null>(null);",
  `const [reflectionFor, setReflectionFor] = useState<string | null>(null);
  const [rtlDashboardFor, setRtlDashboardFor] = useState<string | null>(null);

  if (rtlDashboardFor) {
    return <SupervisionTeacherRtlDashboard scheduleId={rtlDashboardFor} onClose={() => setRtlDashboardFor(null)} />;
  }`
);

code = code.replace(
  `              <button 
                onClick={() => alert("Buka dashboard RTL Guru")}
                className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >`,
  `              <button 
                onClick={() => setRtlDashboardFor('mock-schedule-id')}
                className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >`
);

fs.writeFileSync(file, code);
