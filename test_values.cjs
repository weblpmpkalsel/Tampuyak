const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Find all properties in DEFAULT_SETTINGS
let match = file.match(/const DEFAULT_SETTINGS = (\{[\s\S]*?\n  \});\n/);
let settingsStr = match ? match[1] : '';
console.log(settingsStr.substring(0, 1000));
console.log("...");
console.log(settingsStr.substring(1000, 2000));
