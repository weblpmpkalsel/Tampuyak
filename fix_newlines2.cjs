const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
let badLine = '  const [syncStatus, setSyncStatus] = useState<\\n    "synced" | "needs_sync" | "syncing"\\n  >("needs_sync");\\n  const [programs, setPrograms] = useState([\\n    {\\n      id: 1,\\n      rkjmProgram: "Peningkatan Kemampuan Numerasi",\\n      target: "65 (Tahun 1)",\\n      activities: [\\n        "Pelatihan Guru Matematika Terapan",\\n        "Pengadaan Alat Peraga Numerasi",\\n        "Bimbingan Belajar Tambahan",\\n      ],\\n      status: "synced",\\n      origin: "RKJM Bab III, Strategi 1.2",\\n    },\\n    {\\n      id: 2,\\n      rkjmProgram: "Digitalisasi Pembelajaran",\\n      target: "80% Ruang Kelas (Tahun 1)",\\n      activities: [\\n        "Instalasi Proyektor Interaktif",\\n        "Langganan Platform Belajar Digital",\\n      ],\\n      status: "changed",\\n      origin: "RKJM Bab III, Strategi 2.1",\\n    },\\n    {\\n      id: 3,\\n      rkjmProgram: "Pembinaan Karakter & Profil Pelajar Pancasila",\\n      target: "90% Keikutsertaan (Tahun 1)",\\n      activities: [\\n        "Kegiatan Ekstrakurikuler Wajib",\\n        "Perkemahan Sabtu Minggu (Persami)",\\n      ],\\n      status: "new",\\n      origin: "RKJM Bab III, Strategi 3.3",\\n    },\\n  ]);\\n  ';

let goodLine = \`  const [syncStatus, setSyncStatus] = useState<
    "synced" | "needs_sync" | "syncing"
  >("needs_sync");
  const [programs, setPrograms] = useState([
    {
      id: 1,
      rkjmProgram: "Peningkatan Kemampuan Numerasi",
      target: "65 (Tahun 1)",
      activities: [
        "Pelatihan Guru Matematika Terapan",
        "Pengadaan Alat Peraga Numerasi",
        "Bimbingan Belajar Tambahan",
      ],
      status: "synced",
      origin: "RKJM Bab III, Strategi 1.2",
    },
    {
      id: 2,
      rkjmProgram: "Digitalisasi Pembelajaran",
      target: "80% Ruang Kelas (Tahun 1)",
      activities: [
        "Instalasi Proyektor Interaktif",
        "Langganan Platform Belajar Digital",
      ],
      status: "changed",
      origin: "RKJM Bab III, Strategi 2.1",
    },
    {
      id: 3,
      rkjmProgram: "Pembinaan Karakter & Profil Pelajar Pancasila",
      target: "90% Keikutsertaan (Tahun 1)",
      activities: [
        "Kegiatan Ekstrakurikuler Wajib",
        "Perkemahan Sabtu Minggu (Persami)",
      ],
      status: "new",
      origin: "RKJM Bab III, Strategi 3.3",
    },
  ]);
\`;

code = code.replace(badLine, goodLine);
fs.writeFileSync('src/Tampuyak.tsx', code);
