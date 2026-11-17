
  let settings = {
    school: { name: "SDN 1", npsn: "12345678", address: "Jl. Merdeka" },
    principal: { name: "Budi", nip: "19800101" },
    komite: { name: "Andi" },
    pengawas: { name: "Siti" },
    kepalaDinas: { name: "Agus" }
  };
  
  const TemplateTokenEngine = {
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

    const rendered = content.replace(/\{\{([^}]+)\}\}/g, (match, tokenName) => {
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
};


  
  TemplateTokenEngine.generateAuditReport(settings);
  
  // Unit Test 1: Single Pass
  const text1 = "Nama: {{school.name}}, NPSN: {{school.npsn}}";
  console.log("Test 1:", TemplateTokenEngine.render(text1, settings));
  
  // Unit Test 2: Unknown Token
  const text2 = "Unknown: {{unknown.token}}";
  console.log("Test 2:", TemplateTokenEngine.render(text2, settings));
  
  // Unit Test 3: Recursive / Circular Token
  settings.school.name = "{{school.name}}"; // Circular
  const text3 = "Circular: {{school.name}}";
  console.log("Test 3 (Circular):", TemplateTokenEngine.render(text3, settings));
  
  // Unit Test 4: Hundreds of Tokens
  let manyTokens = "";
  for (let i = 0; i < 500; i++) {
    manyTokens += "{{school.npsn}} ";
  }
  const text4 = TemplateTokenEngine.render(manyTokens, settings);
  console.log("Test 4 (Many tokens) length:", text4.length);
