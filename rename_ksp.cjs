const fs = require('fs');
const kspFile = 'src/ksp/mock/KSPPlaceholderDocument.ts';
if (fs.existsSync(kspFile)) {
    let content = fs.readFileSync(kspFile, 'utf8');
    content = content.replace(/dummyDocument/g, 'placeholderDocument');
    fs.writeFileSync(kspFile, content);
}
