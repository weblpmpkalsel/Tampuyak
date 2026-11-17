import { DocumentRouter } from './src/document/DocumentRouter';
import { RKTDocumentBuilder } from './src/RKTDocument/RKTDocumentBuilder';

const result = {
  context: {
    planningYear: '2024/2025'
  },
  projections: [
    {
      programName: 'Pengembangan Kompetensi Guru',
      activityName: 'IHT Pembelajaran Berdiferensiasi',
      target: '100% guru dapat menyusun RPP berdiferensiasi',
      successIndicator: 'RPP divalidasi oleh Kepala Sekolah',
      budgetReference: 'BOS Kinerja',
      monitoringReference: 'Lembar Observasi Supervisi Akademik',
      semester: 1,
      quarter: 1,
      personInCharge: 'Wakasek Kurikulum'
    },
    {
      programName: 'Peningkatan Sarana Prasarana',
      activityName: 'Pengadaan Perangkat TIK untuk Pembelajaran',
      target: 'Tersedianya 1 unit proyektor di tiap kelas',
      successIndicator: '100% kelas memiliki akses proyektor',
      budgetReference: 'BOS Reguler',
      monitoringReference: 'Laporan Inventaris Barang',
      semester: 1,
      quarter: 2,
      personInCharge: 'Wakasek Sarpras'
    }
  ]
};

const settings = {
  school: {
    name: 'SMP Negeri 1 Nusantara Baru',
    npsn: '12345678',
    address: 'Jl. Pendidikan No. 1'
  },
  identitas: {
    visi: 'Mewujudkan Profil Pelajar Pancasila yang Berakhlak Mulia, Kritis, dan Kreatif',
    karakteristik: 'berada di lingkungan sub-urban dengan keberagaman latar belakang sosial-ekonomi peserta didik'
  },
  analisis: {
    data: {
      prioritas: [
        { masalah: 'rendahnya skor literasi dan numerasi' },
        { masalah: 'belum optimalnya pemanfaatan TIK oleh pendidik' }
      ]
    }
  }
};

try {
  const builder = new RKTDocumentBuilder();
  const document = builder.buildDocument(result as any, settings);
  
  let output = '';
  
  // Format document
  const chapters = [document.chapter1, document.chapter2, document.chapter3, document.chapter4, document.chapter5];
  for (const chapter of chapters) {
    if (!chapter) continue;
    output += `\n# ${chapter.title}\n\n`;
    for (const section of chapter.sections) {
      output += `## ${section.title}\n\n`;
      for (const p of section.paragraphs) {
        output += `${p}\n\n`;
      }
      for (const table of section.tables) {
         output += `### ${table.title}\n`;
         if (table.data && table.data.length > 0) {
           const keys = Object.keys(table.data[0]);
           output += `| ${keys.join(' | ')} |\n`;
           output += `| ${keys.map(() => '---').join(' | ')} |\n`;
           for (const row of table.data) {
              output += `| ${keys.map(k => row[k]).join(' | ')} |\n`;
           }
         }
         output += '\n';
      }
    }
  }
  console.log(output.trim());
} catch(e) {
  console.error(e);
}
