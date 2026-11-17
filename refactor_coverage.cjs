const fs = require('fs');

const path = 'src/Tampuyak.tsx';
let code = fs.readFileSync(path, 'utf-8');

const regex = /const coverageData = \[[\s\S]*?\];[\s]*const chaptersComplete = coverageData\.every/m;

const replacement = `let coverageData = [];

  const isKspComplete = docs.find((d) => d.type === "KSP")?.status === "Disetujui" || docs.find((d) => d.type === "KSP")?.status === "Terkunci";
  const rkjmDoc = docs.find((d) => d.type === "RKJM");
  const rktDoc = docs.find((d) => d.type === "RKT");
  const rkasDoc = docs.find((d) => d.type === "RKAS");
  const monitoringDoc = docs.find((d) => d.type === "Monitoring");
  
  const isRkjmComplete = rkjmDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rkjmDoc.status);
  const isRktComplete = rktDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rktDoc.status);
  const isRkasComplete = rkasDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rkasDoc.status);
  const isMonitoringComplete = monitoringDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(monitoringDoc.status);
  
  const isIdentityComplete = !!(settings.school?.name && settings.school?.npsn);
  const isRaporComplete = !!settings.rapor?.isLocked;
  const isAnalisisComplete = settings.analisis?.status === "Disetujui" || settings.analisis?.status === "Selesai" || settings.analisis?.status === "Terkunci";

  if (docId === "ksp") {
    coverageData = [
      {
        id: "bab1", chapter: "BAB I: Karakteristik Satuan Pendidikan", sources: ["Data Master Sekolah", "Rapor Pendidikan"], 
        module: "Pengaturan & Rapor", stage: "Analisis Karakteristik", regulation: "Permendikbud No. 12 Tahun 2024",
        coverage: (isIdentityComplete && isRaporComplete) ? 100 : (isIdentityComplete ? 50 : 0),
        missing: []
          .concat(isIdentityComplete ? [] : [{ dataset: "Identitas Sekolah (Nama/NPSN)", module: "Pengaturan > Identitas Sekolah", link: "settings", action: "Lengkapi data NPSN dan Nama Sekolah pada form Identitas." }])
          .concat(isRaporComplete ? [] : [{ dataset: "Data Rapor Pendidikan", module: "Rapor Pendidikan", link: "rapor", action: "Selesaikan sinkronisasi dan kunci data rapor pendidikan." }]),
        status: (isIdentityComplete && isRaporComplete) ? "Complete" : (isIdentityComplete || isRaporComplete ? "Partial" : "Blocked")
      },
      {
        id: "bab2", chapter: "BAB II: Visi, Misi, dan Tujuan", sources: ["Data Master Sekolah"],
        module: "Pengaturan", stage: "Perumusan Visi Misi", regulation: "Permendikbud No. 12 Tahun 2024",
        coverage: isIdentityComplete ? 100 : 0,
        missing: isIdentityComplete ? [] : [{ dataset: "Identitas Sekolah", module: "Pengaturan > Identitas Sekolah", link: "settings", action: "Lengkapi Visi dan Misi Sekolah." }],
        status: isIdentityComplete ? "Complete" : "Blocked"
      }
    ];
  } else if (docId === "rkjm") {
    coverageData = [
      { 
        id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["Data Master Sekolah", "Visi Misi"], 
        module: "Pengaturan & KSP", stage: "Persiapan RKJM", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isIdentityComplete ? 100 : 0,
        missing: isIdentityComplete ? [] : [{ dataset: "Identitas Sekolah (Nama/NPSN)", module: "Pengaturan > Identitas Sekolah", link: "settings", action: "Lengkapi data NPSN dan Nama Sekolah pada form Identitas." }],
        status: isIdentityComplete ? "Complete" : "Blocked"
      },
      { 
        id: "bab2", chapter: "BAB II: Analisis Kondisi", sources: ["Rapor Pendidikan"], 
        module: "Rapor Pendidikan", stage: "Evaluasi Diri Sekolah", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isRaporComplete ? 100 : 0,
        missing: isRaporComplete ? [] : [{ dataset: "Data Rapor Pendidikan", module: "Modul Rapor Pendidikan", link: "rapor", action: "Lakukan sinkronisasi data Rapor Pendidikan dan kunci data." }],
        status: isRaporComplete ? "Complete" : "Blocked"
      },
      {
        id: "bab3", chapter: "BAB III: Program Kerja Strategis", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"],
        module: "Perencanaan > Analisis", stage: "Perumusan Program Strategis", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isAnalisisComplete ? 100 : 0,
        missing: isAnalisisComplete ? [] : [{ dataset: "Analisis Prioritas Disetujui", module: "Perencanaan > Analisis", link: "diagnosis", action: "Selesaikan dan setujui Analisis Prioritas & Akar Masalah." }],
        status: isAnalisisComplete ? "Complete" : "Blocked"
      },
      {
        id: "bab4", chapter: "BAB IV: Rencana Pembiayaan", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"],
        module: "Perencanaan > Analisis", stage: "Estimasi Pembiayaan Jangka Menengah", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isAnalisisComplete ? 100 : 0,
        missing: isAnalisisComplete ? [] : [{ dataset: "Analisis Prioritas Disetujui", module: "Perencanaan > Analisis", link: "diagnosis", action: "Analisis Prioritas diperlukan untuk memproyeksikan rencana pembiayaan RKJM." }],
        status: isAnalisisComplete ? "Complete" : "Blocked"
      },
      {
        id: "appendix", chapter: "LAMPIRAN", sources: ["Aset Dokumen", "Bukti Fisik"],
        module: "Lampiran", stage: "Kelengkapan Fisik", regulation: "Administrasi Sekolah",
        coverage: 100,
        missing: [],
        status: "Complete"
      }
    ];
  } else if (docId === "rkt") {
    coverageData = [
      {
        id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKJM Disetujui", "Data Master Sekolah"],
        module: "RKJM", stage: "Persiapan RKT", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isRkjmComplete ? 100 : 0,
        missing: isRkjmComplete ? [] : [{ dataset: "Dokumen RKJM Disetujui", module: "Perencanaan > RKJM", link: "documentDetail_rkjm", action: "Selesaikan dan setujui Rencana Kerja Jangka Menengah (RKJM) sebagai landasan RKT." }],
        status: isRkjmComplete ? "Complete" : "Blocked"
      },
      {
        id: "bab2", chapter: "BAB II: Program dan Kegiatan Tahunan", sources: ["RKJM Disetujui", "Sasaran Strategis Tahunan"],
        module: "RKJM", stage: "Penjabaran Program Tahunan", regulation: "Permendikbudristek No. 47 Tahun 2023",
        coverage: isRkjmComplete ? 100 : 0,
        missing: isRkjmComplete ? [] : [{ dataset: "Sasaran Strategis RKJM", module: "Perencanaan > RKJM", link: "documentDetail_rkjm", action: "RKJM harus disetujui untuk diturunkan menjadi kegiatan tahunan RKT." }],
        status: isRkjmComplete ? "Complete" : "Blocked"
      }
    ];
  } else if (docId === "rkas") {
    coverageData = [
      {
        id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKT Disetujui"],
        module: "RKT", stage: "Persiapan RKAS", regulation: "Permendikbudristek No. 63 Tahun 2022",
        coverage: isRktComplete ? 100 : 0,
        missing: isRktComplete ? [] : [{ dataset: "Dokumen RKT Disetujui", module: "Perencanaan > RKT", link: "documentDetail_rkt", action: "Selesaikan dan setujui Rencana Kerja Tahunan (RKT) sebagai dasar anggaran RKAS." }],
        status: isRktComplete ? "Complete" : "Blocked"
      },
      {
        id: "bab2", chapter: "BAB II: Rincian Anggaran Pendapatan dan Belanja", sources: ["RKT Disetujui", "Standar Biaya"],
        module: "RKT", stage: "Pemetaan Kode Rekening", regulation: "Permendikbudristek No. 63 Tahun 2022",
        coverage: isRktComplete ? 100 : 0,
        missing: isRktComplete ? [] : [{ dataset: "Kegiatan Tahunan RKT", module: "Perencanaan > RKT", link: "documentDetail_rkt", action: "RKT harus disetujui sebelum anggarannya dapat dipetakan ke dalam RKAS." }],
        status: isRktComplete ? "Complete" : "Blocked"
      }
    ];
  } else if (docId === "monitoring") {
    coverageData = [
      {
        id: "bab1", chapter: "Laporan Pelaksanaan", sources: ["RKAS Disetujui", "Implementasi"],
        module: "RKAS", stage: "Pelaksanaan", regulation: "Standar Pengelolaan",
        coverage: isRkasComplete ? 100 : 0,
        missing: isRkasComplete ? [] : [{ dataset: "Dokumen RKAS Disetujui", module: "Perencanaan > RKAS", link: "documentDetail_rkas", action: "RKAS harus disetujui sebelum pelaksanaan dapat dimonitor." }],
        status: isRkasComplete ? "Complete" : "Blocked"
      }
    ];
  } else if (docId === "evaluasi") {
    coverageData = [
      {
        id: "bab1", chapter: "Evaluasi Kinerja", sources: ["Monitoring Disetujui", "Laporan Capaian"],
        module: "Monitoring", stage: "Evaluasi", regulation: "Standar Penilaian",
        coverage: isMonitoringComplete ? 100 : 0,
        missing: isMonitoringComplete ? [] : [{ dataset: "Laporan Monitoring", module: "Evaluasi > Monitoring", link: "monitoring", action: "Selesaikan laporan monitoring sebelum melakukan evaluasi akhir." }],
        status: isMonitoringComplete ? "Complete" : "Blocked"
      }
    ];
  } else {
    coverageData = [
       { 
         id: "bab1", chapter: "Persiapan Dokumen", sources: ["Data Master Sekolah"], 
         module: "Pengaturan", stage: "Inisialisasi", regulation: "Standar Nasional Pendidikan",
         coverage: isIdentityComplete ? 100 : 0, 
         missing: isIdentityComplete ? [] : [{ dataset: "Identitas Sekolah", module: "Pengaturan > Identitas Sekolah", link: "settings", action: "Lengkapi data sekolah." }], 
         status: isIdentityComplete ? "Complete" : "Blocked" 
       }
    ];
  }

  const chaptersComplete = coverageData.every`;

if (!regex.test(code)) {
  console.log("Could not find coverageData block.");
} else {
  code = code.replace(regex, replacement);
  fs.writeFileSync(path, code);
  console.log("Replaced successfully!");
}
