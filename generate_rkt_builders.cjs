const fs = require('fs');
const path = require('path');

const dir = '/app/applet/src/RKTDocument';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const write = (name, content) => {
    fs.writeFileSync(path.join(dir, name), content.trim());
};

write('utils.ts', `
export function generateId(prefix: string): string {
    return prefix + '-' + Math.random().toString(36).substring(2, 9);
}
`);

write('CoverBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class CoverBuilder {
  public build(result: RKTProjectionResult, schoolIdentity: any): DocumentChapter {
    return {
      id: generateId('Cover'),
      title: 'Rencana Kerja Tahunan (RKT)',
      subtitle: \`Tahun Perencanaan: \${result.context.planningYear}\`,
      sections: [
        {
          id: generateId('Section'),
          title: 'Identitas Sekolah',
          paragraphs: [
            \`Nama Sekolah: \${schoolIdentity?.name || 'Belum ditetapkan'}\`,
            \`NPSN: \${schoolIdentity?.npsn || 'Belum ditetapkan'}\`,
            \`Alamat: \${schoolIdentity?.address || 'Belum ditetapkan'}\`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('ApprovalBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class ApprovalBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    return {
      id: generateId('Approval'),
      title: 'Lembar Pengesahan',
      sections: [
        {
          id: generateId('Section'),
          title: 'Pengesahan RKT',
          paragraphs: [
            'Rencana Kerja Tahunan ini telah disusun dan disahkan pada:',
            \`Tanggal: \${new Date(result.context.generatedAt).toLocaleDateString('id-ID')}\`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('IntroductionBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class IntroductionBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    return {
      id: generateId('ChapterI'),
      title: 'BAB I: Pendahuluan',
      sections: [
        {
          id: generateId('Section'),
          title: '1.1 Latar Belakang',
          paragraphs: ['Rencana Kerja Tahunan disusun berdasarkan proyeksi pencapaian yang telah ditetapkan dalam RKJM.'],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.2 Landasan Hukum',
          paragraphs: ['Penyusunan RKT ini dilandasi oleh peraturan yang berlaku terkait standar nasional pendidikan.'],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.3 Tujuan',
          paragraphs: ['Tujuan RKT ini adalah menjamin operasionalisasi program strategis dalam periode 1 tahun.'],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '1.4 Sasaran',
          paragraphs: [\`Sasaran RKT ini mencakup seluruh aktivitas yang diproyeksikan pada \${result.context.planningYear}.\`],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('ProgramBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class ProgramBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const programsMap = new Map<string, { prog: string, obj: string, target: string }>();
    
    result.projections.forEach(p => {
        if (!programsMap.has(p.programId)) {
            programsMap.set(p.programId, {
                prog: p.programName,
                obj: p.strategicObjectiveId || 'Belum ditetapkan',
                target: p.target || 'Belum ditetapkan'
            });
        }
    });
    
    const tableData = Array.from(programsMap.values()).map((v, i) => ({
        'No': i + 1,
        'Program': v.prog,
        'Sasaran Strategis': v.obj,
        'Hasil yang Diharapkan': v.target
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': '-',
            'Program': 'Belum tersedia program',
            'Sasaran Strategis': '-',
            'Hasil yang Diharapkan': '-'
        });
    }

    return {
      id: generateId('ChapterII'),
      title: 'BAB II: Program Kerja Tahunan',
      sections: [
        {
          id: generateId('Section'),
          title: '2.1 Program dan Sasaran Strategis',
          paragraphs: ['Berikut adalah daftar program kerja beserta sasaran strategis dan hasil yang diharapkan.'],
          tables: [{ title: 'Daftar Program Kerja Tahunan', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('ActivityBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class ActivityBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const tableData = result.projections.map((p, i) => ({
        'No': i + 1,
        'Program': p.programName,
        'Kegiatan': p.activityName,
        'Target': p.target,
        'Indikator Keberhasilan': p.successIndicator,
        'Penanggung Jawab': p.personInCharge,
        'Tahun Implementasi': p.implementationYear,
        'Semester': p.semester,
        'Kuartal': p.quarter,
        'Prioritas': 'Sesuai Penugasan',
        'Status': 'Direncanakan'
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': '-',
            'Program': 'Belum tersedia kegiatan',
            'Kegiatan': '-',
            'Target': '-',
            'Indikator Keberhasilan': '-',
            'Penanggung Jawab': '-',
            'Tahun Implementasi': '-',
            'Semester': '-',
            'Kuartal': '-',
            'Prioritas': '-',
            'Status': '-'
        });
    }

    return {
      id: generateId('ChapterIII'),
      title: 'BAB III: Rencana Kegiatan Rinci',
      sections: [
        {
          id: generateId('Section'),
          title: '3.1 Rincian Kegiatan',
          paragraphs: ['Rincian kegiatan yang akan dilaksanakan berdasarkan proyeksi RKJM adalah sebagai berikut.'],
          tables: [{ title: 'Pemetaan Rincian Kegiatan', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('BudgetBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class BudgetBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const tableData = result.projections.map((p, i) => ({
        'No': i + 1,
        'Kegiatan': p.activityName,
        'Referensi Anggaran': p.budgetReference,
        'Sumber Dana': 'BOS/Lainnya (Sesuai Referensi)',
        'Estimasi Biaya': p.budgetReference,
        'Catatan Anggaran': 'Proyeksi'
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': '-',
            'Kegiatan': 'Belum tersedia kegiatan',
            'Referensi Anggaran': '-',
            'Sumber Dana': '-',
            'Estimasi Biaya': '-',
            'Catatan Anggaran': '-'
        });
    }

    return {
      id: generateId('ChapterIV'),
      title: 'BAB IV: Rencana Anggaran',
      sections: [
        {
          id: generateId('Section'),
          title: '4.1 Pemetaan Anggaran Kegiatan',
          paragraphs: ['Perkiraan kebutuhan anggaran untuk melaksanakan setiap kegiatan adalah sebagai berikut.'],
          tables: [{ title: 'Pemetaan Rencana Anggaran', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('MonitoringBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class MonitoringBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const tableData = result.projections.map((p, i) => ({
        'No': i + 1,
        'Kegiatan': p.activityName,
        'Referensi Monitoring': p.monitoringReference,
        'Indikator Keberhasilan': p.successIndicator,
        'Bukti Dukung': 'Dokumen Laporan/Foto',
        'Jadwal Evaluasi': \`Semester \${p.semester} / Kuartal \${p.quarter}\`,
        'Penanggung Jawab': p.personInCharge
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': '-',
            'Kegiatan': 'Belum tersedia kegiatan',
            'Referensi Monitoring': '-',
            'Indikator Keberhasilan': '-',
            'Bukti Dukung': '-',
            'Jadwal Evaluasi': '-',
            'Penanggung Jawab': '-'
        });
    }

    return {
      id: generateId('ChapterV'),
      title: 'BAB V: Monitoring dan Evaluasi',
      sections: [
        {
          id: generateId('Section'),
          title: '5.1 Perencanaan Evaluasi',
          paragraphs: ['Instrumen dan jadwal pemantauan yang akan digunakan untuk mengevaluasi capaian RKT.'],
          tables: [{ title: 'Pemetaan Monitoring Kegiatan', data: tableData }],
          figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}
`);

write('ScheduleBuilder.ts', `
import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId } from './utils';

export class ScheduleBuilder {
  public build(result: RKTProjectionResult): DocumentChapter {
    const tableData = result.projections.map((p, i) => ({
        'No': i + 1,
        'Kegiatan': p.activityName,
        'Jadwal': \`S\${p.semester} / Q\${p.quarter}\`
    }));

    if (tableData.length === 0) {
        tableData.push({
            'No': '-',
            'Kegiatan': 'Belum tersedia jadwal',
            'Jadwal': '-'
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
`);

write('AppendixBuilder.ts', `
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
`);

write('RKTDocumentBuilder.ts', `
import { DocumentModel, DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';

import { CoverBuilder } from './CoverBuilder';
import { ApprovalBuilder } from './ApprovalBuilder';
import { IntroductionBuilder } from './IntroductionBuilder';
import { ProgramBuilder } from './ProgramBuilder';
import { ActivityBuilder } from './ActivityBuilder';
import { BudgetBuilder } from './BudgetBuilder';
import { MonitoringBuilder } from './MonitoringBuilder';
import { AppendixBuilder } from './AppendixBuilder';

export class RKTDocumentBuilder {
  private coverBuilder = new CoverBuilder();
  private approvalBuilder = new ApprovalBuilder();
  private introBuilder = new IntroductionBuilder();
  private programBuilder = new ProgramBuilder();
  private activityBuilder = new ActivityBuilder();
  private budgetBuilder = new BudgetBuilder();
  private monitoringBuilder = new MonitoringBuilder();
  private appendixBuilder = new AppendixBuilder();

  public buildDocument(result: RKTProjectionResult, schoolIdentity: any): DocumentModel {
    const cover = this.coverBuilder.build(result, schoolIdentity);
    const approval = this.approvalBuilder.build(result);
    const toc: DocumentChapter = {
        id: 'TOC',
        title: 'Daftar Isi',
        sections: [], paragraphs: [], tables: [], figures: [], references: [], metadata: {}
    };
    const chapter1 = this.introBuilder.build(result);
    const chapter2 = this.programBuilder.build(result);
    const chapter3 = this.activityBuilder.build(result);
    const chapter4 = this.budgetBuilder.build(result);
    const chapter5 = this.monitoringBuilder.build(result);
    const appendix = this.appendixBuilder.build(result);

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
`);

write('index.ts', `
export * from './RKTDocumentBuilder';
export * from './CoverBuilder';
export * from './ApprovalBuilder';
export * from './IntroductionBuilder';
export * from './ProgramBuilder';
export * from './ActivityBuilder';
export * from './BudgetBuilder';
export * from './MonitoringBuilder';
export * from './ScheduleBuilder';
export * from './AppendixBuilder';
`);
