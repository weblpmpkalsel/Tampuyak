const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/enterprise/workspace/EnterpriseWorkspaceShell.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('onClose?: () => void')) {
  content = content.replace(
    "import { useApp } from '../../Tampuyak';",
    "import { useApp } from '../../Tampuyak';\nimport { X } from 'lucide-react';"
  );
  content = content.replace(
    "export const EnterpriseWorkspaceShell = () => {",
    "export const EnterpriseWorkspaceShell = ({ onClose }: { onClose?: () => void }) => {"
  );
  
  const headerContent = `
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">KSP Enterprise Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Next-generation workspace for KSP Gold. This environment is isolated from legacy RKJM, RKT, and RKAS systems.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
  `;
  
  content = content.replace(
    /<div className="mb-6">[\s\S]*?<\/div>/,
    headerContent
  );
  fs.writeFileSync(file, content);
  console.log("Patched EnterpriseWorkspaceShell.tsx");
}
