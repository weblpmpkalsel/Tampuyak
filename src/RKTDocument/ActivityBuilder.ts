import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, formatPlanningYear, sanitizeText } from './utils';

export class ActivityBuilder {
  public build(result: RKTProjectionResult, settings?: any): DocumentChapter {
    const tableData: any[] = result.projections.map((p, i) => ({
        'No': i + 1,
        'Program': sanitizeText(p.programName, 'Program Pengembangan Mutu Satuan Pendidikan'),
        'Kegiatan': sanitizeText(p.activityName, 'Penyelenggaraan Operasional Pendidikan'),
        'Target': sanitizeText(p.target, '100% Ketercapaian Standar Nasional Pendidikan'),
        'Indikator Keberhasilan': sanitizeText(p.successIndicator, 'Terlaksananya kegiatan operasional secara efektif dan efisien'),
        'Penanggung Jawab': sanitizeText(p.personInCharge, 'Kepala Sekolah bersama Tim Penjaminan Mutu'),
        'Tahun Implementasi': formatPlanningYear(result.context.planningYear),
        'Semester': sanitizeText(p.semester, 'Semester 1 dan 2'),
        'Kuartal': sanitizeText(p.quarter, 'Kuartal 1-4'),
        'Prioritas': 'Sesuai Penugasan',
        'Status': 'Direncanakan'
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': 1,
            'Program': 'Program Pengembangan Mutu Satuan Pendidikan',
            'Kegiatan': 'Penyelenggaraan Operasional Pendidikan',
            'Target': '100% Ketercapaian Standar Nasional Pendidikan',
            'Indikator Keberhasilan': 'Terlaksananya kegiatan operasional secara efektif dan efisien',
            'Penanggung Jawab': 'Kepala Sekolah bersama Tim Penjaminan Mutu',
            'Tahun Implementasi': formatPlanningYear(result.context.planningYear),
            'Semester': 'Semester 1 dan 2',
            'Kuartal': 'Kuartal 1-4',
            'Prioritas': 'Sesuai Penugasan',
            'Status': 'Direncanakan'
        });
    }

    return {
      id: generateId('ChapterIII'),
      title: 'BAB III: Rencana Kegiatan Rinci',
      sections: [
        {
          id: generateId('Section'),
          title: '3.1 Penjabaran Program menjadi Kegiatan',
          paragraphs: [
            `Program-program strategis yang telah dirumuskan pada Bab II tidak akan berdampak tanpa adanya penjabaran operasional yang terukur. Pada bagian ini, setiap program dipecah menjadi serangkaian kegiatan yang spesifik, relevan, dan terikat pada batas waktu (time-bound) yang jelas.`,
            `Kami menyadari bahwa keberhasilan pelaksanaan sangat bergantung pada kejelasan target dan penunjukan penanggung jawab. Oleh karena itu, setiap kegiatan telah dilengkapi dengan indikator keberhasilan yang realistis namun tetap menantang. Pemilihan penanggung jawab didasarkan pada kompetensi dan peran masing-masing personel di sekolah, guna memastikan akuntabilitas pelaksanaannya.`
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '3.2 Rincian Kegiatan dan Distribusi Waktu',
          paragraphs: [
            `Tabel berikut menjabarkan rencana kegiatan rinci beserta target penyelesaiannya (distribusi kuartal dan semester). Penjadwalan ini dirancang untuk mendistribusikan beban kerja secara proporsional sepanjang tahun ajaran, mencegah penumpukan kegiatan di akhir semester, serta memberikan ruang adaptasi jika terjadi perubahan kebijakan atau kondisi force majeure.`
          ],
          tables: [{ title: 'Pemetaan Rincian Kegiatan', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}