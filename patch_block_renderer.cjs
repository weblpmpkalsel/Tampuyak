const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const searchContext = `const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel?: number }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1 }) => {
  const isSelected = selectedNodeId === block.id;`;

const replaceContext = `const BlockRenderer: React.FC<{ block: DocumentBlock; selectedNodeId: string | null; onSelectNode: (id: string) => void; isCover: boolean; isTOC: boolean; isApproval: boolean; tocLevel?: number }> = ({ block, selectedNodeId, onSelectNode, isCover, isTOC, isApproval, tocLevel = 1 }) => {
  const profile = React.useContext(LayoutProfileContext);
  const isSelected = selectedNodeId === block.id;`;

if (content.includes(searchContext)) {
  content = content.replace(searchContext, replaceContext);
}

const searchParagraph = `        return (
          <p className={pClass}>
            {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );`;

const replaceParagraph = `        const style: React.CSSProperties = {};
        if (profile.paragraphSpacing && !block.id.startsWith('gsls-signature')) {
          style.marginBottom = \`\${profile.paragraphSpacing}pt\`;
        }
        return (
          <p className={pClass} style={style}>
            {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );`;

if (content.includes(searchParagraph)) {
  content = content.replace(searchParagraph, replaceParagraph);
}

const searchImage = `      case 'IMAGE':
        if (isCover) {
          return (
            <img src={(block as ImageBlock).url} alt={(block as ImageBlock).altText} className="w-48 h-auto object-contain" />
          );
        }`;

const replaceImage = `      case 'IMAGE':
        if (isCover) {
          return (
            <img src={(block as ImageBlock).url} alt={(block as ImageBlock).altText} className="w-48 h-auto object-contain" style={{ transform: \`scale(\${profile.coverLogoScale || 1})\` }} />
          );
        }`;

if (content.includes(searchImage)) {
  content = content.replace(searchImage, replaceImage);
}

const searchGrid = `        if (block.id.startsWith('gsls-signature-grid')) {
           return (
              <div className="gsls-signature-grid print-no-break">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}
              </div>
           );
        }`;

const replaceGrid = `        if (block.id.startsWith('gsls-signature-grid')) {
           return (
              <div className="gsls-signature-grid print-no-break" style={profile.approvalColumnGap ? { columnGap: \`\${profile.approvalColumnGap}cm\` } : undefined}>
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}
              </div>
           );
        }`;

if (content.includes(searchGrid)) {
  content = content.replace(searchGrid, replaceGrid);
}

const searchSigSpace = `<div className="gsls-signature-space"></div>`;
const replaceSigSpace = `<div className="gsls-signature-space" style={profile.approvalSignatureHeight ? { height: \`\${profile.approvalSignatureHeight}cm\` } : undefined}></div>`;

if (content.includes(searchSigSpace)) {
  content = content.replace(searchSigSpace, replaceSigSpace);
}

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
console.log('patched block renderer');
