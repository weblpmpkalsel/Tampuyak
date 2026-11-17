const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Fix TemplateTokenEngine
code = code.replace(
  'settings.komite?.ketua',
  'settings.komite?.name'
);
code = code.replace(
  'settings.pengawas?.nama',
  'settings.pengawas?.name'
);

// Replace hardcoded committee and others in docs to use Engine
code = code.replace(
  /settings\.komite\?\.name \|\| "Belum diatur"/g,
  'TemplateTokenEngine.render("{{master.committee.name}}", settings)'
);
code = code.replace(
  /settings\.school\?\.name \|\| "Nama Sekolah"/g,
  'TemplateTokenEngine.render("{{school.name}}", settings)'
);
// Make sure we didn't break things like the template strings in the UI input, but those usually don't have " || 'Nama Sekolah'".
// Let's only replace in the printable documents where they are hardcoded.

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Tokens updated");
