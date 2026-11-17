import { DocumentChapter, DocumentSection } from '../DocumentCompositionEngine/DocumentModel';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';
import { BudgetStructure, BudgetLine } from '../budget/BudgetTypes';

export class Chapter2Builder {
  public build(result: RkasGeneratorResult, settings: any): DocumentChapter {
    const structures: BudgetStructure[] = result.rkas?.budgetStructures || [];
    
    const budgetData: any[] = [];
    let grandTotal = 0;

    structures.forEach(structure => {
      const subtotal = structure.totalAmount || 0;
      
      if (structure.lines.length > 0) {
        budgetData.push({
          'Kegiatan': `PROGRAM: ${structure.header.title}`,
          'Kode Rekening': '',
          'Komponen': '',
          'Sumber Dana': '',
          'Volume': '',
          'Satuan': '',
          'Harga Satuan': '',
          'Total': ''
        });
      }

      structure.lines.forEach((line: BudgetLine) => {
        budgetData.push({
          'Kegiatan': line.activity.name || '-',
          'Kode Rekening': line.account ? `${line.account.code} - ${line.account.name}` : '-',
          'Komponen': line.component ? line.component.name : '-',
          'Sumber Dana': line.funding ? line.funding.source : '-',
          'Volume': line.volume || 0,
          'Satuan': line.unit || '-',
          'Harga Satuan': `Rp ${(line.unitPrice || 0).toLocaleString('id-ID')}`,
          'Total': `Rp ${(line.total || 0).toLocaleString('id-ID')}`
        });
      });
      
      if (structure.lines.length > 0) {
        budgetData.push({
          'Kegiatan': 'SUBTOTAL',
          'Kode Rekening': '',
          'Komponen': '',
          'Sumber Dana': '',
          'Volume': '',
          'Satuan': '',
          'Harga Satuan': '',
          'Total': `Rp ${subtotal.toLocaleString('id-ID')}`
        });
        grandTotal += subtotal;
      }
    });

    if (budgetData.length === 0) {
      budgetData.push({
        'Kegiatan': '-',
        'Kode Rekening': '-',
        'Komponen': '-',
        'Sumber Dana': '-',
        'Volume': '-',
        'Satuan': '-',
        'Harga Satuan': '-',
        'Total': '-'
      });
    } else {
      budgetData.push({
        'Kegiatan': 'TOTAL KESELURUHAN',
        'Kode Rekening': '',
        'Komponen': '',
        'Sumber Dana': '',
        'Volume': '',
        'Satuan': '',
        'Harga Satuan': '',
        'Total': `Rp ${grandTotal.toLocaleString('id-ID')}`
      });
    }

    const sections: DocumentSection[] = [
      {
        id: 'bab2_1',
        title: '2.1 Rincian Rencana Kegiatan dan Anggaran Sekolah',
        paragraphs: [
          'Berikut adalah rincian rencana kegiatan dan anggaran sekolah berdasarkan struktur pembiayaan standar yang telah diproyeksikan dan diintegrasikan melalui modul perencanaan.'
        ],
        tables: [{
          title: 'Tabel RKAS',
          data: budgetData
        }]
      }
    ];

    return {
      id: 'bab2',
      title: 'BAB II: Rincian Anggaran Pendapatan dan Belanja',
      sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };
  }
}
