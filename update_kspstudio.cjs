const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const searchStr = `const KSPStudioView = ({ navigateToView }: any) => {
  const { settings } = useApp();
  const [showWorkspace, setShowWorkspace] = useState(false);
  
  if (showWorkspace) {
    return <KSPWorkspace onClose={() => setShowWorkspace(false)} settings={settings} />;
  }
  
  return <KSPDashboard onOpenWorkspace={() => setShowWorkspace(true)} />;
};`;

const replaceStr = `const KSPStudioView = ({ navigateToView }: any) => {
  const { settings } = useApp();
  const [activeMode, setActiveMode] = useState<"home" | "preview" | "validation" | "attachments">("home");
  
  if (activeMode === "preview") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KspPreviewWorkspace onClose={() => setActiveMode("home")} />
      </div>
    );
  }
  
  if (activeMode === "validation") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KSPValidationPanel onClose={() => setActiveMode("home")} />
      </div>
    );
  }

  if (activeMode === "attachments") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KSPAttachmentPanel onClose={() => setActiveMode("home")} />
      </div>
    );
  }
  
  return (
    <KSPDashboard 
      onOpenPreview={() => setActiveMode("preview")} 
      onOpenValidation={() => setActiveMode("validation")} 
      onOpenAttachments={() => setActiveMode("attachments")} 
    />
  );
};`;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  
  // Also make sure to import KspPreviewWorkspace if not imported
  if (!code.includes("KspPreviewWorkspace")) {
     code = code.replace("import { KSPDashboard, KSPWorkspace } from \"./ksp\";", "import { KSPDashboard, KSPWorkspace } from \"./ksp\";\nimport { KspPreviewWorkspace } from \"./enterprise/workspace/preview/KspPreviewWorkspace\";\nimport { KSPValidationPanel } from \"./ksp/KSPValidationPanel\";\nimport { KSPAttachmentPanel } from \"./ksp/KSPAttachmentPanel\";");
  }

  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Updated KSPStudioView");
} else {
  console.log("Could not find KSPStudioView string");
}
