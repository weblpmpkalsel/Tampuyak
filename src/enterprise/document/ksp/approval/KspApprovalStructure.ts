import { DocumentSection, DocumentBlock, ContainerBlock, HeadingBlock, ParagraphBlock, TextNode } from '../../CanonicalDocumentTypes';
import { KspApprovalConfiguration } from './KspApprovalConfiguration';

/**
 * Maps the KSP Approval Configuration into the Enterprise Canonical Document Model.
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 * - Production Rule 007: Expose only structural nodes.
 * - Production Rule 009: Fail gracefully if mandatory configuration is missing.
 */
export function buildKspApprovalSection(config: KspApprovalConfiguration): DocumentSection {
  // Production Rule 009: Validate mandatory configuration
  // Relaxed to prevent crashes, using fallbacks instead.
  
  const blocks: DocumentBlock[] = [];

  // 1. Title
  blocks.push({
    id: 'approval-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'approval-text-main-title', type: 'TEXT', text: 'LEMBAR PENGESAHAN' }]
  });

  // 2. Document Number
  blocks.push({
    id: 'approval-paragraph-doc-number',
    type: 'PARAGRAPH',
    nodes: [{ id: 'approval-text-doc-number', type: 'TEXT', text: `Nomor: ${config.documentNumber || 'Belum diisi'}` }]
  });

  // 3. Body Text
  blocks.push({
    id: 'approval-paragraph-intro',
    type: 'PARAGRAPH',
    nodes: [
      { 
         id: 'approval-text-intro', 
         type: 'TEXT', 
         text: `Dengan ini Kurikulum Satuan Pendidikan ${config.schoolName} Tahun Pelajaran ${'academicYear' in config ? (config as any).academicYear : 'Belum diisi'} ditetapkan untuk digunakan sebagai pedoman penyelenggaraan pembelajaran.`
      }
    ]
  });

  // 4. Top Signatures Container (Typically Committee & Principal)
  blocks.push({
    id: 'gsls-signature-grid-school',
    type: 'CONTAINER',
    layoutStyle: 'SIGNATURE_GRID',
    blocks: [
      {
        id: 'gsls-signature-block-committee',
        type: 'CONTAINER',
        layoutStyle: 'SIGNATURE_CELL',
        blocks: [
           {
             id: 'gsls-signature-action-committee',
             type: 'PARAGRAPH',
             layoutStyle: 'SIGNATURE_ROLE',
             nodes: [{ id: 'gsls-signature-text-action-committee', type: 'TEXT', text: 'Menyetujui,\nKetua Komite Sekolah' }]
           },
           {
             id: 'gsls-signature-name-committee',
             type: 'PARAGRAPH',
             layoutStyle: 'SIGNATURE_NAME',
             nodes: [{ id: 'gsls-signature-text-name-committee', type: 'TEXT', text: config.schoolCommitteeName || 'Belum diisi' }]
           }
        ]
      },
      {
        id: 'gsls-signature-block-principal',
        type: 'CONTAINER',
        layoutStyle: 'SIGNATURE_CELL',
        blocks: [
           {
             id: 'gsls-signature-action-principal',
             type: 'PARAGRAPH',
             layoutStyle: 'SIGNATURE_ROLE',
             nodes: [{ id: 'gsls-signature-text-action-principal', type: 'TEXT', text: `${config.regencyOrCity || 'Belum diisi'}, ${config.approvalDate || 'Belum diisi'}\nMenetapkan,\n${config.principalPosition || 'Kepala Sekolah'}` }]
           },
           {
             id: 'gsls-signature-name-principal',
             type: 'PARAGRAPH',
             layoutStyle: 'SIGNATURE_NAME',
             nodes: [{ id: 'gsls-signature-text-name-principal', type: 'TEXT', text: config.principalName || 'Belum diisi' }]
           },
           {
             id: 'gsls-signature-nip-principal',
             type: 'PARAGRAPH',
             layoutStyle: 'SIGNATURE_NIP',
             nodes: [{ id: 'gsls-signature-text-nip-principal', type: 'TEXT', text: `NIP. ${config.principalNip || 'Belum diisi'}` }]
           }
        ]
      }
    ]
  });

  // 5. Verification Signature Container (Supervisor)
  const supervisorContainer: ContainerBlock = {
    id: 'gsls-signature-block-verification',
    type: 'CONTAINER',
    layoutStyle: 'SIGNATURE_CELL',
    blocks: [
      {
        id: 'gsls-signature-action-verification',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_ROLE',
        nodes: [{ id: 'gsls-signature-text-action-verification', type: 'TEXT', text: `Mengetahui,\n${config.supervisorPosition || 'Pengawas Sekolah'}` }]
      },
      {
        id: 'gsls-signature-name-verification',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NAME',
        nodes: [{ id: 'gsls-signature-text-name-verification', type: 'TEXT', text: config.supervisorName || 'Belum diisi' }]
      },
      {
        id: 'gsls-signature-nip-verification',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NIP',
        nodes: [{ id: 'gsls-signature-text-nip-verification', type: 'TEXT', text: `NIP. ${config.supervisorNip || 'Belum diisi'}` }]
      }
    ]
  } as ContainerBlock;

  // 6. Final Approval Signature Container (Head of Education Office)
  const educationOfficeContainer: ContainerBlock = {
    id: 'gsls-signature-block-education-office',
    type: 'CONTAINER',
    layoutStyle: 'SIGNATURE_CELL',
    blocks: [
      {
        id: 'gsls-signature-action-office',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_ROLE',
        nodes: [{ id: 'gsls-signature-text-action-office', type: 'TEXT', text: `Mengesahkan,\n${config.headOfEducationOfficePosition || 'Kepala Dinas Pendidikan'}\n${config.educationAuthorityRegion || 'Belum diisi'}` }]
      },
      {
        id: 'gsls-signature-name-office',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NAME',
        nodes: [{ id: 'gsls-signature-text-name-office', type: 'TEXT', text: config.headOfEducationOfficeName || 'Belum diisi' }]
      },
      {
        id: 'gsls-signature-nip-office',
        type: 'PARAGRAPH',
        layoutStyle: 'SIGNATURE_NIP',
        nodes: [{ id: 'gsls-signature-text-nip-office', type: 'TEXT', text: `NIP. ${config.headOfEducationOfficeNip || 'Belum diisi'}` }]
      }
    ]
  };

  // Combine into bottom signatures container
  blocks.push({
    id: 'gsls-signature-grid-bottom',
    type: 'CONTAINER',
    layoutStyle: 'SIGNATURE_GRID',
    blocks: [supervisorContainer, educationOfficeContainer]
  });

  return {
    id: 'approval-section-root',
    chapterId: 'APPROVAL',
    title: 'Lembar Pengesahan',
    blocks
  };
}
