const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

let hookRegex = /  const \[syncStatus, setSyncStatus\] = useState<\n    "synced" \| "needs_sync" \| "syncing"\n  >\("needs_sync"\);\n  const \[programs, setPrograms\] = useState\(\[\n    {\n      id: 1,\n      rktActivity: "Pelatihan Guru Matematika Terapan",[\s\S]*?origin: "RKT Bab II, Program Numerasi",\n    },\n    {\n      id: 2,\n      rktActivity: "Langganan Platform Belajar Digital",[\s\S]*?origin: "RKT Bab II, Program Literasi",\n    },\n  \]\);\n/g;

let matches = code.match(hookRegex);
console.log("Hook matches: ", matches ? matches.length : 0);

if (matches && matches.length > 0) {
  let hookStr = matches[0];
  code = code.replace(hookStr, "");
  
  let insertRegex = /(const RKASDerivationView = \(\{ navigateToView \}: any\) => \{\n  const \{ settings, showSuccess \} = useApp\(\);\n)/;
  code = code.replace(insertRegex, "$1" + hookStr);
}

// now remove hasRKT block
let hasRKTRegex = /  const currentYear = settings\.academicYear \|\| "2024\/2025";\n  const docs = settings\.documents \|\| \[\];\n  const hasRKT = docs\.some\(\n    \(d: any\) =>\n      d\.type === "RKT" &&\n      \["Disetujui", "Terkunci", "Siap Dicetak", "Selesai", "Final"\]\.includes\(\n        d\.status,\n      \),\n  \);\n\n  if \(!hasRKT\) \{\n    return \(\n      <div className="flex flex-col items-center justify-center p-12 text-center h-\[60vh\] animate-in fade-in zoom-in-95 duration-500">\n        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-200">\n          <FolderOpen className="w-10 h-10" \/>\n        <\/div>\n        <h2 className="text-2xl font-black text-slate-800 mb-3">\n          Langkah ini belum dapat dilakukan.\n        <\/h2>\n        <p className="text-slate-600 mb-8 max-w-md leading-relaxed">\n          Silakan selesaikan penyusunan RKT dan setujui terlebih dahulu agar\n          RKAS dapat disusun secara akurat berdasarkan program tahunan.\n        <\/p>\n        <Button\n          onClick=\{\(\) => navigateToView && navigateToView\("rktDerivation"\)\}\n          className="bg-indigo-600 hover:bg-indigo-700"\n        >\n          Buka RKT\n        <\/Button>\n      <\/div>\n    \);\n  \}\n/g;

code = code.replace(hasRKTRegex, "");

fs.writeFileSync('src/Tampuyak.tsx', code);
