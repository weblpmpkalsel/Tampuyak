const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionTeacherRtlRecord.tsx', 'utf8');

content = content.replace(/SupervisionTeacherRtlDashboard/g, 'SupervisionTeacherRtlRecord');
content = content.replace(/Tugas RTL Saya/g, 'Tracking RTL Guru');
content = content.replace(/Unggah Bukti/g, 'Input Bukti');
content = content.replace(/Kirim Laporan/g, 'Simpan Laporan');
content = content.replace(/Tuliskan catatan Anda\.\.\./g, 'Tuliskan catatan observasi/guru...');
content = content.replace(/Catatan dari Anda/g, 'Catatan Perkembangan');
content = content.replace(/Tautkan dokumen, foto, atau video bukti pelaksanaan\.\.\./g, 'Tautkan dokumen, foto, atau video bukti...');

fs.writeFileSync('src/modules/supervision/ui/SupervisionTeacherRtlRecord.tsx', content);
