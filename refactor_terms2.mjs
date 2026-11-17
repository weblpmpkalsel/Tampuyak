import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// List of exact replacements
const replacements = [
  ['Release Checklist', 'Daftar Pemeriksaan Kesiapan'],
  ['Release Blocker', 'Penghalang Rilis'],
  ['Critical Blockers & Warnings', 'Penghalang dan Peringatan Penting'],
  ['Workflow Complete', 'Alur Kerja Selesai'],
  ['Templates Valid', 'Template Siap Digunakan'],
  ['Documents Valid', 'Dokumen Siap Digunakan'],
  ['Governance Ready', 'Tata Kelola Siap'],
  ['Print Ready', 'Siap Dicetak'],
  ['Backup Ready', 'Pencadangan Siap'],
  ['Knowledge Ready', 'Basis Pengetahuan Siap'],
  ['Monitoring Ready', 'Monitoring Siap'],
  ['No Critical Findings', 'Tidak Ada Masalah Kritis'],
  ['Production Readiness', 'Kesiapan Sistem'],
  ['Developer Mode', 'Mode Pengembang'],
  ['Dev Mode', 'Mode Pengembang'],
  ['Audit Explorer', 'Pusat Audit'],
  ['Parser Mode', 'Mode Pembacaan Data'],
  ['Coverage', 'Kelengkapan Data'],
  ['Import History', 'Riwayat Impor'],
  ['Summary', 'Ringkasan'],
  ['Settings', 'Pengaturan'],
  ['Dashboard', 'Beranda'],
  ['Workspace', 'Ruang Kerja'],
  ['Generate', 'Susun'],
  ['Compile', 'Siapkan'],
  ['Import', 'Ambil Data'],
  ['Export', 'Unduh'],
  ['Validation', 'Pemeriksaan'],
  ['Approval', 'Pengesahan'],
  ['Priority', 'Prioritas Perbaikan'],
  ['Root Cause', 'Akar Masalah'],
  ['Recommendation', 'Saran Perbaikan']
];

for (const [en, id] of replacements) {
  const regex = new RegExp(`>\\s*${en}\\s*<`, 'gi');
  content = content.replace(regex, (match) => match.replace(new RegExp(en, 'i'), id));
  
  // also replace bare words if they are standalone in UI
  // be careful about variable names, so we just replace in common JSX text spots
  // we can just string replace if they are in object keys (e.g., label: "School Data Complete")
  content = content.replace(new RegExp(`"${en}"`, 'g'), `"${id}"`);
}

// Special labels in the checklist
content = content.replace(/"School Data Complete"/g, '"Data Sekolah Lengkap"');
content = content.replace(/School Data Complete/g, 'Data Sekolah Lengkap');

// We have strings like:
// { label: "School Data Complete", done: isDataReady },
// They should be covered by `"School Data Complete"` replacements.

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done');
