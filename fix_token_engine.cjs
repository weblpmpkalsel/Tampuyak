const fs = require('fs');

const oldCode = `const TemplateTokenEngine = {
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
    rendered = rendered.replace(/\\{\\{master\\.committee\\.name\\}\\}/g, settings.komite?.name || "Belum diatur");
    rendered = rendered.replace(/\\{\\{master\\.supervisor\\.name\\}\\}/g, settings.pengawas?.name || "Belum diatur");
    rendered = rendered.replace(/\\{\\{master\\.educationOffice\\.name\\}\\}/g, settings.kepalaDinas?.name || "Belum diatur");
    
    return rendered;
  }
};`;

const newCode = `const TemplateTokenEngine = {
  MAX_DEPTH: 5,
  
  getTokens: (settings: any): Record<string, string> => ({
    "school.name": settings.school?.name || "NAMA SEKOLAH",
    "school.npsn": settings.school?.npsn || "-",
    "school.address": settings.school?.address || "-",
    "master.principal.name": settings.principal?.name || "Belum diatur",
    "master.principal.nip": settings.principal?.nip || "-",
    "master.committee.name": settings.komite?.name || "Belum diatur",
    "master.supervisor.name": settings.pengawas?.name || "Belum diatur",
    "master.educationOffice.name": settings.kepalaDinas?.name || "Belum diatur",
  }),

  render: (content: string, settings: any, depth = 0): string => {
    if (!content || typeof content !== "string") return content;
    if (depth >= TemplateTokenEngine.MAX_DEPTH) return content; // Recursion limit protection

    const dictionary = TemplateTokenEngine.getTokens(settings);
    let requiresAnotherPass = false;

    const rendered = content.replace(/\\{\\{([^}]+)\\}\\}/g, (match, tokenName) => {
      const key = tokenName.trim();
      if (dictionary[key] !== undefined) {
        const val = dictionary[key];
        if (typeof val === "string" && val.includes("{{") && val.includes("}}")) {
          requiresAnotherPass = true; // Circular reference / nested token detection
        }
        return val;
      }
      return "[Token tidak dikenal]"; // Fallback for unknown tokens
    });

    if (requiresAnotherPass && depth < TemplateTokenEngine.MAX_DEPTH - 1) {
      return TemplateTokenEngine.render(rendered, settings, depth + 1);
    }
    
    return rendered;
  },
  
  generateAuditReport: (settings: any) => {
    const tokens = Object.keys(TemplateTokenEngine.getTokens(settings));
    console.log("=== TOKEN COVERAGE REPORT ===");
    console.log("Supported Tokens:", tokens.length);
    tokens.forEach(t => console.log("- " + t));
    return tokens;
  }
};`;

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
code = code.replace(oldCode, newCode);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed TemplateTokenEngine');
