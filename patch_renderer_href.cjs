const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

code = code.replace(
  /<a id=\{node\.id\} href=\{node\.url\}/,
  `<a id={node.id} href={'#' + node.url}`
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', code);
console.log("Patched CanonicalRenderer href");
