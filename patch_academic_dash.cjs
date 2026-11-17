const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { SupervisionExecutiveDashboard }")) {
  code = code.replace(
    "import { SupervisionTrackingSession } from './SupervisionTrackingSession';",
    "import { SupervisionTrackingSession } from './SupervisionTrackingSession';\nimport { SupervisionExecutiveDashboard } from './SupervisionExecutiveDashboard';\nimport { BarChart3 } from 'lucide-react';"
  );
}

if (!code.includes("showExecutiveDashboard")) {
  code = code.replace(
    "const [showLibrary, setShowLibrary] = useState(false);",
    "const [showLibrary, setShowLibrary] = useState(false);\n  const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);"
  );
  
  code = code.replace(
    "if (showLibrary) {",
    "if (showExecutiveDashboard) {\n    return (\n      <div className=\"space-y-4\">\n        <div className=\"flex justify-end\">\n          <button onClick={() => setShowExecutiveDashboard(false)} className=\"px-4 py-2 bg-slate-100 font-bold rounded-lg\">Kembali ke Supervisi</button>\n        </div>\n        <SupervisionExecutiveDashboard />\n      </div>\n    );\n  }\n\n  if (showLibrary) {"
  );
}

const replacementButtons = `
        <div className="flex gap-2">
          <button
            onClick={() => setShowExecutiveDashboard(true)}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg shadow-sm hover:bg-indigo-100 transition-colors flex items-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard Analitik
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-colors flex items-center"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Pustaka Instrumen
          </button>
        </div>
`;

code = code.replace(
  /<button\s*onClick=\{\(\) => setShowLibrary\(true\)\}[\s\S]*?<\/button>/,
  replacementButtons.trim()
);

fs.writeFileSync(file, code);
