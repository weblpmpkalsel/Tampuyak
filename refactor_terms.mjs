import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Production Readiness view
content = content.replace(/"Release Checklist"/g, '"Daftar Pemeriksaan Kesiapan"');
content = content.replace(/>Release Checklist</g, '>Daftar Pemeriksaan Kesiapan<');
content = content.replace(/"Critical Blockers & Warnings"/g, '"Penghalang dan Peringatan Penting"');
content = content.replace(/>Critical Blockers & Warnings</g, '>Penghalang dan Peringatan Penting<');
content = content.replace(/"Release Blocker"/g, '"Penghalang Rilis"');
content = content.replace(/>Release Blocker</g, '>Penghalang Rilis<');
content = content.replace(/"School Data Complete"/g, '"Data Sekolah Lengkap"');
content = content.replace(/"Templates Valid"/g, '"Template Siap Digunakan"');
content = content.replace(/"Workflow Complete"/g, '"Alur Kerja Selesai"');
content = content.replace(/"Documents Valid"/g, '"Dokumen Siap Digunakan"');
content = content.replace(/"Print Ready"/g, '"Siap Dicetak"');
content = content.replace(/"Governance Ready"/g, '"Tata Kelola Siap"');
content = content.replace(/"Backup Ready"/g, '"Pencadangan Siap"');
content = content.replace(/"Monitoring Ready"/g, '"Monitoring Siap"');
content = content.replace(/"Knowledge Ready"/g, '"Basis Pengetahuan Siap"');
content = content.replace(/"No Critical Findings"/g, '"Tidak Ada Masalah Kritis"');
content = content.replace(/>Production Readiness</g, '>Kesiapan Sistem<');
content = content.replace(/"Production Readiness"/g, '"Kesiapan Sistem"');
content = content.replace(/>Developer Mode</g, '>Mode Pengembang<');
content = content.replace(/"Developer Mode"/g, '"Mode Pengembang"');
content = content.replace(/>Dev Mode</g, '>Mode Pengembang<');
content = content.replace(/"Dev Mode"/g, '"Mode Pengembang"');
content = content.replace(/>Audit Explorer</g, '>Pusat Audit<');
content = content.replace(/"Audit Explorer"/g, '"Pusat Audit"');

content = content.replace(/>Parser Mode</g, '>Mode Pembacaan Data<');
content = content.replace(/"Parser Mode"/g, '"Mode Pembacaan Data"');
content = content.replace(/>Coverage</g, '>Kelengkapan Data<');
content = content.replace(/"Coverage"/g, '"Kelengkapan Data"');
content = content.replace(/>Import History</g, '>Riwayat Impor<');
content = content.replace(/"Import History"/g, '"Riwayat Impor"');
content = content.replace(/>Summary</g, '>Ringkasan<');
content = content.replace(/"Summary"/g, '"Ringkasan"');
content = content.replace(/>Settings</g, '>Pengaturan<');
content = content.replace(/"Settings"/g, '"Pengaturan"');
content = content.replace(/>Dashboard</g, '>Beranda<');
content = content.replace(/"Dashboard"/g, '"Beranda"');
content = content.replace(/>Workspace</g, '>Ruang Kerja<');
content = content.replace(/"Workspace"/g, '"Ruang Kerja"');
content = content.replace(/>Generate</g, '>Susun<');
content = content.replace(/"Generate"/g, '"Susun"');
content = content.replace(/>Compile</g, '>Siapkan<');
content = content.replace(/"Compile"/g, '"Siapkan"');
content = content.replace(/>Import</g, '>Ambil Data<');
content = content.replace(/"Import"/g, '"Ambil Data"');
content = content.replace(/>Export</g, '>Unduh<');
content = content.replace(/"Export"/g, '"Unduh"');
content = content.replace(/>Validation</g, '>Pemeriksaan<');
content = content.replace(/"Validation"/g, '"Pemeriksaan"');
content = content.replace(/>Approval</g, '>Pengesahan<');
content = content.replace(/"Approval"/g, '"Pengesahan"');
content = content.replace(/>Priority</g, '>Prioritas Perbaikan<');
content = content.replace(/"Priority"/g, '"Prioritas Perbaikan"');
content = content.replace(/>Root Cause</g, '>Akar Masalah<');
content = content.replace(/"Root Cause"/g, '"Akar Masalah"');
content = content.replace(/>Recommendation</g, '>Saran Perbaikan<');
content = content.replace(/"Recommendation"/g, '"Saran Perbaikan"');

// Contextual Language
content = content.replace(/"Import Successful"/g, '"Data Rapor Pendidikan berhasil dibaca dan siap digunakan untuk menyusun Analisis Sekolah."');
content = content.replace(/"Coverage 95%"/g, '"95% indikator berhasil dikenali. Beberapa data belum ditemukan."');
content = content.replace(/>Import Successful</g, '>Data Rapor Pendidikan berhasil dibaca dan siap digunakan untuk menyusun Analisis Sekolah.<');

// Button labels
content = content.replace(/>Run</g, '>Mulai<');
content = content.replace(/>Execute</g, '>Proses<');
content = content.replace(/>Commit</g, '>Simpan<');
content = content.replace(/>Continue</g, '>Lanjutkan<');
content = content.replace(/>Approve</g, '>Setujui<');
content = content.replace(/>Deploy</g, '>Terapkan<');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done');
