import { DocumentSection, DocumentBlock, CanonicalDocumentMetadata } from '../CanonicalDocumentTypes';

export interface PrefaceMetadata {
  schoolName: string;
  academicYear: string;
  regencyOrCity: string;
  approvalDate?: string;
  principalName: string;
  principalNip: string;
  principalPosition: string;
}

export function buildPrefaceSection(metadata: PrefaceMetadata): DocumentSection {
  const blocks: DocumentBlock[] = [];

  // Title
  blocks.push({
    id: 'preface-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'preface-text-main-title', type: 'TEXT', text: 'KATA PENGANTAR' }]
  });

  // Paragraph 1
  blocks.push({
    id: 'preface-paragraph-1',
    type: 'PARAGRAPH',
    nodes: [{ 
       id: 'preface-text-1', 
       type: 'TEXT', 
       text: `Puji syukur kami panjatkan kehadirat Tuhan Yang Maha Esa atas limpahan rahmat dan hidayah-Nya, sehingga penyusunan Kurikulum Satuan Pendidikan (KSP) ${metadata.schoolName || 'Belum diisi'} Tahun Ajaran ${metadata.academicYear || 'Belum diisi'} dapat diselesaikan dengan baik.`
    }]
  });

  // Paragraph 2
  blocks.push({
    id: 'preface-paragraph-2',
    type: 'PARAGRAPH',
    nodes: [{ 
       id: 'preface-text-2', 
       type: 'TEXT', 
       text: `Kurikulum Satuan Pendidikan ini disusun sebagai pedoman penyelenggaraan kegiatan pembelajaran dan pemenuhan standar nasional pendidikan di ${metadata.schoolName || 'Belum diisi'}. Penyusunan dokumen ini melibatkan berbagai pihak, mulai dari kepala sekolah, pendidik, tenaga kependidikan, hingga komite sekolah, dengan merujuk pada regulasi terbaru serta karakteristik dan kebutuhan peserta didik.`
    }]
  });

  // Paragraph 3
  blocks.push({
    id: 'preface-paragraph-3',
    type: 'PARAGRAPH',
    nodes: [{ 
       id: 'preface-text-3', 
       type: 'TEXT', 
       text: 'Kami menyadari bahwa dokumen ini masih memiliki ruang untuk penyempurnaan. Oleh karena itu, masukan dan saran konstruktif dari seluruh pemangku kepentingan sangat kami harapkan demi perbaikan layanan pendidikan di masa mendatang.'
    }]
  });

  // Paragraph 4
  blocks.push({
    id: 'preface-paragraph-4',
    type: 'PARAGRAPH',
    nodes: [{ 
       id: 'preface-text-4', 
       type: 'TEXT', 
       text: `Semoga Kurikulum Satuan Pendidikan ini dapat diimplementasikan secara optimal untuk mewujudkan tujuan pendidikan nasional serta visi dan misi ${metadata.schoolName || 'Belum diisi'}.`
    }]
  });

  // Signature Block
  blocks.push({
    id: 'gsls-signature-block-preface',
    type: 'CONTAINER',
    layoutStyle: 'SIGNATURE_CELL_RIGHT',
    blocks: [
      {
        id: 'gsls-signature-location-date-preface',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_ROLE',
        nodes: [{ 
           id: 'gsls-signature-text-location-date-preface', 
           type: 'TEXT', 
           text: `${metadata.regencyOrCity || 'Belum diisi'}, ${metadata.approvalDate || 'Belum diisi'}\n${metadata.principalPosition || 'Kepala Sekolah'}` 
         }]
      },
      {
        id: 'gsls-signature-name-preface',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NAME',
        nodes: [{ 
           id: 'gsls-signature-text-name-preface', 
           type: 'TEXT', 
           text: metadata.principalName || 'Belum diisi'
        }]
      },
      {
        id: 'gsls-signature-nip-preface',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NIP',
        nodes: [{ 
           id: 'gsls-signature-text-nip-preface', 
           type: 'TEXT', 
           text: `NIP. ${metadata.principalNip || 'Belum diisi'}` 
         }]
      }
    ]
  });

  return {
    id: 'preface-section-root',
    chapterId: 'FRONT_MATTER_PREFACE',
    title: 'Kata Pengantar',
    blocks
  };
}
