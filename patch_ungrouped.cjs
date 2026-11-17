const fs = require('fs');

let rkasGenCode = fs.readFileSync('src/rkas/generator/RkasGenerator.ts', 'utf-8');
rkasGenCode = rkasGenCode.replace(/'UNGROUPED_PROGRAM'/g, "'-'");
fs.writeFileSync('src/rkas/generator/RkasGenerator.ts', rkasGenCode);

let genRulesCode = fs.readFileSync('src/generation/GenerationRules.ts', 'utf-8');
genRulesCode = genRulesCode.replace(/'Ungrouped Program'/g, "'-'");
fs.writeFileSync('src/generation/GenerationRules.ts', genRulesCode);
console.log("Ungrouped patched!");
