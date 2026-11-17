const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

let hookRegex = /  const \[syncStatus, setSyncStatus\] = useState<\n    "synced" \| "needs_sync" \| "syncing"\n  >\("needs_sync"\);\n  const \[programs, setPrograms\] = useState\(\[\n    {\n      id: 1,\n      rktActivity: "Pelatihan Guru Matematika Terapan",[\s\S]*?origin: "RKT Bab IV, Program 3.2",\n    },\n  \]\);\n/g;

let matches = code.match(hookRegex);
console.log("Found matches: ", matches ? matches.length : 0);

if (matches && matches.length > 0) {
  let hookStr = matches[0];
  code = code.replace(hookStr, "");
  let insertRegex = /(const RKASDerivationView = \(\{ navigateToView \}: any\) => \{\n  const \{ settings, showSuccess \} = useApp\(\);\n)/;
  code = code.replace(insertRegex, "$1" + hookStr);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Moved successfully!");
}
