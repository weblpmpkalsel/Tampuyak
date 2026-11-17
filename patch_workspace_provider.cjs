const fs = require('fs');
let code = fs.readFileSync('src/workspace/WorkspaceContext.tsx', 'utf8');

code = code.replace(
  /const \[state, setState\] = useState<WorkspaceState>\(\{\n\s*workspaceMode: 'preview',\n\s*selection: null,\n\s*overrides: \{\},\n\s*zoom: 100,\n\s*\}\);/,
  `const [state, setState] = useState<WorkspaceState>(() => {
    let initialOverrides = {};
    try {
      const saved = localStorage.getItem('tampuyak_document_overrides');
      if (saved) initialOverrides = JSON.parse(saved);
    } catch(e) {}
    return {
      workspaceMode: 'preview',
      selection: null,
      overrides: initialOverrides,
      zoom: 100,
    };
  });
  
  React.useEffect(() => {
    try {
      localStorage.setItem('tampuyak_document_overrides', JSON.stringify(state.overrides));
    } catch(e) {}
  }, [state.overrides]);`
);

fs.writeFileSync('src/workspace/WorkspaceContext.tsx', code);
console.log("Patched WorkspaceContext");
