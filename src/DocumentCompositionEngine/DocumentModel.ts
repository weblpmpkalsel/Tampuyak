export interface DocumentSection {
  id: string;
  title?: string;
  paragraphs: string[];
  tables?: any[];
  figures?: any[];
  references?: string[];
  metadata?: any;
}

export interface DocumentChapter {
  id: string;
  title: string;
  subtitle?: string;
  sections: DocumentSection[];
  paragraphs: string[];
  tables: any[];
  figures: any[];
  references: string[];
  metadata: any;
}

export interface DocumentModel {
  cover: DocumentChapter;
  approval: DocumentChapter;
  toc: DocumentChapter;
  chapter1: DocumentChapter;
  chapter2: DocumentChapter;
  chapter3: DocumentChapter;
  chapter4: DocumentChapter;
  chapter5: DocumentChapter;
  appendix: DocumentChapter;
  vision?: string;
  mission?: string[];
  goals?: string[];
}
