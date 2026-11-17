import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { ScheduleBuilder } from './ScheduleBuilder';
import { generateId } from './utils';

export class AppendixBuilder {
  private scheduleBuilder = new ScheduleBuilder();

  public build(result: RKTProjectionResult): DocumentChapter {
    const scheduleAppendix = this.scheduleBuilder.build(result);

    return {
      id: generateId('Appendices'),
      title: 'Lampiran',
      sections: [
        {
          id: generateId('Section'),
          title: 'Daftar Lampiran',
          paragraphs: ['Berikut adalah matriks dan lampiran pendukung dokumen Rencana Kerja Tahunan.'],
          tables: [], figures: [], references: []
        },
        ...scheduleAppendix.sections
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}