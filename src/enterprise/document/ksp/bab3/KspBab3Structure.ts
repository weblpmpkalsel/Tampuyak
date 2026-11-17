import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode, TableBlock, TableRowNode, TableCellNode, AttachmentBlock } from '../../CanonicalDocumentTypes';
import { CurriculumStructureKnowledge } from '../../../knowledge/models/curriculum/CurriculumStructureKnowledge';
import { AcademicCalendarKnowledge } from '../../../knowledge/builders/AcademicCalendarBuilder';
import { LearningLoadKnowledge } from '../../../knowledge/models/curriculum/LearningLoadKnowledge';
import { LearningOrganizationKnowledge } from '../../../knowledge/models/curriculum/LearningOrganizationKnowledge';
import { IntracurricularKnowledge } from '../../../knowledge/models/curriculum/IntracurricularKnowledge';
import { CocurricularKnowledge } from '../../../knowledge/models/curriculum/CocurricularKnowledge';
import { ExtracurricularKnowledge } from '../../../knowledge/models/curriculum/ExtracurricularKnowledge';


function normalizePhaseLabel(phase: string): string {
  if (!phase) return '';
  const trimmed = phase.trim();
  if (trimmed.toLowerCase().startsWith('fase')) {
    return trimmed;
  }
  return `Fase ${trimmed}`;
}

function generateLearningLoadRows(payload: any): any[] {
  const level = payload.educationLevel.toLowerCase();
  const rows: any[] = [];
  
  const createRow = (phase: string, kelas: string, index: number) => ({
    id: `bab3-tr-bb-${index}`,
    type: 'TABLE_ROW',
    cells: [
      { id: `bab3-tc-bb-${index}-1`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-1`, type: 'TEXT', text: phase }] },
      { id: `bab3-tc-bb-${index}-2`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-2`, type: 'TEXT', text: kelas }] },
      { id: `bab3-tc-bb-${index}-3`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-3`, type: 'TEXT', text: payload.effectiveWeeks.toString() }] },
      { id: `bab3-tc-bb-${index}-4`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-4`, type: 'TEXT', text: payload.weeklyLearningLoad.toString() }] },
      { id: `bab3-tc-bb-${index}-5`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-5`, type: 'TEXT', text: payload.annualLearningLoad.toString() }] },
      { id: `bab3-tc-bb-${index}-6`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-bb-${index}-6`, type: 'TEXT', text: '-' }] }
    ]
  });

  let index = 1;
  if (level.includes('sd') || level.includes('sekolah dasar') || level.includes('mi')) {
    rows.push(createRow('Fase A', 'Kelas I', index++));
    rows.push(createRow('Fase A', 'Kelas II', index++));
    rows.push(createRow('Fase B', 'Kelas III', index++));
    rows.push(createRow('Fase B', 'Kelas IV', index++));
    rows.push(createRow('Fase C', 'Kelas V', index++));
    rows.push(createRow('Fase C', 'Kelas VI', index++));
  } else if (level.includes('smp') || level.includes('mts')) {
    rows.push(createRow('Fase D', 'Kelas VII', index++));
    rows.push(createRow('Fase D', 'Kelas VIII', index++));
    rows.push(createRow('Fase D', 'Kelas IX', index++));
  } else if (level.includes('sma') || level.includes('smk') || level.includes('ma')) {
    rows.push(createRow('Fase E', 'Kelas X', index++));
    rows.push(createRow('Fase F', 'Kelas XI', index++));
    rows.push(createRow('Fase F', 'Kelas XII', index++));
  } else if (level.includes('paud') || level.includes('tk')) {
    rows.push(createRow('Fase Fondasi', 'TK A', index++));
    rows.push(createRow('Fase Fondasi', 'TK B', index++));
  } else {
    // fallback
    rows.push(createRow(payload.phase, payload.educationLevel, index++));
  }
  return rows;
}

