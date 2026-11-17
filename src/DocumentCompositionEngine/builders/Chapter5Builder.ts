import { DocumentChapter } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

export class Chapter5Builder {
  public build(kg: KnowledgeGraph, settings: any = {}): DocumentChapter {
    const sections = [];

    // 5.1 Kesimpulan
    sections.push({
      id: generateId('DocumentSection'),
      title: '5.1 Kesimpulan',
      paragraphs: [
        'Rencana Kerja Jangka Menengah (RKJM) ini merupakan hasil analisis komprehensif terhadap kondisi nyata sekolah yang tercermin dalam Rapor Pendidikan. Berdasarkan evaluasi internal dan analisis lingkungan, sekolah telah menetapkan prioritas pembenahan yang difokuskan pada peningkatan kualitas pembelajaran, penguatan karakter peserta didik, serta tata kelola kelembagaan yang inklusif dan akuntabel. Program strategis yang telah disusun bertujuan untuk menjawab tantangan tersebut secara bertahap selama empat tahun ke depan. Kebutuhan pembiayaan dan sumber daya juga telah dipetakan selaras dengan ketersediaan anggaran. Pelaksanaan RKJM ini diharapkan mampu mengakselerasi transformasi sekolah menuju pencapaian Standar Nasional Pendidikan.'
      ]
    });

    // 5.2 Rekomendasi
    sections.push({
      id: generateId('DocumentSection'),
      title: '5.2 Rekomendasi',
      paragraphs: [
        'Berdasarkan seluruh perencanaan yang telah disusun, berikut adalah rekomendasi pelaksanaan:',
        '• Melaksanakan program sesuai RKJM secara terukur dan sistematis.',
        '• Memastikan optimalisasi alokasi anggaran secara akuntabel dan efisien.',
        '• Melakukan monitoring berkala secara konsisten dan terpadu.',
        '• Melaksanakan evaluasi tahunan pada setiap capaian program.',
        '• Menyesuaikan program berdasarkan hasil evaluasi secara berkelanjutan.',
        '• Memperkuat sinergi dengan komite dan pemangku kepentingan.'
      ]
    });

    // 5.3 Penutup
    sections.push({
      id: generateId('DocumentSection'),
      title: '5.3 Penutup',
      paragraphs: [
        'Demikian Rencana Kerja Jangka Menengah (RKJM) ini disusun sebagai pedoman utama arah kebijakan dan operasional sekolah. Dokumen ini wujud komitmen bersama seluruh warga sekolah dalam menghadirkan layanan pendidikan yang bermutu. Semoga seluruh tahapan perencanaan yang tertuang di dalamnya dapat direalisasikan dengan baik dan memberikan manfaat yang nyata.'
      ]
    });

    return {
      id: generateId('DocumentChapter'),
      title: 'BAB V: Kesimpulan dan Penutup',
      sections: sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
