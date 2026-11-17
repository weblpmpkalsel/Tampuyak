import { DocumentChapter } from '../DocumentModel';
import { generateId } from '../utils';
import { KnowledgeGraph } from '../../SPKG';

export class TocBuilder {
  public build(kg: KnowledgeGraph): DocumentChapter {
    return {
      id: generateId('DocumentTOC'),
      title: 'Daftar Isi',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
