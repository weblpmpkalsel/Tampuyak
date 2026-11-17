import { DocumentChapter, DocumentSection } from '../DocumentCompositionEngine/DocumentModel';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';

export class CoverBuilder {
  public build(result: RkasGeneratorResult, schoolSettings: any): DocumentChapter {
    const year = result.rkas?.year || new Date().getFullYear();
    const schoolName = schoolSettings?.nama || '____________________';
    const address = schoolSettings?.alamat || '____________________';

    const sections: DocumentSection[] = [
      {
        id: 'cover_main',
        title: 'RENCANA KEGIATAN DAN ANGGARAN SEKOLAH (RKAS)',
        paragraphs: [
          `Tahun Anggaran: ${year}`,
          `Sekolah: ${schoolName}`,
          `Alamat: ${address}`
        ]
      }
    ];

    return {
      id: 'cover',
      title: 'Halaman Sampul',
      sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
