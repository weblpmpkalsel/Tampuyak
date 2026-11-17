import { DocumentSection, DocumentBlock, HeadingBlock, ParagraphBlock, TextNode, ListBlock, ListItemNode, AttachmentBlock } from '../../CanonicalDocumentTypes';
import { LearningPolicyKnowledge } from '../../../knowledge/builders/LearningPolicyBuilder';

export function buildKspBab4Section(payload: LearningPolicyKnowledge): DocumentSection {
  const blocks: DocumentBlock[] = [];

  blocks.push({
    id: 'bab4-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'bab4-text-main-title', type: 'TEXT', text: 'PERENCANAAN PEMBELAJARAN' }]
  });

  // A. Prinsip Pembelajaran
  blocks.push({
    id: 'bab4-heading-prinsip',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-prinsip', type: 'TEXT', text: 'A. Prinsip Pembelajaran' }]
  });
  blocks.push({
    id: 'bab4-paragraph-prinsip-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-prinsip-opening', type: 'TEXT', text: 'Satuan pendidikan menyelenggarakan proses pendidikan dengan berpedoman pada prinsip pembelajaran yang holistik dan berpusat pada peserta didik. Prinsip-prinsip ini dirancang untuk mewujudkan iklim akademik yang kondusif dan bermakna.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-prinsip-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-prinsip-policy', type: 'TEXT', text: 'Kebijakan penyelenggaraan pembelajaran dilaksanakan dengan memastikan setiap aktivitas terhubung langsung dengan Capaian Pembelajaran (CP) serta penguatan Dimensi Profil Lulusan dan 7 Kebiasaan Anak Indonesia Hebat.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-prinsip-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-prinsip-implementation', type: 'TEXT', text: 'Strategi implementasi prinsip pembelajaran diuraikan melalui pilar-pilar berikut:' }]
  });
  if (payload.principles && payload.principles.length > 0) {
    const prinsipItems: ListItemNode[] = payload.principles.map((prinsip, index) => ({
      id: `bab4-list-item-prinsip-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab4-text-prinsip-${index}`, type: 'TEXT', text: prinsip }]
    }));
    blocks.push({
      id: 'bab4-list-prinsip',
      type: 'LIST',
      ordered: true,
      items: prinsipItems
    });
  }
  blocks.push({
    id: 'bab4-paragraph-prinsip-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-prinsip-closing', type: 'TEXT', text: 'Seluruh prinsip pembelajaran tersebut secara konsisten menjadi landasan bagi pendidik dalam merancang dan mengevaluasi kegiatan intrakurikuler, kokurikuler, maupun ekstrakurikuler.' }]
  });

  // B. Pendekatan Pembelajaran
  blocks.push({
    id: 'bab4-heading-pendekatan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-pendekatan', type: 'TEXT', text: 'B. Pendekatan Pembelajaran' }]
  });
  blocks.push({
    id: 'bab4-paragraph-pendekatan-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-pendekatan-opening', type: 'TEXT', text: 'Dalam upaya menstimulasi perkembangan kognitif, afektif, dan psikomotorik peserta didik, satuan pendidikan menerapkan pendekatan pembelajaran yang interaktif dan adaptif.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-pendekatan-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-pendekatan-policy', type: 'TEXT', text: payload.approach || 'Satuan pendidikan menggunakan pendekatan Pembelajaran Mendalam (Deep Learning) yang mencakup Meaningful, Mindful, dan Joyful Learning guna memastikan peserta didik menguasai esensi materi.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-pendekatan-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-pendekatan-implementation', type: 'TEXT', text: 'Pelaksanaan pendekatan ini diintegrasikan ke dalam penyusunan Modul Ajar dan diwujudkan melalui skenario pembelajaran yang berorientasi pada penyelesaian masalah, penemuan terbimbing, serta eksplorasi mandiri oleh peserta didik.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-pendekatan-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-pendekatan-closing', type: 'TEXT', text: 'Pendekatan yang diaplikasikan ini bertujuan mencetak lulusan yang tidak hanya unggul secara akademis, namun juga memiliki kedalaman karakter dan kesiapan menghadapi tantangan global.' }]
  });

  // C. Perencanaan Pembelajaran
  blocks.push({
    id: 'bab4-heading-perencanaan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-perencanaan', type: 'TEXT', text: 'C. Perencanaan Pembelajaran' }]
  });
  blocks.push({
    id: 'bab4-paragraph-perencanaan-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-perencanaan-opening', type: 'TEXT', text: 'Perencanaan pembelajaran disusun secara sistematis untuk menerjemahkan Capaian Pembelajaran (CP) ke dalam Alur Tujuan Pembelajaran (ATP) dan Modul Ajar yang aplikatif.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-perencanaan-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-perencanaan-policy', type: 'TEXT', text: payload.planningPolicy || 'Setiap pendidik diwajibkan menyusun perencanaan yang komprehensif sebelum pelaksanaan kegiatan belajar mengajar, dengan memperhatikan keragaman karakteristik dan tingkat kesiapan peserta didik.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-perencanaan-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-perencanaan-implementation', type: 'TEXT', text: 'Secara manajerial, perencanaan pembelajaran direalisasikan melalui kegiatan Kelompok Kerja Guru (KKG) atau Musyawarah Guru Mata Pelajaran (MGMP) tingkat sekolah untuk memastikan koherensi antar mata pelajaran.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-perencanaan-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-perencanaan-closing', type: 'TEXT', text: 'Dokumen perencanaan pembelajaran secara berkala ditinjau dan divalidasi oleh kepala sekolah beserta pengawas satuan pendidikan untuk menjamin kualitas dan kesesuaian dengan visi pendidikan.' }]
  });

  // D. Asesmen Pembelajaran
  blocks.push({
    id: 'bab4-heading-asesmen',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-asesmen', type: 'TEXT', text: 'D. Asesmen Pembelajaran' }]
  });
  blocks.push({
    id: 'bab4-paragraph-asesmen-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-asesmen-opening', type: 'TEXT', text: 'Asesmen pembelajaran dirancang sebagai alat ukur yang komprehensif, valid, dan reliabel untuk mengetahui kemajuan belajar peserta didik serta efektivitas proses pengajaran.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-asesmen-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-asesmen-policy', type: 'TEXT', text: 'Kebijakan asesmen menetapkan pelaksanaan evaluasi yang terpadu, mencakup Asesmen Formatif untuk perbaikan berkelanjutan, dan Asesmen Sumatif untuk penentuan ketercapaian kompetensi akhir.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-asesmen-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-asesmen-implementation', type: 'TEXT', text: 'Implementasi kebijakan asesmen dilaksanakan melalui mekanisme berikut:' }]
  });
  if (payload.assessmentPolicy && payload.assessmentPolicy.length > 0) {
    const asesmenItems: ListItemNode[] = payload.assessmentPolicy.map((asesmen, index) => ({
      id: `bab4-list-item-asesmen-${index}`,
      type: 'LIST_ITEM',
      nodes: [{ id: `bab4-text-asesmen-${index}`, type: 'TEXT', text: asesmen }]
    }));
    blocks.push({
      id: 'bab4-list-asesmen',
      type: 'LIST',
      ordered: false,
      items: asesmenItems
    });
  }
  blocks.push({
    id: 'bab4-paragraph-asesmen-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-asesmen-closing', type: 'TEXT', text: 'Hasil asesmen didokumentasikan dan dianalisis sebagai rujukan utama dalam penyusunan strategi intervensi, pengayaan, serta penyusunan pelaporan hasil belajar kepada orang tua.' }]
  });

  // E. Pemanfaatan Teknologi Digital
  blocks.push({
    id: 'bab4-heading-digital',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-digital', type: 'TEXT', text: 'E. Pemanfaatan Teknologi Digital' }]
  });
  blocks.push({
    id: 'bab4-paragraph-digital-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-digital-opening', type: 'TEXT', text: 'Optimalisasi pemanfaatan teknologi informasi dan komunikasi menjadi bagian integral dalam transformasi penyelenggaraan pembelajaran modern di satuan pendidikan.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-digital-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-digital-policy', type: 'TEXT', text: payload.digitalLearning || 'Satuan pendidikan memfasilitasi penggunaan platform digital yang edukatif, aman, dan relevan guna memperluas sumber belajar serta membekali peserta didik dengan kecakapan literasi digital.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-digital-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-digital-implementation', type: 'TEXT', text: 'Penerapan teknologi direalisasikan melalui integrasi media interaktif dalam Modul Ajar, penggunaan sistem manajemen pembelajaran (LMS) internal, dan penugasan berbasis portofolio digital.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-digital-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-digital-closing', type: 'TEXT', text: 'Pendekatan teknologi ini dirancang bukan sekadar sebagai alat bantu, melainkan sebagai ekosistem pendukung yang mendorong inovasi, kolaborasi, dan kemandirian belajar sepanjang hayat.' }]
  });

  // F. Pembelajaran Berdiferensiasi
  blocks.push({
    id: 'bab4-heading-diferensiasi',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-diferensiasi', type: 'TEXT', text: 'F. Pembelajaran Berdiferensiasi' }]
  });
  blocks.push({
    id: 'bab4-paragraph-diferensiasi-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-diferensiasi-opening', type: 'TEXT', text: 'Sebagai bentuk komitmen terhadap pendidikan inklusif, satuan pendidikan mengakomodasi keragaman profil belajar, minat, dan tingkat kesiapan peserta didik melalui pendekatan pembelajaran berdiferensiasi.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-diferensiasi-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-diferensiasi-policy', type: 'TEXT', text: payload.differentiationPolicy || 'Kebijakan berdiferensiasi diterapkan tanpa mengurangi standar ketuntasan, melainkan memberikan jalur dan ruang fleksibel bagi setiap individu untuk mencapai kompetensi maksimalnya.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-diferensiasi-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-diferensiasi-implementation', type: 'TEXT', text: 'Strategi pemenuhan kebutuhan belajar ini dikelola melalui pemetaan asesmen diagnostik, modifikasi konten materi, penyesuaian proses instruksional, serta fleksibilitas produk hasil belajar.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-diferensiasi-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-diferensiasi-closing', type: 'TEXT', text: 'Penyelenggaraan diferensiasi secara terstruktur diharapkan mampu meminimalisasi kesenjangan prestasi (achievement gap) dan menumbuhkan rasa percaya diri pada seluruh peserta didik.' }]
  });

  // G. Kemitraan Pembelajaran
  blocks.push({
    id: 'bab4-heading-kemitraan',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-kemitraan', type: 'TEXT', text: 'G. Kemitraan Pembelajaran' }]
  });
  blocks.push({
    id: 'bab4-paragraph-kemitraan-opening',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-kemitraan-opening', type: 'TEXT', text: 'Keberhasilan pencapaian visi dan misi pendidikan membutuhkan kolaborasi yang sinergis antara satuan pendidikan, keluarga, dan elemen masyarakat.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-kemitraan-policy',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-kemitraan-policy', type: 'TEXT', text: payload.partnershipPolicy || 'Satuan pendidikan secara aktif menjalin dan membina kemitraan pembelajaran (Tri Pusat Pendidikan) untuk mengintegrasikan keahlian profesional dan nilai sosial ke dalam ekosistem akademik.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-kemitraan-implementation',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-kemitraan-implementation', type: 'TEXT', text: 'Langkah strategis ini dilaksanakan melalui pelibatan orang tua dalam komite kelas, program guru tamu dari kalangan profesional, serta kolaborasi lintas sektoral dengan instansi pemerintah maupun swasta.' }]
  });
  blocks.push({
    id: 'bab4-paragraph-kemitraan-closing',
    type: 'PARAGRAPH',
    nodes: [{ id: 'bab4-text-kemitraan-closing', type: 'TEXT', text: 'Jaringan kemitraan yang solid akan senantiasa dioptimalkan sebagai sumber belajar otentik yang memperkaya pengalaman serta memperluas wawasan kebangsaan dan global peserta didik.' }]
  });

  // Teacher artifacts attachments
  blocks.push({
    id: 'bab4-heading-lampiran',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'bab4-text-heading-lampiran', type: 'TEXT', text: 'Lampiran Dokumen Perencanaan Pendidik' }]
  });
  blocks.push({
    id: 'bab4-paragraph-lampiran',
    type: 'PARAGRAPH',
    nodes: [{ 
      id: 'bab4-text-lampiran', 
      type: 'TEXT', 
      text: 'Format dan rekaman Modul Ajar, Alur Tujuan Pembelajaran (ATP), dan dokumen perencanaan spesifik pendidik dikelola terpisah sebagai administrasi pendidik melalui integrasi sistem manajemen.' 
    }]
  });
  blocks.push({
    id: 'bab4-attachment-modul-ajar',
    type: 'ATTACHMENT',
    uri: 'tampuyak://teacher-gateway/modul-ajar',
    filename: 'Lampiran_Contoh_Modul_Ajar.pdf',
    mimeType: 'application/pdf'
  });

  return {
    id: 'bab4-section-root',
    chapterId: 'BAB_IV',
    title: 'Perencanaan Pembelajaran',
    blocks
  };
}
