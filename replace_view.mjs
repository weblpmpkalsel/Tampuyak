import fs from 'fs';
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const regex = /const ProductionReadinessView = \(\) => \{[\s\S]*?\n\};/m;

const newInspector = `const EnterpriseValidationInspector = () => {
  const { settings } = useApp();
  const sysVal = EnterpriseValidationEngine.validateSystem(settings);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-slate-900 text-slate-200">
      <div className="p-6 border-b border-slate-700 bg-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Terminal className="w-6 h-6 mr-3 text-emerald-400" />
          Enterprise Validation Inspector (EVE)
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Diagnostic tool for system-wide validation traces. Only visible in Developer Mode.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">Overall Score</div>
            <div className="text-3xl font-black text-emerald-400">{sysVal.score}%</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">System Status</div>
            <div className={\`text-3xl font-black \${sysVal.overallStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}\`}>
              {sysVal.overallStatus}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">Total Rules</div>
            <div className="text-3xl font-black text-blue-400">{sysVal.traces.length}</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs">
              <th className="p-3">Requirement</th>
              <th className="p-3">Source Module</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Fix Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {sysVal.traces.map((trace: any) => (
              <tr key={trace.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="p-3 font-medium text-white">{trace.requirement}</td>
                <td className="p-3 text-slate-400">{trace.sourceModule}</td>
                <td className="p-3">
                  <span className={\`px-2 py-1 rounded text-xs font-bold \${trace.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}\`}>
                    {trace.status}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{trace.reason}</td>
                <td className="p-3 text-slate-400 text-xs italic">{trace.fixAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};`;

content = content.replace(regex, newInspector);
fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Replaced Production Readiness View');
