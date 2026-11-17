const fs = require('fs');
let code = fs.readFileSync('add_coverage_comp.txt', 'utf8');

const regex = /const getCoverageData = \\(\\) => \\{.*?return data;\\s*\\};/s;
const newCoverageData = `  const getCoverageData = () => {
    const data = [
      { 
        id: "bab1",
        chapter: "BAB I: Pendahuluan", 
        sources: ["Data Master Sekolah", "Identitas", "Visi Misi"], 
        module: "Modul Data Sekolah",
        stage: "Onboarding & Master Data",
        regulation: "Permendikbud No 28 Tahun 2016",
        coverage: (settings.school?.name && settings.school?.npsn) ? 100 : 50,
        missing: (settings.school?.name && settings.school?.npsn) ? [] : ["Identitas Sekolah belum lengkap (Nama/NPSN)"],
        status: (settings.school?.name && settings.school?.npsn) ? "Complete" : "Partial"
      },
      { 
        id: "bab2",
        chapter: "BAB II: Analisis Kondisi", 
        sources: ["Rapor Pendidikan", "Analisis Prioritas", "SWOT"], 
        module: "Modul Perencanaan Berbasis Rapor",
        stage: "Evaluasi Mutu",
        regulation: "Permendikbudristek No 9 Tahun 2022",
        coverage: settings.rapor?.indicators?.length ? 100 : 0,
        missing: settings.rapor?.indicators?.length ? [] : ["Sinkronisasi Rapor Pendidikan belum dilakukan"],
        status: settings.rapor?.indicators?.length ? "Complete" : "Missing"
      }
    ];

    if (docId === "rkt" || docId === "rkjm" || docId === "rkas") {
      data.push({
        id: "bab3",
        chapter: "BAB III: Program Kerja",
        sources: ["Rencana Kerja Tahunan (RKT)", "Program Prioritas"],
        module: "Modul Perencanaan",
        stage: "Penetapan Program",
        regulation: "SNP (Standar Nasional Pendidikan)",
        coverage: settings.planning?.rkt?.programs?.length ? 100 : 0,
        missing: settings.planning?.rkt?.programs?.length ? [] : ["Program kerja (RKT) belum disusun"],
        status: settings.planning?.rkt?.programs?.length ? "Complete" : "Missing"
      });
    }

    if (docId === "rkas") {
      data.push({
        id: "bab4",
        chapter: "BAB IV: Rencana Anggaran",
        sources: ["ARKAS", "Rincian Belanja", "Pendapatan"],
        module: "Modul Anggaran",
        stage: "Penyusunan Anggaran (RKAS)",
        regulation: "Permendikbud No 2 Tahun 2022",
        coverage: settings.planning?.rkas?.activities?.length ? 100 : 0,
        missing: settings.planning?.rkas?.activities?.length ? [] : ["Rencana kegiatan dan anggaran (RKAS) belum diisi"],
        status: settings.planning?.rkas?.activities?.length ? "Complete" : "Missing"
      });
    }

    data.push({
      id: "appendix",
      chapter: "LAMPIRAN",
      sources: ["Aset Dokumen", "Bukti Fisik", "Tanda Tangan"],
      module: "Modul Legalitas",
      stage: "Pengesahan",
      regulation: "Pedoman Administrasi Sekolah",
      coverage: 100,
      missing: [],
      status: "Complete"
    });

    return data;
  };`;

code = code.replace(regex, newCoverageData);
fs.writeFileSync('add_coverage_comp.txt', code);
console.log("Updated data array");
