const fs = require('fs');
let file = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

file = file.replace(
  /className="gdds-toc-row" style=\{\{ marginLeft \}\}/,
  'className="gdds-toc-layout" style={{ marginLeft }}'
);
file = file.replace(
  /className=\{\`\$\{fontWeight\} flex-shrink-0\`\}/,
  'className={`gdds-toc-title ${fontWeight}`}'
);
file = file.replace(
  /className="gdds-toc-dots"/,
  'className="gdds-toc-leader"'
);
file = file.replace(
  /<span className=\{\`\$\{fontWeight\}\`\}><\/span>/,
  '<span className={`gdds-toc-page ${fontWeight}`}></span>'
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', file);
