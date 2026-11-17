import { DocumentChapter, DocumentSection } from '../DocumentCompositionEngine/DocumentModel';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';

export class Chapter1Builder {
  public build(result: RkasGeneratorResult, settings: any): DocumentChapter {
    const year = result.rkas?.year || new Date().getFullYear();

    const sections: DocumentSection[] = [
      {
        id: 'bab1_1',
        title: '1.1 Latar Belakang',
        paragraphs: [
          `Rencana Kegiatan dan Anggaran Sekolah (RKAS) Tahun ${year} disusun berdasarkan Rencana Kerja Tahunan (RKT) yang telah disepakati. Dokumen ini merincikan alokasi pendanaan untuk setiap program prioritas sekolah dalam rangka pencapaian Standar Nasional Pendidikan.`
        ]
      },
      {
        id: 'bab1_2',
        title: '1.2 Tujuan',
        paragraphs: [
          'Tujuan penyusunan RKAS ini adalah:',
          '1. Menjamin keterkaitan antara perencanaan program (RKT) dengan penganggaran.',
          '2. Memastikan seluruh kebutuhan operasional sekolah didanai secara proporsional dan akuntabel.',
          '3. Menjadi pedoman dalam pelaksanaan kegiatan sekolah dan pengelolaan keuangan.'
        ]
      }
    ];

    return {
      id: 'bab1',
      title: 'BAB I: Pendahuluan',
      sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