export function buildKspBab3Section(
  structurePayload: CurriculumStructureKnowledge, 
  learningLoadPayload?: LearningLoadKnowledge,
  learningOrganizationPayload?: LearningOrganizationKnowledge,
  intracurricularPayload?: IntracurricularKnowledge,
  cocurricularPayload?: CocurricularKnowledge,
  extracurricularPayload?: ExtracurricularKnowledge,
  calendarPayload?: AcademicCalendarKnowledge
): DocumentSection {
  const blocks: DocumentBlock[] = [];

  // A. Struktur Kurikulum
  blocks.push({
    id: 'bab3-heading-struktur',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab3-text-heading-struktur', type: 'TEXT', text: 'A. Struktur Kurikulum' }]
  });

  const narrativeParts = [
    `Penyelenggaraan pendidikan pada jenjang ${structurePayload.payload.educationLevel} (${normalizePhaseLabel(structurePayload.payload.phase)}) secara sistematis diorganisasikan menggunakan kerangka ${structurePayload.payload.curriculumType}.`
  ];

  if (structurePayload.metadata.kemendikdasmenAligned) {
    narrativeParts.push('Struktur kurikulum ini disusun dengan berpedoman teguh pada standar dan ketentuan yang ditetapkan oleh Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen).');
  }

  if (structurePayload.metadata.deepLearningAligned) {
    narrativeParts.push('Pendekatan pembelajaran yang diterapkan berorientasi pada prinsip Deep Learning, yang mencakup pembelajaran sarat makna (Meaningful), disadari sepenuhnya (Mindful), dan menyenangkan (Joyful) bagi peserta didik.');
  }

  if (structurePayload.metadata.profilLulusanDimensions && structurePayload.metadata.profilLulusanDimensions.length > 0) {
    narrativeParts.push(`Pengembangan karakter secara terpadu difokuskan pada penguatan Dimensi Profil Lulusan, yang meliputi: ${structurePayload.metadata.profilLulusanDimensions.join(', ')}.`);
  }

  if (structurePayload.metadata.tujuhKebiasaan && structurePayload.metadata.tujuhKebiasaan.length > 0) {
    narrativeParts.push(`Serta pembiasaan nilai-nilai 7 Kebiasaan Anak Indonesia Hebat, yakni: ${structurePayload.metadata.tujuhKebiasaan.join(', ')}.`);
  }

  blocks.push({
    id: 'bab3-paragraph-struktur-1',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab3-text-struktur-1', 
      type: 'TEXT', 
      text: narrativeParts.join(' ') 
    }]
  });

  
  if (learningOrganizationPayload) {
    let philosophy = learningOrganizationPayload.payload.educationalPhilosophy;
    philosophy = philosophy.charAt(0).toLowerCase() + philosophy.slice(1);
    
    let principles = learningOrganizationPayload.payload.learningPrinciples;
    principles = principles.charAt(0).toLowerCase() + principles.slice(1);
    
    let strategy = learningOrganizationPayload.payload.implementationStrategy;
    strategy = strategy.charAt(0).toLowerCase() + strategy.slice(1);

    blocks.push({
      id: 'bab3-paragraph-lo-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-lo-1',
        type: 'TEXT',
        text: `Secara filosofis, ${philosophy} Hal ini sejalan dengan prinsip pembelajaran yang ${principles}`
      }]
    });

    blocks.push({
      id: 'bab3-paragraph-lo-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-lo-2',
        type: 'TEXT',
        text: `Strategi pelaksanaannya direalisasikan secara terstruktur, yaitu ${strategy} Evaluasi ketercapaian kompetensi diukur secara berkala dan berkesinambungan melalui ${learningOrganizationPayload.payload.assessmentApproach.toLowerCase()}`
      }]
    });
  }

  if (learningLoadPayload) {
    blocks.push({
      id: 'bab3-heading-beban-belajar',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-beban-belajar', type: 'TEXT', text: 'B. Beban Belajar' }]
    });

    blocks.push({
      id: 'bab3-paragraph-beban-belajar-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-beban-belajar-1',
        type: 'TEXT',
        text: `Pengaturan beban belajar untuk jenjang ${learningLoadPayload.payload.educationLevel} (${normalizePhaseLabel(learningLoadPayload.payload.phase)}) pada Tahun Ajaran ${learningLoadPayload.payload.academicYear} dirancang secara proporsional guna mengoptimalkan potensi peserta didik, selaras dengan tahapan perkembangan kognitif dan tingkat pendidikannya. Pengorganisasian muatan pembelajaran diuraikan secara rinci dengan mengalokasikan waktu yang mempertimbangkan efektivitas pencapaian standar kompetensi.`
      }]
    });

    blocks.push({
      id: 'bab3-paragraph-beban-belajar-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-beban-belajar-2',
        type: 'TEXT',
        text: `Berikut adalah penetapan alokasi beban belajar dalam satu tahun ajaran:`
      }]
    });

    blocks.push({
      id: 'bab3-table-beban-belajar',
      type: 'TABLE',
      head: [
        {
          id: 'bab3-tr-bb-head',
          type: 'TABLE_ROW',
          cells: [
            { id: 'bab3-tc-bb-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h1', type: 'TEXT', text: 'Fase' }] },
            { id: 'bab3-tc-bb-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h2', type: 'TEXT', text: 'Kelas' }] },
            { id: 'bab3-tc-bb-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h3', type: 'TEXT', text: 'Minggu Efektif' }] },
            { id: 'bab3-tc-bb-h4', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h4', type: 'TEXT', text: 'JP per Minggu' }] },
            { id: 'bab3-tc-bb-h5', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h5', type: 'TEXT', text: 'Total JP per Tahun' }] },
            { id: 'bab3-tc-bb-h6', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-bb-h6', type: 'TEXT', text: 'Keterangan' }] }
          ]
        }
      ],
      body: generateLearningLoadRows(learningLoadPayload.payload)
    } as any);

    blocks.push({
      id: 'bab3-paragraph-beban-belajar-closing',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-beban-belajar-closing',
        type: 'TEXT',
        text: `Total jam pembelajaran efektif yang direncanakan dalam satu tahun ajaran adalah ${learningLoadPayload.payload.totalLearningHours} JP. Pengelolaan waktu belajar ini diharapkan dapat memfasilitasi pencapaian target kurikulum secara menyeluruh dan berkesinambungan.`
      }]
    });
  }

  
  if (intracurricularPayload && intracurricularPayload.payload.subjects.length > 0) {
    blocks.push({
      id: 'bab3-heading-intracurricular',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-intracurricular', type: 'TEXT', text: 'C. Intrakurikuler' }]
    });

    blocks.push({
      id: 'bab3-paragraph-intracurricular-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-intracurricular-1',
        type: 'TEXT',
        text: 'Kegiatan pembelajaran intrakurikuler diselenggarakan secara terstruktur guna mencapai Standar Kompetensi Lulusan (SKL) pada setiap mata pelajaran. Pengorganisasian mata pelajaran dirancang sedemikian rupa agar pembelajaran berlangsung secara mendalam dan bermakna. Berikut adalah struktur mata pelajaran beserta alokasi waktu dan pendekatan pembelajaran yang diterapkan:'
      }]
    });

    const tableRows = intracurricularPayload.payload.subjects.map((sub, idx) => {
      return {
        id: `bab3-table-row-intra-${idx}`,
        type: 'TABLE_ROW',
        cells: [
          { id: `bab3-tc-intra-1-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-intra-1-${idx}`, type: 'TEXT', text: sub.subjectName }] },
          { id: `bab3-tc-intra-2-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-intra-2-${idx}`, type: 'TEXT', text: sub.phase }] },
          { id: `bab3-tc-intra-3-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-intra-3-${idx}`, type: 'TEXT', text: sub.weeklyLearningHours.toString() }] },
          { id: `bab3-tc-intra-4-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-intra-4-${idx}`, type: 'TEXT', text: sub.annualLearningHours.toString() }] },
          { id: `bab3-tc-intra-5-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-intra-5-${idx}`, type: 'TEXT', text: sub.learningApproach }] }
        ]
      };
    });

    blocks.push({
      id: 'bab3-table-intracurricular',
      type: 'TABLE',
      head: [
        {
          id: 'bab3-table-head-intra',
          type: 'TABLE_ROW',
          cells: [
            { id: 'bab3-tc-intra-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h1', type: 'TEXT', text: 'Mata Pelajaran' }] },
            { id: 'bab3-tc-intra-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h2', type: 'TEXT', text: 'Fase' }] },
            { id: 'bab3-tc-intra-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h3', type: 'TEXT', text: 'JP/Minggu' }] },
            { id: 'bab3-tc-intra-h4', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h4', type: 'TEXT', text: 'JP/Tahun' }] },
            { id: 'bab3-tc-intra-h5', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h5', type: 'TEXT', text: 'Pendekatan' }] }
          ]
        }
      ],
      body: tableRows
    } as any);

    blocks.push({
      id: 'bab3-paragraph-intracurricular-closing',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-intracurricular-closing',
        type: 'TEXT',
        text: `Pendekatan pembelajaran pada masing-masing mata pelajaran senantiasa disesuaikan dengan karakteristik muatan materi serta tingkat kesiapan peserta didik, guna memastikan ketercapaian tujuan pendidikan secara optimal.`
      }]
    });
  }

  
  if (cocurricularPayload) {
    blocks.push({
      id: 'bab3-heading-cocurricular',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-cocurricular', type: 'TEXT', text: 'D. Kokurikuler' }]
    });

    let ccObjectives = cocurricularPayload.payload.objectives;
    ccObjectives = ccObjectives.charAt(0).toLowerCase() + ccObjectives.slice(1);

    blocks.push({
      id: 'bab3-paragraph-cocurricular-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-cocurricular-1',
        type: 'TEXT',
        text: `Kegiatan kokurikuler direalisasikan melalui ${cocurricularPayload.payload.programIdentity}, yang secara khusus dirancang untuk memperkuat pencapaian kompetensi dan karakter peserta didik. Program ini memiliki sasaran utama untuk ${ccObjectives} Berikut adalah rincian kegiatan kokurikuler yang diselenggarakan:`
      }]
    });

    if (cocurricularPayload.payload.activities.length > 0) {
      const ccTableRows = cocurricularPayload.payload.activities.map((act, idx) => {
        return {
          id: `bab3-table-row-cc-${idx}`,
          type: 'TABLE_ROW',
          cells: [
            { id: `bab3-tc-cc-1-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-cc-1-${idx}`, type: 'TEXT', text: act.activityName }] },
            { id: `bab3-tc-cc-2-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-cc-2-${idx}`, type: 'TEXT', text: act.targetPhase }] },
            { id: `bab3-tc-cc-3-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-cc-3-${idx}`, type: 'TEXT', text: act.implementationTime }] },
            { id: `bab3-tc-cc-4-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-cc-4-${idx}`, type: 'TEXT', text: act.description }] }
          ]
        };
      });

      blocks.push({
        id: 'bab3-table-cocurricular',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-cc',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-tc-cc-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h1', type: 'TEXT', text: 'Nama Kegiatan' }] },
              { id: 'bab3-tc-cc-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h2', type: 'TEXT', text: 'Fase' }] },
              { id: 'bab3-tc-cc-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h3', type: 'TEXT', text: 'Waktu Pelaksanaan' }] },
              { id: 'bab3-tc-cc-h4', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h4', type: 'TEXT', text: 'Deskripsi' }] }
            ]
          }
        ],
        body: ccTableRows
      } as any);
    }
    
    let ccAssessment = cocurricularPayload.payload.assessment;
    ccAssessment = ccAssessment.charAt(0).toLowerCase() + ccAssessment.slice(1);
    let ccReflection = cocurricularPayload.payload.reflection;
    ccReflection = ccReflection.charAt(0).toLowerCase() + ccReflection.slice(1);

    blocks.push({
      id: 'bab3-paragraph-cocurricular-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-cocurricular-2',
        type: 'TEXT',
        text: `Guna mengukur efektivitas pelaksanaan program, strategi asesmen yang diterapkan adalah ${ccAssessment} Selanjutnya, proses evaluasi dan umpan balik diakomodasi melalui kegiatan refleksi, yaitu ${ccReflection}`
      }]
    });
  }

  if (extracurricularPayload) {
    blocks.push({
      id: 'bab3-heading-extracurricular',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-extracurricular', type: 'TEXT', text: 'E. Ekstrakurikuler' }]
    });

    const hasPrograms = extracurricularPayload.payload.mandatoryPrograms.length > 0 || 
                        extracurricularPayload.payload.optionalPrograms.length > 0 || 
                        extracurricularPayload.payload.routines.length > 0;

    if (!hasPrograms) {
      blocks.push({
        id: 'bab3-paragraph-extracurricular-empty',
        type: 'PARAGRAPH',
        nodes: [{ id: 'bab3-text-extracurricular-empty', type: 'TEXT', text: 'Belum tersedia' }]
      });
    } else {
      blocks.push({
        id: 'bab3-paragraph-extracurricular-1',
        type: 'PARAGRAPH',
        nodes: [{
          id: 'bab3-text-extracurricular-1',
          type: 'TEXT',
          text: 'Kegiatan ekstrakurikuler diselenggarakan sebagai wadah pengembangan potensi, minat, dan bakat peserta didik di luar jam intrakurikuler maupun kokurikuler. Program ini bertujuan untuk memberikan ruang berekspresi, mengasah keterampilan spesifik, serta menumbuhkan kemandirian. Berikut adalah rincian program ekstrakurikuler yang difasilitasi oleh satuan pendidikan:'
        }]
      });

      const allPrograms = [
        ...extracurricularPayload.payload.mandatoryPrograms.map(p => ({ type: 'Wajib', ...p })),
        ...extracurricularPayload.payload.optionalPrograms.map(p => ({ type: 'Pilihan', ...p })),
        ...extracurricularPayload.payload.routines.map(p => ({ type: 'Pembiasaan', name: p.name, description: p.frequency, targetHabits: p.targetHabits }))
      ];

      const exTableRows = allPrograms.map((prog, idx) => {
        return {
          id: `bab3-table-row-ex-${idx}`,
          type: 'TABLE_ROW',
          cells: [
            { id: `bab3-tc-ex-1-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-ex-1-${idx}`, type: 'TEXT', text: prog.type }] },
            { id: `bab3-tc-ex-2-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-ex-2-${idx}`, type: 'TEXT', text: prog.name }] },
            { id: `bab3-tc-ex-3-${idx}`, type: 'TABLE_CELL', nodes: [{ id: `bab3-t-ex-3-${idx}`, type: 'TEXT', text: prog.description }] }
          ]
        };
      });

      blocks.push({
        id: 'bab3-table-extracurricular',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-ex',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-tc-ex-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-ex-h1', type: 'TEXT', text: 'Kategori' }] },
              { id: 'bab3-tc-ex-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-ex-h2', type: 'TEXT', text: 'Nama Program' }] },
              { id: 'bab3-tc-ex-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-ex-h3', type: 'TEXT', text: 'Deskripsi / Frekuensi' }] }
            ]
          }
        ],
        body: exTableRows
      } as any);

      blocks.push({
        id: 'bab3-paragraph-extracurricular-closing',
        type: 'PARAGRAPH',
        nodes: [{
          id: 'bab3-text-extracurricular-closing',
          type: 'TEXT',
          text: 'Pelaksanaan seluruh kegiatan ekstrakurikuler senantiasa didampingi oleh pendidik atau pembina yang memiliki kompetensi di bidangnya, dengan jadwal pelaksanaan yang diatur secara sistematis agar selaras dengan kegiatan akademik utama.'
        }]
      });
    }
  }

  // 2. Kalender Akademik (Preserving existing logic)
  if (calendarPayload) {
    blocks.push({
      id: 'bab3-heading-kalender',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-kalender', type: 'TEXT', text: 'F. Kalender Akademik' }]
    });

    blocks.push({
      id: 'bab3-paragraph-kalender-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-kalender-1',
        type: 'TEXT',
        text: `Kalender Akademik Tahun Pelajaran ${calendarPayload.academicYear} disusun sebagai acuan penjadwalan seluruh kegiatan pendidikan di satuan pendidikan selama satu tahun penuh. Penyusunan ini mempertimbangkan alokasi waktu pembelajaran secara efektif, yang mencakup ${calendarPayload.effectiveWeeks} minggu efektif serta ${calendarPayload.effectiveLearningDays} hari belajar efektif. Berikut adalah proyeksi rincian agenda dan kegiatan operasional selama tahun pelajaran:`
      }]
    });

    if (calendarPayload.events && calendarPayload.events.length > 0) {
      blocks.push({
        id: 'bab3-calendar-grid',
        type: 'CALENDAR_GRID',
        academicYear: calendarPayload.academicYear,
        events: calendarPayload.events
      } as any);

      blocks.push({
        id: 'bab3-paragraph-kalender-closing',
        type: 'PARAGRAPH',
        nodes: [{
          id: 'bab3-text-kalender-closing',
          type: 'TEXT',
          text: `Pelaksanaan jadwal dan agenda kegiatan dalam Kalender Akademik ini bersifat dinamis dengan tetap berpedoman pada alokasi waktu efektif yang telah diamanatkan. Penyesuaian secara terukur dapat dilakukan oleh satuan pendidikan dengan senantiasa mempertimbangkan kebijakan pemerintah daerah serta kondisi faktual lingkungan sekolah.`
        }]
      });
    }
  }

  return {
    id: 'bab3-section-root',
    chapterId: 'BAB_III',
    title: 'Pengorganisasian Pembelajaran',
    blocks
  };
}
