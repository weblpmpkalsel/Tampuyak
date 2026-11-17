import { DocumentChapter } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

export class ApprovalBuilder {
  public build(kg: KnowledgeGraph): DocumentChapter {
    return {
      id: generateId('DocumentApproval'),
      title: 'Lembar Pengesahan',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
