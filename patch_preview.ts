import fs from 'fs';

const path = 'src/enterprise/workspace/preview/KspPreviewWorkspace.tsx';
let code = fs.readFileSync(path, 'utf-8');

// Imports
const newImports = `
import { useApp } from '../../../Tampuyak';
import { enterpriseComplianceEngine } from '../../compliance/engine/ComplianceEngine';
import { ComplianceContext } from '../../compliance/ComplianceTypes';
import { Printer, FileText, Download, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { KSPValidationPanel } from '../../../ksp/KSPValidationPanel';
`;

code = code.replace("import { ArrowLeft } from 'lucide-react';", "import { ArrowLeft } from 'lucide-react';" + newImports);

// State and context inside component
const componentStart = `export const KspPreviewWorkspace: React.FC<{ onClose?: () => void }> = ({ onClose }) => {`;
const newState = `
  const { settings } = useApp();
  const complianceContext: ComplianceContext = useMemo(() => ({
    documentType: 'KSP',
    metadata: settings
  }), [settings]);
  const complianceReport = useMemo(() => enterpriseComplianceEngine.execute(complianceContext), [complianceContext]);
  const isReady = complianceReport.releaseReadiness;
  const [showValidationDrawer, setShowValidationDrawer] = useState(false);
`;

code = code.replace(componentStart, componentStart + newState);

// Replace Toolbar with new Header
const oldToolbarRegex = /\{\/\* Toolbar \*\/\}.*?<\/div>/s;
const newHeader = `
        {/* Command Center Header */}
        <div className="border-b border-gray-200 bg-white flex flex-col shadow-sm z-10 shrink-0 relative px-6 py-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              {onClose && (
                <button 
                  onClick={onClose} 
                  className="px-3 py-1.5 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">Kurikulum Satuan Pendidikan</h1>
                <p className="text-sm text-gray-500">Preview & Command Center</p>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="flex gap-2">
              <button onClick={() => window.print()} disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}\`}>
                <Printer className="w-4 h-4" /> Print Browser
              </button>
              <button disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent'}\`}>
                <FileText className="w-4 h-4" /> Export PDF
              </button>
              <button disabled={!isReady} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent'}\`}>
                <Download className="w-4 h-4" /> Export DOCX
              </button>
            </div>
          </div>
          
          {/* Document Status Card */}
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-4 divide-x divide-gray-200">
             <div className="px-4 first:pl-0 flex-1">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Completion</div>
               <div className="text-2xl font-black text-gray-900">{complianceReport.completionScore}%</div>
             </div>
             <div className="px-4 flex-1">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Validation Summary</div>
               <div className="flex items-center gap-2">
                 {isReady ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                 <span className={\`font-bold \${isReady ? 'text-emerald-700' : 'text-amber-700'}\`}>
                   {isReady ? 'All Checks Passed' : \`\${complianceReport.issues.length} Issues Found\`}
                 </span>
               </div>
             </div>
             <div className="px-4 flex-1 flex flex-col justify-center">
               <div className="flex justify-between items-center">
                 <div>
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Publishing Readiness</div>
                   <div className={\`text-sm font-bold px-2 py-0.5 rounded inline-block \${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}\`}>
                     {isReady ? 'READY TO PUBLISH' : 'BLOCKED'}
                   </div>
                 </div>
                 <button onClick={() => setShowValidationDrawer(true)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-md">
                   Open Validation <ChevronRight className="w-4 h-4 ml-1" />
                 </button>
               </div>
             </div>
          </div>
        </div>
`;

code = code.replace(oldToolbarRegex, newHeader);

// Add floating zoom controls and drawer
const endTag = `      </div>
    </div>
  );
};`;

const floatingControls = `
        {/* Floating Zoom Controls */}
        <div className="absolute bottom-6 right-[340px] flex items-center bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 z-20">
           <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Zoom Out">-</button>
           <span className="text-xs font-mono w-12 text-center text-gray-600">{Math.round(scale * 100)}%</span>
           <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Zoom In">+</button>
           <div className="w-px h-4 bg-gray-300 mx-1" />
           <button onClick={handleFitWidth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 text-xs font-medium" title="Fit Width">W</button>
           <button onClick={handleFitPage} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 text-xs font-medium" title="Fit Page">P</button>
        </div>
        
        {/* Validation Drawer */}
        {showValidationDrawer && (
          <>
            <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setShowValidationDrawer(false)} />
            <div className="absolute inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
               <div className="flex-1 overflow-y-auto">
                 <KSPValidationPanel onClose={() => setShowValidationDrawer(false)} />
               </div>
            </div>
          </>
        )}
`;

code = code.replace(endTag, floatingControls + '\n' + endTag);

fs.writeFileSync(path, code);
