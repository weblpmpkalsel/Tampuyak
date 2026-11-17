const fs = require('fs');

function fixFile(path) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/window\.isAppPrinting = true; window\.print\(\); setTimeout\(\(\) => \{ window\.isAppPrinting = false; \}, 500\);/g, "(() => { const guard = document.getElementById('print-guard'); if (guard) guard.style.setProperty('display', 'none', 'important'); window.print(); setTimeout(() => { if (guard) guard.style.removeProperty('display'); }, 500); })()");
  fs.writeFileSync(path, code);
}

fixFile('src/workspace/WorkspaceToolbar.tsx');
fixFile('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx');
console.log('Done');
