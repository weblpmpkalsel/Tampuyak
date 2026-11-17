import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode, AttachmentBlock, TableBlock } from '../../CanonicalDocumentTypes';
import { EvaluationKnowledge } from '../../../knowledge/builders/EvaluationBuilder';

export class IncompleteEvaluationKnowledgeError extends Error {
  constructor(public missingKnowledge: string[]) {
    super(`Missing mandatory Evaluation Knowledge: ${missingKnowledge.join(', ')}`);
    this.name = 'IncompleteEvaluationKnowledgeError';
  }
}

/**
 * Maps the Evaluation Knowledge Payload into the Enterprise Canonical Document Model for BAB V.
 */
export function buildKspBab5Section(payload: EvaluationKnowledge): DocumentSection {
  const blocks: DocumentBlock[] = [];

  // Main Chapter Title
  blocks.push({
    id: 'bab5-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'bab5-text-main-title', type: 'TEXT', text: 'EVALUASI, PENDAMPINGAN, DAN PENGEMBANGAN PROFESIONAL' }]
  });

  // A. Evaluasi Pembelajaran
  blocks.push({
    id: 'bab5-heading-eval',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-eval', type: 'TEXT', text: 'A. Evaluasi Pembelajaran' }]
  });
  blocks.push({
    id: 'bab5-paragraph-eval-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-eval-opening', type: 'TEXT', text: 'Evaluasi di tingkat satuan pendidikan dilaksanakan secara sistematis dan terstruktur untuk mengukur keberhasilan program pendidikan serta memastikan terwujudnya peningkatan mutu yang berkelanjutan.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-eval-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-eval-policy', type: 'TEXT', text: 'Kebijakan evaluasi difokuskan pada analisis ketercapaian Alur Tujuan Pembelajaran (ATP) dan efektivitas implementasi Modul Ajar, yang secara langsung merefleksikan kualitas penyelenggaraan kurikulum operasional.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-eval-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-eval-implementation', type: 'TEXT', text: 'Implementasi evaluasi diselenggarakan melalui evaluasi diri sekolah (EDS), asesmen capaian peserta didik, dan refleksi pedagogik oleh pendidik dengan mekanisme sebagai berikut:' }]
  });
  if (payload.evaluationMechanisms && payload.evaluationMechanisms.length > 0) {
    const evalItems: ListItemNode[] = payload.evaluationMechanisms.map((mechanism, index) => ({
      id: `bab5-list-item-eval-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab5-text-eval-${index}`, type: 'TEXT', text: mechanism }]
    }));
    blocks.push({
      id: 'bab5-list-eval',
      type: 'LIST',
      ordered: true,
      items: evalItems
    });
  }
  blocks.push({
    id: 'bab5-paragraph-eval-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-eval-closing', type: 'TEXT', text: `Pelaksanaan kegiatan evaluasi ini dijadwalkan secara berkala sesuai dengan ${payload.schedule || 'kalender akademik yang berlaku'}, serta dikoordinasikan oleh Kepala Sekolah bersama Tim Penjaminan Mutu Satuan Pendidikan.` }]
  });

  // B. Monitoring
  blocks.push({
    id: 'bab5-heading-monitoring',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-monitoring', type: 'TEXT', text: 'B. Monitoring' }]
  });
  blocks.push({
    id: 'bab5-paragraph-monitoring-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-monitoring-opening', type: 'TEXT', text: 'Monitoring merupakan instrumen penjaminan mutu internal (SPMI) yang esensial guna memastikan seluruh perencanaan pembelajaran direalisasikan sesuai dengan standar nasional pendidikan.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-monitoring-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-monitoring-policy', type: 'TEXT', text: payload.monitoringPolicy || 'Kebijakan monitoring diarahkan pada pengawasan proses manajerial dan operasional kegiatan belajar mengajar, mencakup kepatuhan administratif pendidik hingga optimalisasi fasilitas sekolah.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-monitoring-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-monitoring-implementation', type: 'TEXT', text: 'Strategi pelaksanaan monitoring dilakukan secara komprehensif yang melibatkan observasi lapangan, pemeriksaan dokumen administratif, dan survei kepuasan peserta didik. Berikut adalah matriks sasaran monitoring:' }]
  });
  
  // Official Table for Monitoring
  blocks.push({
    id: 'bab5-table-monitoring',
    type: 'TABLE',
    head: [
      {
        id: 'bab5-table-head-row',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab5-table-head-cell-1', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-head-text-1', type: 'TEXT', text: 'Area Monitoring' }] },
          { id: 'bab5-table-head-cell-2', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-head-text-2', type: 'TEXT', text: 'Fokus Evaluasi' }] },
          { id: 'bab5-table-head-cell-3', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-head-text-3', type: 'TEXT', text: 'Rencana Tindak Lanjut' }] }
        ]
      }
    ],
    body: [
      {
        id: 'bab5-table-body-row-1',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab5-table-cell-area-1', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-area-1', type: 'TEXT', text: 'Perencanaan Pembelajaran' }] },
          { id: 'bab5-table-cell-eval-1', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-eval-1', type: 'TEXT', text: 'Kesesuaian CP, ATP, dan Modul Ajar' }] },
          { id: 'bab5-table-cell-followup-1', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-followup-1', type: 'TEXT', text: 'Pendampingan penyusunan perangkat' }] }
        ]
      },
      {
        id: 'bab5-table-body-row-2',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab5-table-cell-area-2', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-area-2', type: 'TEXT', text: 'Proses Pembelajaran' }] },
          { id: 'bab5-table-cell-eval-2', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-eval-2', type: 'TEXT', text: 'Penerapan Pembelajaran Mendalam (Deep Learning)' }] },
          { id: 'bab5-table-cell-followup-2', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-followup-2', type: 'TEXT', text: 'Supervisi klinis dan lokakarya' }] }
        ]
      },
      {
        id: 'bab5-table-body-row-3',
        type: 'TABLE_ROW',
        cells: [
          { id: 'bab5-table-cell-area-3', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-area-3', type: 'TEXT', text: 'Penilaian Hasil Belajar' }] },
          { id: 'bab5-table-cell-eval-3', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-eval-3', type: 'TEXT', text: 'Validitas instrumen Asesmen Formatif/Sumatif' }] },
          { id: 'bab5-table-cell-followup-3', type: 'TABLE_CELL', nodes: [{ id: 'bab5-table-text-followup-3', type: 'TEXT', text: 'Validasi instrumen melalui KKG/MGMP' }] }
        ]
      }
    ]
  });

  blocks.push({
    id: 'bab5-paragraph-monitoring-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-monitoring-closing', type: 'TEXT', text: 'Hasil pemantauan ini menjadi dasar yang faktual dan obyektif dalam merumuskan rekomendasi perbaikan penyelenggaraan layanan pendidikan.' }]
  });

  // C. Supervisi Akademik
  blocks.push({
    id: 'bab5-heading-supervisi',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-supervisi', type: 'TEXT', text: 'C. Supervisi Akademik' }]
  });
  blocks.push({
    id: 'bab5-paragraph-supervisi-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-supervisi-opening', type: 'TEXT', text: 'Supervisi akademik diselenggarakan sebagai bentuk pembinaan profesional untuk mendampingi pendidik dalam meningkatkan kualitas kompetensi pedagogik dan profesional.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-supervisi-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-supervisi-policy', type: 'TEXT', text: payload.academicSupervision || 'Kebijakan supervisi akademik bergeser dari paradigma administratif menuju pendekatan pembinaan kolaboratif dan reflektif yang berpusat pada perbaikan kualitas interaksi pembelajaran di kelas.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-supervisi-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-supervisi-implementation', type: 'TEXT', text: 'Implementasi supervisi dilaksanakan melalui tahapan observasi klinis, diskusi reflektif pasca-observasi, dan pemberian umpan balik yang konstruktif.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-supervisi-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-supervisi-closing', type: 'TEXT', text: 'Kegiatan supervisi ini bukan sekadar evaluasi kinerja, melainkan sebuah siklus pendampingan (mentoring) berkesinambungan antara kepala sekolah, pengawas, dan guru.' }]
  });

  // D. Pengembangan Profesional
  blocks.push({
    id: 'bab5-heading-pengembangan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-pengembangan', type: 'TEXT', text: 'D. Pengembangan Profesional' }]
  });
  blocks.push({
    id: 'bab5-paragraph-pengembangan-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-pengembangan-opening', type: 'TEXT', text: 'Satuan pendidikan senantiasa berkomitmen untuk memfasilitasi peningkatan kapasitas sumber daya manusia sebagai motor penggerak utama transformasi pendidikan.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-pengembangan-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-pengembangan-policy', type: 'TEXT', text: 'Kebijakan pengembangan profesional menitikberatkan pada pemberdayaan Komunitas Belajar (Community of Practice) seperti Kelompok Kerja Guru (KKG) atau Musyawarah Guru Mata Pelajaran (MGMP) di tingkat satuan pendidikan.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-pengembangan-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-pengembangan-implementation', type: 'TEXT', text: 'Strategi pelaksanaan pengembangan keprofesian direalisasikan melalui in-house training (IHT), lokakarya penyusunan perangkat ajar, dan fasilitasi akses ke platform pelatihan mandiri. Adapun agenda utama meliputi:' }]
  });
  if (payload.professionalDevelopment && payload.professionalDevelopment.length > 0) {
    const profItems: ListItemNode[] = payload.professionalDevelopment.map((policy, index) => ({
      id: `bab5-list-item-prof-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab5-text-prof-${index}`, type: 'TEXT', text: policy }]
    }));
    blocks.push({
      id: 'bab5-list-prof',
      type: 'LIST',
      ordered: true,
      items: profItems
    });
  }
  blocks.push({
    id: 'bab5-paragraph-pengembangan-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-pengembangan-closing', type: 'TEXT', text: 'Dengan terselenggaranya pengembangan profesional ini, satuan pendidikan memastikan bahwa seluruh tenaga pendidik senantiasa adaptif terhadap perkembangan paradigma pendidikan nasional.' }]
  });

  // E. Tindak Lanjut
  blocks.push({
    id: 'bab5-heading-tindak-lanjut',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-tindak-lanjut', type: 'TEXT', text: 'E. Tindak Lanjut' }]
  });
  blocks.push({
    id: 'bab5-paragraph-tindak-lanjut-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-tindak-lanjut-opening', type: 'TEXT', text: 'Evaluasi dan monitoring tidak akan berdampak tanpa adanya rencana tindak lanjut yang terstruktur dan responsif terhadap temuan di lapangan.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-tindak-lanjut-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-tindak-lanjut-policy', type: 'TEXT', text: payload.continuousImprovement || 'Kebijakan tindak lanjut didasarkan pada prinsip Perbaikan Berkelanjutan (Continuous Improvement) yang mengintegrasikan data evaluasi ke dalam perencanaan Rencana Kerja Sekolah (RKS) tahun berikutnya.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-tindak-lanjut-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-tindak-lanjut-implementation', type: 'TEXT', text: payload.followUpPlanning || 'Implementasi tindak lanjut berupa modifikasi strategi kurikuler, pengadaan fasilitas pendukung yang tepat sasaran, serta restrukturisasi alokasi anggaran penjaminan mutu.' }]
  });
  blocks.push({
    id: 'bab5-paragraph-tindak-lanjut-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab5-text-tindak-lanjut-closing', type: 'TEXT', text: 'Rangkaian tindak lanjut ini dikomunikasikan secara transparan kepada seluruh pemangku kepentingan untuk menjaga komitmen bersama dalam mewujudkan iklim pendidikan yang berkualitas.' }]
  });

  // F. Lampiran Dokumen Individu Pendidik
  blocks.push({
    id: 'bab5-heading-lampiran',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab5-text-heading-lampiran', type: 'TEXT', text: 'Lampiran Dokumen Penilaian Kinerja Guru' }]
  });
  blocks.push({
    id: 'bab5-paragraph-lampiran',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab5-text-lampiran', 
      type: 'TEXT', 
      text: 'Format dan rekaman penilaian kinerja pendidik, portofolio individu, serta jurnal refleksi dikelola terpisah sebagai administrasi pendidik melalui integrasi sistem manajemen.' 
    }]
  });
  blocks.push({
    id: 'bab5-attachment-teacher-assessment',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/kinerja',
    filename: 'Lampiran_Penilaian_Kinerja_Guru.pdf',
    mimeType: 'application/pdf'
  });

  return {
    id: 'bab5-section-root',
    chapterId: 'BAB_V',
    title: 'Evaluasi, Pendampingan dan Pengembangan Profesional',
    blocks
  };
}
