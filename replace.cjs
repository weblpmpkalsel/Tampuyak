const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const replacements = [
  { from: /Decision Engine Belum Disetujui/g, to: 'Analisis Prioritas Belum Disetujui' },
  { from: /Template tidak terhubung dengan Workflow Engine/g, to: 'Template tidak terhubung dengan Status Dokumen' },
  { from: /Tahap 4: Memuat Decision Engine/g, to: 'Tahap 4: Memuat Analisis Prioritas' },
  { from: /Tahap 5: Memuat Target Engine/g, to: 'Tahap 5: Memuat Target Sekolah' },
  { from: /Tahap 9: Menjalankan Compliance Engine/g, to: 'Tahap 9: Menjalankan Pemeriksaan Kepatuhan' },
  { from: /Decision Engine menganalisis konteks/g, to: 'Analisis Prioritas menganalisis konteks' },
  { from: /Decision Engine menyesuaikan rekomendasi/g, to: 'Analisis Prioritas menyesuaikan rekomendasi' },
  { from: /Decision Engine & Knowledge Base/g, to: 'Analisis Prioritas & Knowledge Base' },
  { from: /"Target Engine"/g, to: '"Target Sekolah"' },
  { from: /> Target Engine/g, to: '> Target Sekolah' },
  { from: /Workflow Engine<\/span>/g, to: 'Status Dokumen</span>' },
  { from: /Workspace RKJM/g, to: 'Ruang Kerja RKJM' },
  { from: /Workspace RKT/g, to: 'Ruang Kerja RKT' },
  { from: /Workspace RKAS/g, to: 'Ruang Kerja RKAS' },
  { from: /Workspace Pelaksanaan/g, to: 'Ruang Kerja Pelaksanaan' },
  { from: /Workspace Dokumen/g, to: 'Ruang Kerja Dokumen' },
  { from: /Workspace KSP\/KOSP/g, to: 'Ruang Kerja KSP/KOSP' },
  { from: /Workspace Analisis/g, to: 'Ruang Kerja Analisis' },
  { from: /Buka Workspace/g, to: 'Buka Ruang Kerja' },
  { from: /Export & Publishing Center/g, to: 'Cetak & Ekspor' },
  { from: /Publishing Center/g, to: 'Cetak & Ekspor' },
  { from: /Pemeriksaan Dokumen\."/g, to: 'Pemeriksaan Dokumen."' }, 
  { from: /DQA Engine\."/g, to: 'Pemeriksaan Dokumen."' },
  { from: /DQA Engine/g, to: 'Pemeriksaan Dokumen' },
  { from: /Document Editor Engine/g, to: 'Editor Dokumen' },
  { from: /Enterprise Document Editor bergaya/g, to: 'Editor Dokumen bergaya' },
  { from: /Buka di Document Editor/g, to: 'Buka di Editor Dokumen' },
  { from: /Decision Engine, dan/g, to: 'Analisis Prioritas, dan' },
  { from: /Workflow Engine/g, to: 'Status Dokumen' },
  { from: /Compliance Engine/g, to: 'Pemeriksaan Kepatuhan' },
];

for (const r of replacements) {
  code = code.replace(r.from, r.to);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done replacements');
