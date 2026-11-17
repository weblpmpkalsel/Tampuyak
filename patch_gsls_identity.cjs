const fs = require('fs');

let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const searchContainer = `        // GSLS Individual Signature Block
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

const replaceContainer = `        // GSLS Individual Signature Block
        if (block.id.startsWith('gsls-signature-block')) {
           const isPreface = block.id.includes('preface');
           
           const beforeIdentity = [];
           const identity = [];
           
           (block as ContainerBlock).blocks.forEach(b => {
             // Treat printed name and NIP as the identity block component
             if (b.id.includes('-name') || b.id.includes('-nip')) {
               identity.push(b);
             } else {
               beforeIdentity.push(b);
             }
           });

           return (
              <div className={\`gsls-signature-cell \${isPreface ? 'right' : 'center'} print-no-break mb-8\`}>
                {beforeIdentity.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}
                <div className="gsls-signature-space"></div>
                <div className="gsls-identity-block">
                  {identity.map(b => (
                    <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  ))}
                </div>
              </div>
           );
        }`;

if (content.includes(searchContainer)) {
  content = content.replace(searchContainer, replaceContainer);
  console.log('patched container');
} else {
  console.log('container search not found');
}

const searchParagraph = `        // GSLS Paragraph overrides
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
        }`;

const replaceParagraph = `        // GSLS Paragraph overrides
        if (block.id.startsWith('gsls-signature')) {
          pClass = 'gdds-p-no-indent'; // Reset to no-indent for signature contents
          
          if (block.id.includes('-name')) {
            pClass += ' gsls-signature-name';
          }
        }`;

if (content.includes(searchParagraph)) {
  content = content.replace(searchParagraph, replaceParagraph);
  console.log('patched paragraph');
} else {
  console.log('paragraph search not found');
}

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);

// Now patch CSS
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const searchCSS = `.gsls-signature-space {
    height: 3.5cm; /* Target spacing 4-5cm total including title/name margins */
    width: 100%;
  }
  .gsls-signature-name {`;

const replaceCSS = `.gsls-signature-space {
    height: 3.5cm; /* Target spacing 4-5cm total including title/name margins */
    width: 100%;
  }
  .gsls-identity-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Ensure name and nip align to same left edge */
    text-align: left;
    width: fit-content;      /* Wrapper shrinks to content so entire block can be centered */
  }
  .gsls-signature-name {`;

if (cssContent.includes(searchCSS)) {
  cssContent = cssContent.replace(searchCSS, replaceCSS);
  console.log('patched css');
} else {
  console.log('css search not found');
}

fs.writeFileSync('src/index.css', cssContent);

