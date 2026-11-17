const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Remove DokumenAdministrasiView component entirely
code = code.replace(/const DokumenAdministrasiView = \(\) => \{[\s\S]*?\n\};\n/g, '');

// Remove calls to it
code = code.replace(/\{currentView === "dokumenAdministrasi" && \(\n\s*<DokumenAdministrasiView \/>\n\s*\)\}/g, '');

// Clean up references in arrays/menus
code = code.replace(/, "dokumenAdministrasi"/g, '');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("DokumenAdministrasiView removed");
