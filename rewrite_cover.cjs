const fs = require('fs');

const content = `import { DocumentSection, DocumentBlock, HeadingBlock, ImageBlock, ParagraphBlock, TextNode, ContainerBlock } from '../../CanonicalDocumentTypes';
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

  // Group 1: Top (Title and Year)
  const topBlocks: DocumentBlock[] = [];
  topBlocks.push({
    id: 'cover-heading-main-title',
    type: 'HEADING',
    level: 1,
    nodes: [{ id: 'cover-text-main-title', type: 'TEXT', text: 'KURIKULUM SATUAN PENDIDIKAN' }]
  });
  topBlocks.push({
    id: 'cover-heading-academic-year',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'cover-text-academic-year', type: 'TEXT', text: \`TAHUN PELAJARAN \${config.academicYear}\` }]
  });
  
  blocks.push({
    id: 'cover-container-group-top',
    type: 'CONTAINER',
    blocks: topBlocks
  });

  // Group 2: Middle (Logo and School Identity)
  const middleBlocks: DocumentBlock[] = [];
  
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
  }
  middleBlocks.push({
    id: 'cover-container-logos',
    type: 'CONTAINER',
    blocks: logoBlocks
  });

  const identityBlocks: DocumentBlock[] = [];
  identityBlocks.push({
    id: 'cover-heading-school-name',
    type: 'HEADING',
    level: 2,
    nodes: [{ id: 'cover-text-school-name', type: 'TEXT', text: config.schoolName.toUpperCase() }]
  });
  if (config.schoolStatus) {
    identityBlocks.push({
      id: 'cover-heading-school-status',
      type: 'HEADING',
      level: 3,
      nodes: [{ id: 'cover-text-school-status', type: 'TEXT', text: config.schoolStatus }]
    });
  }
  identityBlocks.push({
    id: 'cover-heading-npsn',
    type: 'HEADING',
    level: 3,
    nodes: [{ id: 'cover-text-npsn', type: 'TEXT', text: \`NPSN: \${config.npsn}\` }]
  });
  middleBlocks.push({
    id: 'cover-container-identity',
    type: 'CONTAINER',
    blocks: identityBlocks
  });

  blocks.push({
    id: 'cover-container-group-middle',
    type: 'CONTAINER',
    blocks: middleBlocks
  });

  // Group 3: Bottom (Address and Footer)
  const bottomBlocks: DocumentBlock[] = [];
  
  const fullAddress = \`\${config.address}, \${config.village}, Kec. \${config.district}, \${config.regencyOrCity}, \${config.province}\`;
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
    nodes: [{ id: 'cover-text-education-office', type: 'TEXT', text: \`DINAS PENDIDIKAN \${config.educationAuthorityRegion.toUpperCase()}\` }]
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
    blocks: bottomBlocks
  });

  return {
    id: 'cover-section-root',
    chapterId: 'COVER',
    title: 'Cover',
    blocks
  };
}
`;

fs.writeFileSync('src/enterprise/document/ksp/cover/KspCoverStructure.ts', content);
console.log('Cover Structure updated');
