import { DocumentModel, DocumentChapter, DocumentSection } from '../../../DocumentCompositionEngine/DocumentModel';
import { 
  CanonicalDocument, 
  DocumentSection as CanonicalSection, 
  DocumentBlock, 
  HeadingBlock, 
  ParagraphBlock, 
  TableBlock,
  TableRowNode,
  TableCellNode,
  ContainerBlock,
  ListBlock,
  ListItemNode,
  TextNode,
  PageBreakBlock
} from '../CanonicalDocumentTypes';
import { BaseDocumentAssembler, uuidv4 } from '../adapters/BaseDocumentAssembler';

export class RktDocumentAssembler extends BaseDocumentAssembler {
  static assemble(model: DocumentModel, settings: any, meta: any): CanonicalDocument {
    const sections: CanonicalSection[] = [];
    
    // 1. Cover
    if (model.cover) {
      sections.push(this.processCover(model.cover, settings, meta, "RENCANA KERJA TAHUNAN (RKT)"));
    }

    // 2. Approval
    if (model.approval) {
      sections.push(this.processApproval(model.approval, settings, meta));
    }

    // Kata Pengantar / TOC
    if (model.toc) {
      const tocSection = this.processChapterBase(model.toc, 'TOC');
      ((tocSection as any).title) = 'Daftar Isi';
      ((tocSection as any).blocks) = [
        {
          id: `toc-container-${uuidv4()}`,
          type: 'CONTAINER',
          layoutStyle: 'TOC_CONTAINER',
          blocks: this.generateTocBlocks(model)
        }
      ];
      sections.push(tocSection);
    }
    
    // Chapters
    // For RKT, we might have specific target/metric tables or timeline tables. 
    // We will use a custom hook if needed, otherwise fallback to generic.
    const rktSectionHook = (section: any) => {
      const blocks: DocumentBlock[] = [];
      // GAP: RKT specific visual mappings like Gantt Chart or Timeline might be missing in CanonicalRenderer
      // We will fallback to generic tables for now.
      if (section.metadata?.rktTargets) {
         // Placeholder for mapping rktTargets to CanonicalDocument
         // blocks.push(this.createRktTargetTable(section.metadata.rktTargets));
      }
      return blocks;
    };

    if (model.chapter1) sections.push(this.processChapterBase(model.chapter1, 'chapter1', this.convertTable, rktSectionHook));
    if (model.chapter2) sections.push(this.processChapterBase(model.chapter2, 'chapter2', this.convertTable, rktSectionHook));
    if (model.chapter3) sections.push(this.processChapterBase(model.chapter3, 'chapter3', this.convertTable, rktSectionHook));
    if (model.chapter4) sections.push(this.processChapterBase(model.chapter4, 'chapter4', this.convertTable, rktSectionHook));
    if (model.chapter5) sections.push(this.processChapterBase(model.chapter5, 'chapter5', this.convertTable, rktSectionHook));
    
    if (model.appendix) sections.push(this.processChapterBase(model.appendix, 'appendix', this.convertTable, rktSectionHook));
    
    return {
      id: uuidv4(),
      metadata: {
        documentId: 'rkt',
        title: meta.title || "Dokumen RKT",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        draftingTeam: []
      },
      sections
    };
  }

  private static convertTable(t: any): DocumentBlock | null {
    if (t.type === 'signature_block') return null; // Handle signatures specifically if needed
    
    // Custom handling for RKT specific structures
    // E.g., Timeline or Rencana Kegiatan
    if (t.type === 'rkt_timeline' || t.timeline) {
        // GAP: We do not have a TIMELINE_VIEW layout style in CanonicalRenderer yet.
        // We fallback to a generic table representation.
        if (Array.isArray(t.data) && t.data.length > 0) {
            return RktDocumentAssembler.createGenericTable(t.data);
        }
    } else if (t.program || (t.title && t.title.startsWith('Program:'))) {
        // We can reuse the CARD_CONTAINER layout style from RKJM if it exists and makes sense,
        // but to ensure we do not touch CanonicalRenderer or RKJM, we might just map it to CARD_CONTAINER
        // since the renderer already supports it, even if it's currently hardcoded with RKJM domain terms.
        
        if (t.program) {
            return this.buildCardContainer(
                t.program,
                t.description,
                "Rencana Kegiatan Tahunan:",
                t.activities || [],
                (data: any) => [
                    this.buildMetricsGrid([
                        { label: 'Target Output:', value: data.output || '' },
                        { label: 'Waktu Pelaksanaan:', value: data.timeline || '' },
                        { label: 'Penanggung Jawab:', value: data.pic || '' },
                        { label: 'Anggaran:', value: data.budget ? `Rp ${data.budget.toLocaleString('id-ID')}` : '-' }
                    ])
                ]
            );
        } else if (Array.isArray(t.data) && t.data.length > 0) {
            return RktDocumentAssembler.createGenericTable(t.data);
        }
    } else if (t.amount !== undefined) { 
         return {
            id: uuidv4(),
            type: 'PARAGRAPH',
            nodes: [{ type: 'TEXT', id: uuidv4(), text: `${t.title}: Rp ${t.amount.toLocaleString('id-ID')}` }]
         };
    } else if (Array.isArray(t.data) && t.data.length > 0) {
         return RktDocumentAssembler.createGenericTable(t.data);
    }
    
    return null;
  }
}
