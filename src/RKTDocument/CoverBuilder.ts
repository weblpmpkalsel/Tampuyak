import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, formatPlanningYear } from './utils';

export class CoverBuilder {
  public build(result: RKTProjectionResult, schoolIdentity: any): DocumentChapter {
    return {
      id: generateId('Cover'),
      title: 'Rencana Kerja Tahunan (RKT)',
      subtitle: formatPlanningYear(result.context.planningYear),
      sections: [
        {
          id: generateId('Section'),
          title: 'Identitas Sekolah',
          paragraphs: [
            `Nama Sekolah: ${schoolIdentity?.name || 'Data sedang dalam tahap penyusunan'}`,
            `NPSN: ${schoolIdentity?.npsn || 'Data sedang dalam tahap penyusunan'}`,
            `Alamat: ${schoolIdentity?.address || 'Data sedang dalam tahap penyusunan'}`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}