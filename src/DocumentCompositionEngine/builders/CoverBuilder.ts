import { DocumentChapter } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

export class CoverBuilder {
  public build(kg: KnowledgeGraph): DocumentChapter {
    return {
      id: generateId('DocumentCover'),
      title: 'Halaman Sampul',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
