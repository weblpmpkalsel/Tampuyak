const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// remove all syncStatus states
let regex = /  const \[syncStatus, setSyncStatus\] = useState<\s*"synced" \| "needs_sync" \| "syncing"\s*>\("needs_sync"\);\s*const \[programs, setPrograms\] = useState\(\[\s*\{\s*id: 1,[\s\S]*?origin: "RKJM Bab III, Strategi 3.3",\s*\},\s*\]\);\n/g;
let matches = code.match(regex);
console.log("Found matches: ", matches ? matches.length : 0);
code = code.replace(regex, "");

let regex2 = /  const \[syncStatus, setSyncStatus\] = useState<\s*"synced" \| "needs_sync" \| "syncing"\s*>\("needs_sync"\);\s*const \[programs, setPrograms\] = useState\(\[\s*\{\s*id: 1,[\s\S]*?biaya: 5000000,\s*\},\s*\]\);\n/g;
let matches2 = code.match(regex2);
console.log("Found matches2: ", matches2 ? matches2.length : 0);
code = code.replace(regex2, "");

let insertRegex = /(const RKTDerivationView = \(\{ navigateToView \}: any\) => \{\n  const \{ settings, showSuccess \} = useApp\(\);\n)/;

let replacement = "$1" + 
"  const [syncStatus, setSyncStatus] = useState<" + "\\n" +
'    "synced" | "needs_sync" | "syncing"' + "\\n" +
'  >("needs_sync");' + "\\n" +
"  const [programs, setPrograms] = useState([" + "\\n" +
"    {" + "\\n" +
"      id: 1," + "\\n" +
'      rkjmProgram: "Peningkatan Kemampuan Numerasi",' + "\\n" +
'      target: "65 (Tahun 1)",' + "\\n" +
"      activities: [" + "\\n" +
'        "Pelatihan Guru Matematika Terapan",' + "\\n" +
'        "Pengadaan Alat Peraga Numerasi",' + "\\n" +
'        "Bimbingan Belajar Tambahan",' + "\\n" +
"      ]," + "\\n" +
'      status: "synced",' + "\\n" +
'      origin: "RKJM Bab III, Strategi 1.2",' + "\\n" +
"    }," + "\\n" +
"    {" + "\\n" +
"      id: 2," + "\\n" +
'      rkjmProgram: "Digitalisasi Pembelajaran",' + "\\n" +
'      target: "80% Ruang Kelas (Tahun 1)",' + "\\n" +
"      activities: [" + "\\n" +
'        "Instalasi Proyektor Interaktif",' + "\\n" +
'        "Langganan Platform Belajar Digital",' + "\\n" +
"      ]," + "\\n" +
'      status: "changed",' + "\\n" +
'      origin: "RKJM Bab III, Strategi 2.1",' + "\\n" +
"    }," + "\\n" +
"    {" + "\\n" +
"      id: 3," + "\\n" +
'      rkjmProgram: "Pembinaan Karakter & Profil Pelajar Pancasila",' + "\\n" +
'      target: "90% Keikutsertaan (Tahun 1)",' + "\\n" +
"      activities: [" + "\\n" +
'        "Kegiatan Ekstrakurikuler Wajib",' + "\\n" +
'        "Perkemahan Sabtu Minggu (Persami)",' + "\\n" +
"      ]," + "\\n" +
'      status: "new",' + "\\n" +
'      origin: "RKJM Bab III, Strategi 3.3",' + "\\n" +
"    }," + "\\n" +
"  ]);" + "\\n";

code = code.replace(insertRegex, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
