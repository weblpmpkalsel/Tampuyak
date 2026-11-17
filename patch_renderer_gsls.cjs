const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

// Replace the old signature logic

const searchOldContainer = `        // Check if this is the signature container
        if (block.id === 'approval-container-school-signatures' || block.id === 'approval-container-bottom-signatures') {
           return (
              <div className="gdds-signature-grid print-no-break">
                {(block as ContainerBlock).blocks.map(b => (
                  <div key={b.id} className="gdds-signature-cell gdds-signature-center">
                    <BlockRenderer block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  </div>
                ))}
              </div>
           );
        }`;

const replaceGslsContainer = `        // GSLS Signature Grid
        if (block.id.startsWith('gsls-signature-grid')) {
           return (
              <div className="gsls-signature-grid print-no-break">
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}
              </div>
           );
        }

        // GSLS Individual Signature Block
        if (block.id.startsWith('gsls-signature-block')) {
           // If it's preface, it's typically right-aligned (margin-left: auto), if it's grid, it's already in grid cell
           const isPreface = block.id.includes('preface');
           return (
              <div className={\`gsls-signature-cell \${isPreface ? 'right' : 'center'} print-no-break mb-8\`}>
                {(block as ContainerBlock).blocks.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}
              </div>
           );
        }`;

if (content.includes(searchOldContainer)) {
  content = content.replace(searchOldContainer, replaceGslsContainer);
} else {
  console.log('could not find old signature container code');
}

// Now replace paragraph logic
const searchOldParagraph = `        let pClass = isCover || isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';
        // For approval, left align mostly except when centered
        if (isApproval) pClass = 'gdds-p-no-indent';
        if (isApproval && block.id.includes('-name')) pClass += ' font-bold underline mt-24';
        if (isApproval && block.id.includes('signature-space')) return null;

        return (
          <p className={pClass}>
            {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );`;

const replaceGslsParagraph = `        let pClass = isCover || isApproval ? 'gdds-p-no-indent text-center' : 'gdds-p';
        if (isApproval) pClass = 'gdds-p-no-indent text-center';

        // GSLS Paragraph overrides
        if (block.id.startsWith('gsls-signature')) {
          pClass = 'gdds-p-no-indent'; // Reset to no-indent for signature contents
          
          if (block.id.includes('-name')) {
            pClass += ' gsls-signature-name';
            // Insert the signature space BEFORE the name
            return (
              <>
                <div className="gsls-signature-space"></div>
                <p className={pClass}>
                  {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
                </p>
              </>
            );
          }
        }

        return (
          <p className={pClass}>
            {(block as ParagraphBlock).nodes.map(n => <NodeRenderer key={n.id} node={n} />)}
          </p>
        );`;

if (content.includes(searchOldParagraph)) {
  content = content.replace(searchOldParagraph, replaceGslsParagraph);
} else {
  console.log('could not find old paragraph code');
}

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
console.log('patched renderer');
