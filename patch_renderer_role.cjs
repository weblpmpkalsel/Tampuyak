const fs = require('fs');
let content = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

const searchContainer = `{beforeIdentity.map(b => (
                  <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                ))}`;

const replaceContainer = `<div className="gsls-role-block">
                  {beforeIdentity.map(b => (
                    <BlockRenderer key={b.id} block={b} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} isCover={isCover} isTOC={isTOC} isApproval={isApproval} />
                  ))}
                </div>`;

if (content.includes(searchContainer)) {
  content = content.replace(searchContainer, replaceContainer);
  fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', content);
  console.log('patched renderer');
} else {
  console.log('renderer search not found');
}
