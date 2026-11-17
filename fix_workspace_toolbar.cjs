const fs = require('fs');

function fixFile(path) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/window\.print\(\)/g, "window.isAppPrinting = true; window.print(); setTimeout(() => { window.isAppPrinting = false; }, 500);");
  fs.writeFileSync(path, code);
}

fixFile('src/workspace/WorkspaceToolbar.tsx');
fixFile('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx');
console.log('Done');
