import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class ApprovalBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    return {
      id: generateId('Approval'),
      title: 'Lembar Pengesahan',
      sections: [
        {
          id: generateId('Section'),
          title: 'Pengesahan RKT',
          paragraphs: [
            'Rencana Kerja Tahunan ini telah disusun dan disahkan pada:',
            `Tanggal: ${new Date(result.context.generatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}