const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const searchSection = `const SectionRenderer: React.FC<{ section: DocumentSection; selectedNodeId: string | null; onSelectNode: (id: string) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean }> = ({ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval }) => {
  // Determine top margin based on GDDS (4cm for chapter start, 3cm otherwise - we'll just use 3cm for now, or 4cm for BAB)
  const topMargin = section.chapterId.startsWith('BAB_') ? 4 : 3;`;

const replaceSection = `const SectionRenderer: React.FC<{ section: DocumentSection; selectedNodeId: string | null; onSelectNode: (id: string) => void; scale: number; isCover: boolean; isTOC: boolean; isApproval: boolean }> = ({ section, selectedNodeId, onSelectNode, scale, isCover, isTOC, isApproval }) => {
  const profile = React.useContext(LayoutProfileContext);
  // Determine top margin based on GDDS (4cm for chapter start, 3cm otherwise - we'll just use 3cm for now, or 4cm for BAB)
  const baseTopMargin = section.chapterId.startsWith('BAB_') ? 4 : 3;
  const topMargin = isCover ? baseTopMargin + (profile.coverTopOffset || 0) : baseTopMargin;`;

if (content.includes(searchSection)) {
  content = content.replace(searchSection, replaceSection);
}

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
console.log('patched section');
