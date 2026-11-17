import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Import the new components
code = "import OrganizationSetup from './workspace/OrganizationSetup';\nimport OrganizationGuard from './workspace/OrganizationGuard';\n" + code

# Replace the dashboard route to include OrganizationGuard
pattern = r"<Route path=\"/dashboard/\*\" element=\{\s*<PortalDashboardGuard>\s*<WorkspaceProvider>\s*<Tampuyak />\s*</WorkspaceProvider>\s*</PortalDashboardGuard>\s*\} />"
replacement = """<Route path="/workspace/setup" element={
          <PortalDashboardGuard>
            <OrganizationSetup />
          </PortalDashboardGuard>
        } />
        
        <Route path="/dashboard/*" element={
          <PortalDashboardGuard>
            <OrganizationGuard>
              <WorkspaceProvider>
                <Tampuyak />
              </WorkspaceProvider>
            </OrganizationGuard>
          </PortalDashboardGuard>
        } />"""

code = re.sub(pattern, replacement, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)
