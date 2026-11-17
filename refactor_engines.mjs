import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const replacements = [
  ['Sertifikasi Mutu Engine', 'Sertifikasi Mutu'],
  ['Target & Performance Engine', 'Penyusunan Target & Kinerja'],
  ['Rapor Pendidikan Intelligence Engine', 'Dasbor Cerdas Rapor Pendidikan'],
  ['Auto-IRB Engine', 'Pembuat IRB Otomatis'],
  ['Engine Identifikasi, Refleksi, Benahi (IRB)', 'Identifikasi, Refleksi, Benahi (IRB)'],
  ['Kelengkapan Bab (Coverage Engine)', 'Kelengkapan Bab'],
  ['Data Coverage Engine', 'Kelengkapan Data'],
  ['Document Review Engine (DRE)', 'Sistem Pemeriksaan Dokumen (DRE)'],
  ['Storage Engine', 'Sistem Penyimpanan'],
  ['Missing RKJM', 'RKJM Tidak Ditemukan'],
  ['Non-Compliant', 'Tidak Sesuai'],
  ['Non-Patuh', 'Tidak Sesuai'],
  ['Compliant', 'Sesuai'],
  ['Patuh', 'Sesuai'],
  ['Needs Attention', 'Perlu Perhatian']
];

for (const [en, id] of replacements) {
  content = content.replace(new RegExp(en, 'g'), id);
}

// Ensure the title attributes or similar use natural language
content = content.replace(/title="Kelengkapan Data"/g, 'title="Cek Kelengkapan Data"');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Engine terms replaced');
