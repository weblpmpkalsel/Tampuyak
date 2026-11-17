const fs = require('fs');

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. Fix coverageData objects
const newCoverageData = `  const rkjmDoc = docs.find((d: any) => d.type === "RKJM");
  const rktDoc = docs.find((d: any) => d.type === "RKT");
  const rkasDoc = docs.find((d: any) => d.type === "RKAS");
  const isRktComplete = rktDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rktDoc.status);
  const isRkasComplete = rkasDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rkasDoc.status);
  
  const coverageData = [
    { 
      id: "bab1",
      chapter: "BAB I: Pendahuluan", 
      sources: ["Data Master Sekolah", "Visi Misi"], 
      coverage: (settings.school?.name && settings.school?.npsn) ? 100 : 50,
      missing: (settings.school?.name && settings.school?.npsn) ? [] : [{ dataset: "Identitas Sekolah (Nama/NPSN)", module: "Pengaturan > Identitas Sekolah", link: "settings", action: "Lengkapi data NPSN dan Nama Sekolah pada form Identitas." }],
      status: (settings.school?.name && settings.school?.npsn) ? "Complete" : "Partial"
    },
    { 
      id: "bab2",
      chapter: "BAB II: Analisis Kondisi", 
      sources: ["Rapor Pendidikan", "Analisis Prioritas (SWOT)"], 
      coverage: settings.rapor?.isLocked ? 100 : 0,
      missing: settings.rapor?.isLocked ? [] : [{ dataset: "Data Rapor Pendidikan", module: "Modul Rapor Pendidikan", link: "rapor", action: "Lakukan sinkronisasi data Rapor Pendidikan dan kunci data." }],
      status: settings.rapor?.isLocked ? "Complete" : "Missing"
    },
    {
      id: "bab3",
      chapter: "BAB III: Program Kerja",
      sources: ["Rencana Kerja Tahunan (RKT)", "Modul Perencanaan"],
      coverage: isRktComplete ? 100 : 0,
      missing: isRktComplete ? [] : [{ dataset: "Dokumen RKT Disetujui", module: "Perencanaan > RKT", link: "rktDerivation", action: "Selesaikan dan setujui Rencana Kerja Tahunan." }],
      status: isRktComplete ? "Complete" : "Missing"
    },
    {
      id: "bab4",
      chapter: "BAB IV: Rencana Anggaran",
      sources: ["ARKAS", "Modul Anggaran"],
      coverage: isRkasComplete ? 100 : 0,
      missing: isRkasComplete ? [] : [{ dataset: "Dokumen RKAS Disetujui", module: "Perencanaan > RKAS", link: "rkasDerivation", action: "Selesaikan dan setujui RKAS." }],
      status: isRkasComplete ? "Complete" : "Missing"
    },
    {
      id: "appendix",
      chapter: "LAMPIRAN",
      sources: ["Aset Dokumen", "Bukti Fisik"],
      coverage: 100,
      missing: [],
      status: "Complete"
    }
  ];`;

// Let's find the current coverageData definition and replace it
const oldCoverageDataRegex = /  const coverageData = \[\s*\{\s*id: "bab1",[\s\S]*?status: "Complete"\s*\}\s*\];/;
content = content.replace(oldCoverageDataRegex, newCoverageData);

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log("Updated coverageData with document status logic");
