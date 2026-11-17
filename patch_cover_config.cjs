const fs = require('fs');

let content = fs.readFileSync('src/enterprise/document/ksp/cover/KspCoverConfiguration.ts', 'utf8');

content = content.replace(
`  readonly province: string;`,
`  readonly province: string;
  readonly educationAuthorityRegion: string;`
);

fs.writeFileSync('src/enterprise/document/ksp/cover/KspCoverConfiguration.ts', content);
console.log('patched config');
