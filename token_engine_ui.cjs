const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  /<div className="whitespace-pre-wrap">{block\.content}<\/div>/g,
  '<div className="whitespace-pre-wrap">{TemplateTokenEngine.render(block.content, settings)}</div>'
);
code = code.replace(
  /<p className="text-sm whitespace-pre-wrap">{block\.content}<\/p>/g,
  '<p className="text-sm whitespace-pre-wrap">{TemplateTokenEngine.render(block.content, settings)}</p>'
);
code = code.replace(
  /defaultValue={block\.content}/g,
  'defaultValue={TemplateTokenEngine.render(block.content, settings)}'
);

// We should also replace the preview in PrintDiagnosticView/DocumentWorkspaceView
code = code.replace(
  /\{settings\.school\?\.name \|\| "NAMA SEKOLAH"\}/g,
  '{TemplateTokenEngine.render("{{school.name}}", settings)}'
);
code = code.replace(
  /\{settings\.school\?\.npsn \|\| "-"\}/g,
  '{TemplateTokenEngine.render("{{school.npsn}}", settings)}'
);
code = code.replace(
  /\{settings\.principal\?\.name \|\| "Belum diatur"\}/g,
  '{TemplateTokenEngine.render("{{master.principal.name}}", settings)}'
);
code = code.replace(
  /\{settings\.principal\?\.nip \|\| "-"\}/g,
  '{TemplateTokenEngine.render("{{master.principal.nip}}", settings)}'
);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Template rendering added");
