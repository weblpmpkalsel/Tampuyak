import { DocumentModel, DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';
import { CoverBuilder } from './CoverBuilder';
import { ApprovalBuilder } from './ApprovalBuilder';
import { Chapter1Builder } from './Chapter1Builder';
import { Chapter2Builder } from './Chapter2Builder';
import { EmptyChapterBuilder } from './EmptyChapterBuilder';

export class RKASDocumentBuilder {
  private coverBuilder = new CoverBuilder();
  private approvalBuilder = new ApprovalBuilder();
  private chapter1Builder = new Chapter1Builder();
  private chapter2Builder = new Chapter2Builder();
  private emptyChapterBuilder = new EmptyChapterBuilder();

  public buildDocument(result: RkasGeneratorResult, settings: any): DocumentModel {
    const cover = this.coverBuilder.build(result, settings?.school);
    const approval = this.approvalBuilder.build(result, settings);
    const toc: DocumentChapter = {
        id: 'TOC',
        title: 'Daftar Isi',
        sections: [], paragraphs: [], tables: [], figures: [], references: [], metadata: {}
    };

    const chapter1 = this.chapter1Builder.build(result, settings);
    const chapter2 = this.chapter2Builder.build(result, settings);
    const chapter3 = {
      id: 'bab3',
      title: 'BAB III: Penutup',
      sections: [{
        id: 'bab3_1',
        title: '3.1 Kesimpulan',
        paragraphs: ['Rencana Kegiatan dan Anggaran Sekolah (RKAS) ini diharapkan dapat menjadi pedoman yang efektif dalam pengelolaan keuangan dan pelaksanaan program sekolah.']
      }],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
    const chapter4 = this.emptyChapterBuilder.build('', 'BAB IV');
    const chapter5 = this.emptyChapterBuilder.build('', 'BAB V');
    const appendix = this.emptyChapterBuilder.build('LAMPIRAN', 'Appendix');

    return {
      cover,
      approval,
      toc,
      chapter1,
      chapter2,
      chapter3,
      chapter4,
      chapter5,
      appendix
    };
  }
}
