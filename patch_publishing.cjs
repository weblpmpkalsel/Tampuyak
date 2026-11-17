const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionAcademicView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { SupervisionPublishingView }")) {
  code = code.replace(
    "import { SupervisionExecutiveDashboard } from './SupervisionExecutiveDashboard';",
    "import { SupervisionExecutiveDashboard } from './SupervisionExecutiveDashboard';\nimport { SupervisionPublishingView } from './SupervisionPublishingView';\nimport { FileOutput } from 'lucide-react';"
  );
}

if (!code.includes("showPublishing")) {
  code = code.replace(
    "const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);",
    "const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);\n  const [showPublishing, setShowPublishing] = useState(false);"
  );
  
  code = code.replace(
    "if (showExecutiveDashboard) {",
    "if (showPublishing) {\n    return (\n      <div className=\"space-y-4\">\n        <div className=\"flex justify-end\">\n          <button onClick={() => setShowPublishing(false)} className=\"px-4 py-2 bg-slate-100 font-bold rounded-lg\">Kembali ke Supervisi</button>\n        </div>\n        <SupervisionPublishingView />\n      </div>\n    );\n  }\n\n  if (showExecutiveDashboard) {"
  );
}

// Replace the existing buttons container
const newButtons = `
        <div className="flex gap-2">
          <button
            onClick={() => setShowPublishing(true)}
            className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-100 transition-colors flex items-center"
          >
            <FileOutput className="w-4 h-4 mr-2" />
            Publishing
          </button>
          <button
            onClick={() => setShowExecutiveDashboard(true)}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg shadow-sm hover:bg-indigo-100 transition-colors flex items-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-colors flex items-center"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Pustaka
          </button>
        </div>
`;

code = code.replace(
  /<div className="flex gap-2">[\s\S]*?<\/div>/,
  newButtons.trim()
);

fs.writeFileSync(file, code);
