import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, sanitizeText } from './utils';

export class BudgetBuilder {
  public build(result: RKTProjectionResult, settings?: any): DocumentChapter {
    const tableData: any[] = result.projections.map((p, i) => ({
        'No': i + 1,
        'Kegiatan': sanitizeText(p.activityName, 'Penyelenggaraan Operasional Pendidikan'),
        'Referensi Anggaran': sanitizeText(p.budgetReference, 'Mengacu pada Standar Biaya Masukan'),
        'Sumber Dana': 'BOS Kinerja/Reguler',
        'Estimasi Biaya': sanitizeText(p.budgetReference, 'Sesuai pagu RKAS yang disahkan'),
        'Catatan Anggaran': 'Proyeksi'
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': 1,
            'Kegiatan': 'Penyelenggaraan Operasional Pendidikan',
            'Referensi Anggaran': 'Mengacu pada Standar Biaya Masukan',
            'Sumber Dana': 'BOS Kinerja/Reguler',
            'Estimasi Biaya': 'Sesuai pagu RKAS yang disahkan',
            'Catatan Anggaran': 'Proyeksi'
        });
    }

    return {
      id: generateId('ChapterIV'),
      title: 'BAB IV: Rencana Pendanaan',
      sections: [
        {
          id: generateId('Section'),
          title: '4.1 Proyeksi Kebutuhan Pendanaan',
          paragraphs: [
            `Seluruh program dan kegiatan yang telah direncanakan pada Bab III memerlukan dukungan sumber daya agar dapat diimplementasikan secara optimal. Bab ini tidak merinci detail pembelanjaan, melainkan menyajikan proyeksi indikatif mengenai kegiatan yang membutuhkan dukungan finansial.`,
            `Pembiayaan riil, standar harga, dan rincian belanja operasional untuk setiap kegiatan akan dijabarkan secara komprehensif di dalam dokumen Rencana Kegiatan dan Anggaran Sekolah (RKAS). Sinkronisasi antara RKT dan RKAS merupakan wujud komitmen sekolah dalam memastikan setiap intervensi operasional didukung oleh perencanaan anggaran yang rasional dan sesuai petunjuk teknis yang berlaku.`
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '4.2 Pemetaan Indikatif Sumber Dana',
          paragraphs: [
            `Tabel berikut menyajikan pemetaan indikatif mengenai sumber pendanaan yang diproyeksikan untuk mendukung masing-masing kegiatan. Pemetaan ini berfungsi sebagai jembatan administratif yang memastikan bahwa setiap inisiatif operasional RKT memiliki rujukan pembiayaan yang jelas sebelum diinput ke dalam sistem RKAS.`
          ],
          tables: [{ title: 'Pemetaan Rencana Pendanaan Indikatif', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}