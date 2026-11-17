import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, sanitizeText } from './utils';

export class ProgramBuilder {
  public build(result: RKTProjectionResult, settings?: any): DocumentChapter {
    const schoolName = settings?.school?.name || 'Sekolah';
    
    const programNames = Array.from(new Set(result.projections.map(p => p.programName))).filter(Boolean);
    const prioritasText = programNames.length > 0 
      ? programNames.slice(0, 2).join(' dan ') 
      : 'peningkatan proses pembelajaran';

    const programsMap = new Map<string, { prog: string, obj: string, target: string }>();
    
    result.projections.forEach(p => {
        if (!programsMap.has(p.programId)) {
            programsMap.set(p.programId, {
                prog: sanitizeText(p.programName, 'Program Pengembangan Mutu Satuan Pendidikan'),
                obj: 'Sesuai Penetapan RKJM',
                target: sanitizeText(p.target, 'Tercapainya standar kompetensi lulusan secara bertahap')
            });
        }
    });
    
    const tableData: any[] = Array.from(programsMap.values()).map((v, i) => ({
        'No': i + 1,
        'Program': v.prog,
        'Sasaran Strategis': v.obj,
        'Hasil yang Diharapkan': v.target
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': 1,
            'Program': 'Program Pengembangan Mutu Satuan Pendidikan',
            'Sasaran Strategis': 'Peningkatan Kualitas Layanan Pendidikan',
            'Hasil yang Diharapkan': 'Tercapainya standar pelayanan minimal sekolah'
        });
    }

    return {
      id: generateId('ChapterII'),
      title: 'BAB II: Program Kerja Tahunan',
      sections: [
        {
          id: generateId('Section'),
          title: '2.1 Program Kerja dan Sasaran Strategis',
          paragraphs: [
            `Berdasarkan penetapan sasaran jangka menengah dan hasil evaluasi kinerja, ${schoolName} menetapkan rangkaian program kerja tahunan yang difokuskan pada ${prioritasText}. Program-program ini dirancang sebagai kerangka operasional utama untuk memandu alokasi sumber daya secara terarah dan terukur.`
          ],
          tables: [{ title: 'Daftar Program Kerja Tahunan', data: tableData }],
          figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: undefined,
          paragraphs: [
            `Penetapan program di atas memastikan setiap sasaran strategis memiliki langkah operasional yang rasional dan akuntabel. Hasil yang diharapkan dari masing-masing program tersebut akan menjadi parameter utama dalam mengukur efektivitas intervensi terhadap peningkatan mutu pendidikan di ${schoolName}.`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}