const fs = require('fs');
let code = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

const searchStr = `    context: {
      community: { parents: 'heterogen dengan berbagai profesi', industryPartners: ['PT Maju Jaya', 'CV Karya Mandiri'] } as any,
      facilities: { classrooms: 18, library: '1 Ruang Perpustakaan Standard', internet: 'Tersedia 100 Mbps' } as any,
      governance: { accreditationStatus: 'A', accreditationBody: 'BAN-S/M' } as any,
      organization: { principal: EnterpriseConfigurationCenter.principalName, vicePrincipal: 'Bapak Wakil, S.Pd.' } as any
    }`;
    
const replaceStr = `    context: {
      profile: { schoolName: EnterpriseConfigurationCenter.schoolName } as any,
      academicYear: { year: EnterpriseConfigurationCenter.academicYear } as any,
      community: { parents: 'heterogen dengan berbagai profesi', industryPartners: ['PT Maju Jaya', 'CV Karya Mandiri'] } as any,
      facilities: { classrooms: 18, library: '1 Ruang Perpustakaan Standard', internet: 'Tersedia 100 Mbps' } as any,
      governance: { accreditationStatus: 'A', accreditationBody: 'BAN-S/M' } as any,
      organization: { principal: EnterpriseConfigurationCenter.principalName, vicePrincipal: 'Bapak Wakil, S.Pd.' } as any
    }`;

if (code.includes(searchStr)) {
    code = code.replace(searchStr, replaceStr);
    fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', code);
    console.log("Fixed assembler payload");
} else {
    console.log("Could not find payload string");
}
