const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const engineCode = `
const TemplateTokenEngine = {
  render: (content: string, settings: any) => {
    if (!content || typeof content !== 'string') return content;
    let rendered = content;
    
    // School
    rendered = rendered.replace(/\\{\\{school\\.name\\}\\}/g, settings.school?.name || "NAMA SEKOLAH");
    rendered = rendered.replace(/\\{\\{school\\.npsn\\}\\}/g, settings.school?.npsn || "-");
    rendered = rendered.replace(/\\{\\{school\\.address\\}\\}/g, settings.school?.address || "-");
    
    // Master
    rendered = rendered.replace(/\\{\\{master\\.principal\\.name\\}\\}/g, settings.principal?.name || "Belum diatur");
    rendered = rendered.replace(/\\{\\{master\\.principal\\.nip\\}\\}/g, settings.principal?.nip || "-");
    rendered = rendered.replace(/\\{\\{master\\.committee\\.name\\}\\}/g, settings.komite?.ketua || "Belum diatur");
    rendered = rendered.replace(/\\{\\{master\\.supervisor\\.name\\}\\}/g, settings.pengawas?.nama || "Belum diatur");
    rendered = rendered.replace(/\\{\\{master\\.educationOffice\\.name\\}\\}/g, settings.kepalaDinas?.name || "Belum diatur");
    
    return rendered;
  }
};
`;

if (!code.includes('TemplateTokenEngine')) {
  code = code.replace('const DocumentEditorEngine = {', engineCode + '\nconst DocumentEditorEngine = {');
}

// In DocumentEditorView dummy block
code = code.replace(
  /\`Nama Sekolah: \${settings\.school\?\.name \|\| "SDN Contoh Terpadu"}\\nNPSN: \${settings\.school\?\.npsn \|\| "12345678"}\`/,
  '"Nama Sekolah: {{school.name}}\\nNPSN: {{school.npsn}}"'
);

// We should use TemplateTokenEngine.render on the blocks during render
code = code.replace(
  /<p className="text-sm whitespace-pre-wrap">{block\.content}<\/p>/g,
  '<p className="text-sm whitespace-pre-wrap">{TemplateTokenEngine.render(block.content, settings)}</p>'
);

code = code.replace(
  /<div className="whitespace-pre-wrap">{block\.content}<\/div>/g,
  '<div className="whitespace-pre-wrap">{TemplateTokenEngine.render(block.content, settings)}</div>'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("TemplateTokenEngine added");
