import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, sanitizeText, getEvaluationScheduleDefault } from './utils';

export class ScheduleBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const tableData: any[] = result.projections.map((p, i) => ({
        'No': i + 1,
        'Kegiatan': sanitizeText(p.activityName, 'Penyelenggaraan Operasional Pendidikan'),
        'Jadwal': getEvaluationScheduleDefault(p.semester)
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': 1,
            'Kegiatan': 'Penyelenggaraan Operasional Pendidikan',
            'Jadwal': 'Sepanjang Tahun Ajaran (Semester 1 dan 2)'
        });
    }

    return {
      id: generateId('ScheduleAppendix'),
      title: 'Lampiran: Jadwal Tahunan',
      sections: [
        {
          id: generateId('Section'),
          title: 'Jadwal Pelaksanaan Kegiatan',
          paragraphs: [],
          tables: [{ title: 'Matriks Jadwal', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}