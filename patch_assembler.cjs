const fs = require('fs');
let file = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

file = file.replace(
`    profile: {
      schoolName: metadata.schoolName,
      schoolStatus: metadata.schoolStatus,
      village: metadata.village,
      district: metadata.district,
      city: metadata.regencyOrCity,
      province: metadata.province
    } as any,`,
`    profile: {
      schoolName: metadata.schoolName,
      schoolLevel: metadata.schoolLevel,
      schoolStatus: metadata.schoolStatus,
      village: metadata.village,
      district: metadata.district,
      city: metadata.regencyOrCity,
      province: metadata.province
    } as any,`
);

fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', file);
