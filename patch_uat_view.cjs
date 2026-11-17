const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const uatViewCode = `
// ============================================================================
// UAT VIEW
// ============================================================================
const UATView = ({ navigateToView, navigateToSettings }: any) => {
  const { settings, getActiveAcademicYear } = useApp();
  const activeYear = getActiveAcademicYear();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-indigo-900">UAT Enterprise Verification Dashboard</h1>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">Test Mode</span>
      </div>
      
      <Card title="System Context" description="Current active state for verification">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">Academic Year</p>
            <p className="font-bold text-slate-800">{activeYear?.name || "None"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">School Name</p>
            <p className="font-bold text-slate-800">{settings.school?.name || "Blank"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">Education Level</p>
            <p className="font-bold text-slate-800">{settings.school?.level || "SD"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">State Status</p>
            <p className="font-bold text-emerald-600">Active</p>
          </div>
        </div>
      </Card>

      <Card title="Module Verification Shortcuts" description="Navigate directly to modules to verify state boundary integrity.">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Button onClick={() => navigateToSettings("school")} variant="outline" className="justify-start text-left">1. Global School Profile</Button>
          <Button onClick={() => navigateToSettings("academicYear")} variant="outline" className="justify-start text-left">2. Academic Year Switching</Button>
          <Button onClick={() => navigateToSettings("guru")} variant="outline" className="justify-start text-left">3. Teachers (Guru)</Button>
          <Button onClick={() => navigateToSettings("tendik")} variant="outline" className="justify-start text-left">4. Education Staff</Button>
          <Button onClick={() => navigateToSettings("sarpras")} variant="outline" className="justify-start text-left">5. Facilities (Sarpras)</Button>
          <Button onClick={() => navigateToSettings("rombel")} variant="outline" className="justify-start text-left">6. Rombel</Button>
          <Button onClick={() => navigateToSettings("pesertaDidik")} variant="outline" className="justify-start text-left">7. Student Statistics</Button>
          <Button onClick={() => navigateToView("kalenderPendidikan")} variant="outline" className="justify-start text-left">8. Academic Calendar</Button>
          <Button onClick={() => navigateToView("documentEditor")} variant="outline" className="justify-start text-left">9. KSP Generation</Button>
          <Button onClick={() => navigateToView("rkjmPipeline")} variant="outline" className="justify-start text-left">10. RKJM</Button>
          <Button onClick={() => navigateToView("rktDerivation")} variant="outline" className="justify-start text-left">11. RKT</Button>
          <Button onClick={() => navigateToView("rkasDerivation")} variant="outline" className="justify-start text-left">12. RKAS</Button>
          <Button onClick={() => navigateToView("monitoring")} variant="outline" className="justify-start text-left">13. Monitoring</Button>
          <Button onClick={() => navigateToView("supervisiAkademik")} variant="outline" className="justify-start text-left">14. Supervision</Button>
        </div>
      </Card>
      
      <div className="text-center text-xs text-slate-400 mt-8">
        Enterprise Verification Build - Not for Production
      </div>
    </div>
  );
};

const LayoutContainer = () => {
`;

file = file.replace('const LayoutContainer = () => {', uatViewCode);
fs.writeFileSync('src/Tampuyak.tsx', file);
