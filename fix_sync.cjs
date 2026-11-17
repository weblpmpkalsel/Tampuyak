const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  /if \(!settings\?\.diagnosis\?\.isLocked\) \{/g,
  'if (!settings?.decisionEngine || settings?.decisionEngine?.status !== "Disetujui") {'
);

code = code.replace(
  '{ id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.diagnosis?.isLocked },',
  '{ id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.decisionEngine?.status === "Disetujui" },'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Fixed");
