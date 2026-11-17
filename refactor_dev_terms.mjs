import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// About tab
content = content.replace(/Release Date/g, 'Tanggal Pembaruan');
content = content.replace(/Architecture/g, 'Tipe Aplikasi');
content = content.replace(/Offline-First PWA/g, 'Aplikasi Luring');
content = content.replace(/Sistem Penyimpanan/g, 'Penyimpanan');
content = content.replace(/TampuyakDB \(IndexedDB\)/g, 'Penyimpanan Lokal');
content = content.replace(/Version 1.0.0/g, 'Versi 1.0.0');

// Governance tab
content = content.replace(/Enterprise Governance/g, 'Tata Kelola Tata Usaha');
content = content.replace(/Enterprise Governance & Release Lock/g, 'Keamanan Dokumen Resmi');
content = content.replace(/Release Candidate 1\.0/g, 'Versi Akhir');
content = content.replace(/Version Freeze Mode/g, 'Mode Kunci Dokumen Resmi');
content = content.replace(/Kunci modifikasi skema, template, dan regulasi\./g, 'Kunci perubahan format dan aturan baku dokumen.');
content = content.replace(/memastikan stabilitas aplikasi pada level produksi/g, 'memastikan keaslian format baku dokumen');
content = content.replace(/semua pemeriksaan Pre-Print Validation akan diperketat dan draft tidak bisa dicetak\./g, 'dokumen hanya dapat dicetak apabila telah divalidasi dan disetujui.');
content = content.replace(/Buka Kunci Sistem \(Unfreeze\)/g, 'Buka Kunci Dokumen');
content = content.replace(/Kunci Sistem \(Freeze\)/g, 'Kunci Dokumen');

// Developer mode removal
content = content.replace(/Mode Pengembang/g, 'Pengaturan Lanjutan');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done replacement');
