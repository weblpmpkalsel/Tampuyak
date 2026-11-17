const fs = require('fs');

// We need to extract the TemplateTokenEngine code or just require it if we could, 
// but since it's embedded in Tampuyak.tsx, we can mock it here for the unit test,
// or we can parse it from Tampuyak.tsx. Let's extract it.

const code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
const startIndex = code.indexOf('const TemplateTokenEngine = {');
const endIndex = code.indexOf('const DocumentEditorEngine = {');

const engineCode = code.substring(startIndex, endIndex);

// Using eval to get the object
const script = `
  let settings = {
    school: { name: "SDN 1", npsn: "12345678", address: "Jl. Merdeka" },
    principal: { name: "Budi", nip: "19800101" },
    komite: { name: "Andi" },
    pengawas: { name: "Siti" },
    kepalaDinas: { name: "Agus" }
  };
  
  ${engineCode}
  
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
`;

fs.writeFileSync('test_token_engine.cjs', script);
