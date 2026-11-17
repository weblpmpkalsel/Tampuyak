import { DocumentSection, DocumentBlock, HeadingBlock, LinkNode, ParagraphBlock, ContainerBlock } from '../../CanonicalDocumentTypes';

/**
 * Builds the Table of Contents section dynamically based on the provided document sections.
 * 
 * Enforces Architectural Rules:
 * - Production Rule 021 (implied): Automatic hierarchy and no hardcoded chapter numbering.
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes (Publisher handles pagination).
 */
export function buildKspTocSection(sections: readonly DocumentSection[]): DocumentSection {
  const blocks: DocumentBlock[] = [];

  // Main Title
  blocks.push({
    id: 'toc-heading-main-title',
    type: 'HEADING',
    layoutStyle: 'TOC_TITLE',
    level: 1,
    nodes: [{ id: 'toc-text-main-title', type: 'TEXT', text: 'DAFTAR ISI' }]
  });

  // Build the hierarchy
  for (const section of sections) {
    if (section.chapterId === 'TOC' || section.chapterId === 'COVER' || section.chapterId === 'APPROVAL') continue;

    // 1. Section Level (e.g. BAB I)
    const sectionLink: LinkNode = {
      id: `toc-link-${section.id}`,
      type: 'LINK',
      url: section.id,
      nodes: [{ id: `toc-text-${section.id}`, type: 'TEXT', text: section.title }]
    };

    const sectionParagraph: ParagraphBlock = {
      id: `toc-paragraph-${section.id}`,
      type: 'PARAGRAPH',
      layoutStyle: 'TOC_ITEM_LEVEL_1',
      nodes: [sectionLink]
    };

    // 2. Headings Level (e.g. A, B, C)
    const headings = extractHeadings(section.blocks);
    
    if (headings.length > 0) {
      const headingBlocks: DocumentBlock[] = [];
      
      for (const heading of headings) {
        const headingText = extractText(heading.nodes);
        const headingLink: LinkNode = {
          id: `toc-link-${heading.id}`,
          type: 'LINK',
          url: heading.id,
          nodes: [{ id: `toc-text-${heading.id}`, type: 'TEXT', text: headingText }]
        };

        headingBlocks.push({
          id: `toc-paragraph-${heading.id}`,
          type: 'PARAGRAPH',
          layoutStyle: 'TOC_ITEM_LEVEL_2',
          nodes: [headingLink]
        });
      }

      // Group section and its children in a container to explicitly store hierarchy
      blocks.push({
        id: `toc-container-${section.id}`,
        type: 'CONTAINER',
        blocks: [sectionParagraph, ...headingBlocks]
      });
    } else {
      // No children, just push the section
      blocks.push(sectionParagraph);
    }
  }

  return {
    id: 'toc-section-root',
    chapterId: 'TOC',
    title: 'Daftar Isi',
    blocks
  };
}

function extractHeadings(blocks: readonly DocumentBlock[]): HeadingBlock[] {
  const headings: HeadingBlock[] = [];
  for (const block of blocks) {
    if (block.type === 'HEADING' && (block as HeadingBlock).level > 1) {
      headings.push(block as HeadingBlock);
    } else if (block.type === 'CONTAINER') {
      headings.push(...extractHeadings((block as ContainerBlock).blocks));
    }
  }
  return headings;
}

function extractText(nodes: readonly any[]): string {
  return nodes.map(n => {
    if (n.type === 'TEXT') return n.text;
    if (n.nodes) return extractText(n.nodes);
    return '';
  }).join('');
}

