const fs = require('fs');

let content = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

// The line is `const coverSection = buildKspCoverSection(metadata as any);`
// We need to change it to use the new object after the educationAuthorityRegion computation.

// It's located at the top. Let's move the computation up.

const searchString = `export function assembleKspDocument(metadata: KspMetadata): CanonicalDocument {
  const coverSection = buildKspCoverSection(metadata as any);
  
  // Rule 001: Determine Authority Region based on School Level
  // PAUD, SD, SMP -> Regency/City (Dinas Pendidikan Kabupaten/Kota)
  // SMA, SMK, SLB -> Province (Dinas Pendidikan Provinsi)
  const isProvincialAuthority = ['SMA', 'SMK', 'SLB'].includes(metadata.schoolLevel);
  const educationAuthorityRegion = isProvincialAuthority ? metadata.province : metadata.regencyOrCity;

  const approvalSection = buildKspApprovalSection({
    ...metadata,
    educationAuthorityRegion
  } as any);`;

const replaceString = `export function assembleKspDocument(metadata: KspMetadata): CanonicalDocument {
  // Rule 001: Determine Authority Region based on School Level
  // PAUD, SD, SMP -> Regency/City (Dinas Pendidikan Kabupaten/Kota)
  // SMA, SMK, SLB -> Province (Dinas Pendidikan Provinsi)
  const isProvincialAuthority = ['SMA', 'SMK', 'SLB'].includes(metadata.schoolLevel);
  const educationAuthorityRegion = isProvincialAuthority ? metadata.province : metadata.regencyOrCity;

  const coverSection = buildKspCoverSection({
    ...metadata,
    educationAuthorityRegion
  } as any);
  
  const approvalSection = buildKspApprovalSection({
    ...metadata,
    educationAuthorityRegion
  } as any);`;

if(content.includes(searchString)) {
  content = content.replace(searchString, replaceString);
  fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', content);
  console.log('patched assembler');
} else {
  console.log('search string not found');
}
