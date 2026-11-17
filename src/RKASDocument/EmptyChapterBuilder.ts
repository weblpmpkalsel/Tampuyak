import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';

export class EmptyChapterBuilder {
  public build(title: string, id: string): DocumentChapter {
    return {
      id: id,
      title: title,
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
