const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

let regex = /  const \[syncStatus, setSyncStatus\] = useState<\n    "synced" \| "needs_sync" \| "syncing"\n  >\("needs_sync"\);\n  const \[programs, setPrograms\] = useState\(\[\n    {\n      id: 1,\n      rktActivity: "Pelatihan Guru Matematika Terapan",[\s\S]*?origin: "RKT Bab IV, Program 3.2",\n    },\n  \]\);\n/g;

let matches = code.match(regex);
console.log("Found matches: ", matches ? matches.length : 0);

if (matches && matches.length > 1) {
  // Keep the first one, remove the others
  let firstIdx = code.indexOf(matches[0]);
  let before = code.substring(0, firstIdx + matches[0].length);
  let after = code.substring(firstIdx + matches[0].length);
  
  after = after.replace(regex, "");
  code = before + after;
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Fixed duplicates!");
}
