const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
`<Route path="/debug" element={<WorkspaceProvider><Tampuyak /></WorkspaceProvider>} />`,
`<Route path="/debug" element={<WorkspaceProvider><Tampuyak /></WorkspaceProvider>} />
        {import.meta.env.DEV && <Route path="/uat" element={<WorkspaceProvider><Tampuyak /></WorkspaceProvider>} />}`
);

fs.writeFileSync('src/App.tsx', file);
