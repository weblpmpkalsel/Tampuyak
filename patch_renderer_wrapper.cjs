const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const searchContainer = `<div className="gsls-role-block">
                  {beforeIdentity.map(b => (
                    <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  ))}
                </div>
                <div className="gsls-signature-space"></div>
                <div className="gsls-identity-block">
                  {identity.map(b => (
                    <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  ))}
                </div>`;

const replaceContainer = `<div className="gsls-signature-content">
                  <div className="gsls-role-block">
                    {beforeIdentity.map(b => (
                      <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                    ))}
                  </div>
                  <div className="gsls-signature-space"></div>
                  <div className="gsls-identity-block">
                    {identity.map(b => (
                      <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                    ))}
                  </div>
                </div>`;

if (content.includes(searchContainer)) {
  content = content.replace(searchContainer, replaceContainer);
  fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
  console.log('patched renderer');
} else {
  console.log('renderer search not found');
}
