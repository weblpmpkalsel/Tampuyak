const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. Add import for EnterpriseWorkspaceShell at the top
if (!code.includes('import { EnterpriseWorkspaceShell }')) {
  // Let's just put it near the top
  code = code.replace("import React,", "import { EnterpriseWorkspaceShell } from './enterprise/workspace/EnterpriseWorkspaceShell';\nimport React,");
}

// 2. Add sidebar item
const sidebarItem = `
          <button
            onClick={() => setCurrentView("enterpriseWorkspace")}
            className={\`enterprise-sidebar-item \${currentView === "enterpriseWorkspace" ? "active" : ""}\`}
          >
            <Building2
              className="enterprise-sidebar-icon"
            />
            Workspace Enterprise
          </button>
`;
if (!code.includes('setCurrentView("enterpriseWorkspace")')) {
  const target = `            Data Sekolah
          </button>`;
  code = code.replace(target, target + '\n' + sidebarItem);
}

// 3. Add to breadcrumb mapping
if (!code.includes('currentView === "enterpriseWorkspace" ? "Workspace Enterprise"')) {
  code = code.replace(
    'currentView === "dataSekolah" ? "Data Sekolah"',
    'currentView === "enterpriseWorkspace" ? "Workspace Enterprise" : currentView === "dataSekolah" ? "Data Sekolah"'
  );
}

// 4. Render the component
if (!code.includes('<EnterpriseWorkspaceShell />')) {
  const renderTarget = `{currentView === "dataSekolah" && (`;
  const renderReplacement = `{currentView === "enterpriseWorkspace" && (
              <EnterpriseWorkspaceShell />
            )}
            ` + renderTarget;
  code = code.replace(renderTarget, renderReplacement);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
