const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const regex1 = /export const CanonicalRenderer: React.FC<CanonicalRendererProps> = \(\{ document, selectedNodeId, onSelectNode, scale, layoutProfile \}\) => \{/;

code = code.replace(
  /interface CanonicalRendererProps \{/,
  `interface CanonicalRendererProps {
  overrides?: Record<string, string>;
  onSaveOverride?: (blockId: string, newText: string) => void;`
);

code = code.replace(
  regex1,
  `export const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({ document, selectedNodeId, onSelectNode, scale, layoutProfile, overrides = {}, onSaveOverride }) => {`
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', code);
console.log("Patched CanonicalRendererProps");
