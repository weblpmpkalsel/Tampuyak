const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/adapters/AdministrativeMetadataAdapter.ts', 'utf8');

code = code.replace(
  `      komite: {
        ...(adminMetadata.committeeName && { name: adminMetadata.committeeName })
      }`,
  `      komite: {
        ...(adminMetadata.committeeName && { name: adminMetadata.committeeName })
      },
      principal: {
        ...(adminMetadata.principalName && { name: adminMetadata.principalName }),
        ...(adminMetadata.principalNip && { nip: adminMetadata.principalNip })
      }`
);

fs.writeFileSync('src/enterprise/workspace/adapters/AdministrativeMetadataAdapter.ts', code);
console.log("Patched AdministrativeMetadataAdapter");
