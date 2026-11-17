const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importStr = `import { KspPreviewWorkspace } from "./enterprise/workspace/preview/KspPreviewWorkspace";\nimport { KSPValidationPanel } from "./ksp/KSPValidationPanel";\nimport { KSPAttachmentPanel } from "./ksp/KSPAttachmentPanel";\n`;
if (!code.includes("import { KspPreviewWorkspace }")) {
    code = importStr + code;
    fs.writeFileSync('src/Tampuyak.tsx', code);
    console.log("Added imports");
}
