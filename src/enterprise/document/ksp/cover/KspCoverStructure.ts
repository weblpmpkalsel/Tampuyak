import { DocumentSection, DocumentBlock, HeadingBlock, ImageBlock, ParagraphBlock, TextNode, ContainerBlock } from '../../CanonicalDocumentTypes';
import { KspCoverConfiguration } from './KspCoverConfiguration';

/**
 * Maps the KSP Cover Configuration into the Enterprise Canonical Document Model.
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 */
export function buildKspCoverSection(config: KspCoverConfiguration): DocumentSection {
  const blocks: DocumentBlock[] = [];
  
  // Group 1: Logos (Top)
  const logoBlocks: DocumentBlock[] = [];
  if (config.schoolLogoUrl) {
    logoBlocks.push({
      id: 'cover-image-school-logo',
      type: 'IMAGE',
      url: config.schoolLogoUrl,
      altText: 'School Logo'
    });
  } else if (config.governmentLogoUrl) {
    logoBlocks.push({
      id: 'cover-image-gov-logo',
      type: 'IMAGE',
      url: config.governmentLogoUrl,
      altText: 'Government Education Logo'
    });
  } else {
    // Default fallback logo matching RKJM
    logoBlocks.push({
      id: 'cover-image-default-logo',
      type: 'IMAGE',
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg',
      altText: 'Default Logo'
    });
  }
  blocks.push({
    id: 'cover-container-logos',
    type: 'CONTAINER',
    layoutStyle: 'COVER_LOGOS',
    blocks: logoBlocks
  });

  // Group 2: Middle (Title, Year, School Identity)
  const middleBlocks: DocumentBlock[] = [];
  
  middleBlocks.push({
    id: 'cover-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'cover-text-main-title', type: 'TEXT', text: 'KURIKULUM SATUAN PENDIDIKAN' }]
  });
  middleBlocks.push({
    id: 'cover-heading-academic-year',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'cover-text-academic-year', type: 'TEXT', text: `TAHUN PELAJARAN ${config.academicYear}` }]
  });
  
  // Add some spacing or grouping if needed, but standard is just adding them to middleBlocks
  middleBlocks.push({
    id: 'cover-heading-school-name',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'cover-text-school-name', type: 'TEXT', text: config.schoolName.toUpperCase() }]
  });
  if (config.schoolStatus) {
    middleBlocks.push({
      id: 'cover-heading-school-status',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'cover-text-school-status', type: 'TEXT', text: config.schoolStatus }]
    });
  }
  middleBlocks.push({
    id: 'cover-heading-npsn',
    type: 'HEADING',
    level: 3,
    nodes: [{ id: 'cover-text-npsn', type: 'TEXT', text: `NPSN: ${config.npsn}` }]
  });

  blocks.push({
    id: 'cover-container-group-middle',
    type: 'CONTAINER',
    layoutStyle: 'COVER_MIDDLE',
    blocks: middleBlocks
  });

  // Group 3: Bottom (Address and Footer)
  const bottomBlocks: DocumentBlock[] = [];
  
  const fullAddress = `${config.address}, ${config.village}, Kec. ${config.district}, ${config.regencyOrCity}, ${config.province}`;
  bottomBlocks.push({
    id: 'cover-paragraph-address-block',
    type: 'PARAGRAPH',
    nodes: [{ id: 'cover-text-address-block', type: 'TEXT', text: fullAddress }]
  });

  const footerBlocks: DocumentBlock[] = [];
  footerBlocks.push({
    id: 'cover-heading-education-office',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'cover-text-education-office', type: 'TEXT', text: `DINAS PENDIDIKAN ${config.educationAuthorityRegion.toUpperCase()}` }]
  });
  footerBlocks.push({
    id: 'cover-heading-regency-city',
    type: 'HEADING',
    level: 3,
    nodes: [{ id: 'cover-text-regency-city', type: 'TEXT', text: config.regencyOrCity.toUpperCase() }]
  });
  const currentYear = new Date().getFullYear().toString();
  footerBlocks.push({
    id: 'cover-heading-year',
    type: 'HEADING',
    level: 3,
    nodes: [{ id: 'cover-text-year', type: 'TEXT', text: currentYear }]
  });
  bottomBlocks.push({
    id: 'cover-container-footer',
    type: 'CONTAINER',
    blocks: footerBlocks
  });

  blocks.push({
    id: 'cover-container-group-bottom',
    type: 'CONTAINER',
    layoutStyle: 'COVER_BOTTOM',
    blocks: bottomBlocks
  });

  return {
    id: 'cover-section-root',
    chapterId: 'COVER',
    title: 'Cover',
    blocks: [
      {
        id: 'cover-main-container',
        type: 'CONTAINER',
        layoutStyle: 'COVER_MAIN',
        blocks
      }
    ]
  };
}
