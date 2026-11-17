const fs = require('fs');
let adapter = fs.readFileSync('src/ksp/KspMetadataAdapter.ts', 'utf-8');
// remove firebase usage if any
