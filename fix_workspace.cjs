const fs = require('fs');

const file = 'src/enterprise/workspace/preview/KspPreviewWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/document\.getElementById\('print-guard'\)/g, "window.document.getElementById('print-guard')");
fs.writeFileSync(file, content);
