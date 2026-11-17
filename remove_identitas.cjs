const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexIdentitas = /Identitas: \(\{ data, update \}: any\) => \{[\s\S]*?<\/Card>\s*<\/div>\s*\);\s*\},/;
code = code.replace(regexIdentitas, '');

const regexCaseIdentitas = /      case "identitas":\s*return \(\s*<SettingsTabs\.Identitas[\s\S]*?\/>\s*\);\s*/;
code = code.replace(regexCaseIdentitas, '');

// Also remove `Data Pendukung (BOS)` from tabs
const regexCaseBudget = /      case "budget":\s*return \(\s*<SettingsTabs\.Budget[\s\S]*?\/>\s*\);\s*/;
code = code.replace(regexCaseBudget, '');

const regexBudget = /Budget: \(\{ data, update \}: any\) => \{[\s\S]*?<\/Card>\s*<\/div>\s*\);\s*\},/;
code = code.replace(regexBudget, '');


fs.writeFileSync('src/Tampuyak.tsx', code);
