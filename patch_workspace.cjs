const fs = require('fs');
let file = fs.readFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', 'utf8');

file = file.replace(
  /<div className="flex-1 overflow-y-auto">[\s\S]*?<CanonicalRenderer[\s\S]*?\/>[\s\S]*?<\/div>/,
  `{/* Document Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 print:bg-white py-8">
          <div className="flex flex-col items-center gdds-preview-scale" style={{ transform: \`scale(\${scale})\`, transformOrigin: 'top center' }}>
            <div className="print-canvas-root w-full relative flex flex-col items-center gap-8">
              <CanonicalRenderer 
                document={document} 
                selectedNodeId={selectedNodeId} 
                onSelectNode={setSelectedNodeId} 
                scale={1} 
                layoutProfile={layoutProfile}
                overrides={settings.documentOverrides || {}}
                onSaveOverride={(id, val) => updateSetting('documentOverrides', id, val)}
              />
            </div>
          </div>
        </div>`
);

fs.writeFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', file);
