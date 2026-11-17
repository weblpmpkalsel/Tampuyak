const fs = require('fs');
let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf-8').split('\\n');

// Find RKTDerivationView
let idx = lines.findIndex(l => l.includes('const RKTDerivationView ='));
// find where we put the state
let insertIdx = idx + 2;

const stateStr = \`  const [syncStatus, setSyncStatus] = useState<
    "synced" | "needs_sync" | "syncing"
  >("needs_sync");
  const [programs, setPrograms] = useState([
    {
      id: 1,
      rkjmProgram: "Peningkatan Kemampuan Numerasi",
      target: "65 (Tahun 1)",
      kegiatan: "Pelatihan Guru Metode GASING",
      biaya: 15000000,
    },
    {
      id: 2,
      rkjmProgram: "Digitalisasi Pembelajaran",
      target: "30% Kelas (Tahun 1)",
      kegiatan: "Pengadaan Smart Board Kelas 7",
      biaya: 45000000,
    },
    {
      id: 3,
      rkjmProgram: "Penguatan Karakter",
      target: "Minimal 80% Baik",
      kegiatan: "Workshop Anti Perundungan & Deklarasi",
      biaya: 5000000,
    },
  ]);\`;

lines.splice(insertIdx, 0, stateStr);

// now remove the old state
let hasRKJMIdx = lines.findIndex(l => l.includes('const hasRKJM = docs.some('));
// the old state is right below it? No, wait, in 12158 it was after `const hasRKJM = ...`
let oldStateStart = hasRKJMIdx + 8; // approx
// let's just find "const [syncStatus, setSyncStatus] = useState<" after idx
let syncIdx = lines.findIndex((l, i) => i > insertIdx + 30 && l.includes('const [syncStatus, setSyncStatus]'));
if (syncIdx !== -1) {
  lines.splice(syncIdx, 26);
}

fs.writeFileSync('src/Tampuyak.tsx', lines.join('\\n'));
