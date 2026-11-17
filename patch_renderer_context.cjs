const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

if (!content.includes('import { LayoutProfileContext, LayoutProfile }')) {
  content = content.replace("import { CanonicalDocument", "import { LayoutProfileContext, LayoutProfile } from './LayoutProfile';\nimport { CanonicalDocument");
}

const searchProps = `interface CanonicalRendererProps {
  document: CanonicalDocument;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  scale: number;
}`;

const replaceProps = `interface CanonicalRendererProps {
  document: CanonicalDocument;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  scale: number;
  layoutProfile?: LayoutProfile;
}`;

if (content.includes(searchProps)) {
  content = content.replace(searchProps, replaceProps);
}

const searchRender = `export const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({ document, selectedNodeId, onSelectNode, scale }) => {
  return (
    <div className="flex flex-col gap-12 pb-24 items-center bg-gray-100 p-8 min-h-screen">`;

const replaceRender = `export const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({ document, selectedNodeId, onSelectNode, scale, layoutProfile }) => {
  return (
    <LayoutProfileContext.Provider value={layoutProfile || require('./LayoutProfile').defaultLayoutProfile}>
    <div className="flex flex-col gap-12 pb-24 items-center bg-gray-100 p-8 min-h-screen">`;

if (content.includes(searchRender)) {
  content = content.replace(searchRender, replaceRender);
  content = content.replace(`    </div>
  );
};`, `    </div>
    </LayoutProfileContext.Provider>
  );
};`);
}

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
console.log('patched context');
