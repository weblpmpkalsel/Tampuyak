const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/Tampuyak.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '"kspStudio_attachments", "documentEditor"',
  '"kspStudio_attachments", "kspStudio_settings", "documentEditor"'
);

fs.writeFileSync(file, content);
console.log("Patched Tampuyak.tsx includes");
