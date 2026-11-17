const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

code = code.replace(
  /const SectionRenderer: React.FC<\{ section: DocumentSection; selectedNodeId: string \| null; onSelectNode: \(id: string\) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean \}> = \(\{ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval \}\) => \{/,
  `const SectionRenderer: React.FC<{ section: DocumentSection; selectedNodeId: string | null; onSelectNode: (id: string) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean; overrides: Record<string, string>; onSaveOverride?: (id: string, val: string) => void }> = ({ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval, overrides, onSaveOverride }) => {`
);

code = code.replace(
  /<SectionRenderer/g,
  `<SectionRenderer overrides={overrides} onSaveOverride={onSaveOverride}`
);

code = code.replace(
  /const BlockRenderer: React.FC<\{ block: DocumentBlock; selectedNodeId: string \| null; onSelectNode: \(id: string\) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel\?: number \}> = \(\{ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1 \}\) => \{/,
  `const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel?: number; overrides: Record<string, string>; onSaveOverride?: (id: string, val: string) => void }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1, overrides, onSaveOverride }) => {`
);

code = code.replace(
  /<BlockRenderer/g,
  `<BlockRenderer overrides={overrides} onSaveOverride={onSaveOverride}`
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', code);
console.log("Patched SectionRenderer and BlockRenderer");
