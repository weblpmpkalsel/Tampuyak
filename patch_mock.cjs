const fs = require('fs');
let adapter = fs.readFileSync('src/ksp/KspMetadataAdapter.ts', 'utf-8');
// It doesn't actually depend on firebase if we don't import the parts that use it. Wait, does it?
