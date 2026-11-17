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

export class RkjmDocumentAssembler extends BaseDocumentAssembler {
  static assemble(model: DocumentModel, settings: any, meta: any): CanonicalDocument {
    const sections: CanonicalSection[] = [];
    
    // 1. Cover
    if (model.cover) {
      sections.push(this.processCover(model.cover, settings, meta, "RENCANA KERJA JANGKA MENENGAH (RKJM)"));
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
    const rkjmSectionHook = (section: any) => {
      const blocks: DocumentBlock[] = [];
      if (section.metadata?.targets) {
         blocks.push(this.createTargetTable(section.metadata.targets));
      }
      return blocks;
    };

    if (model.chapter1) sections.push(this.processChapterBase(model.chapter1, 'chapter1', this.convertTable, rkjmSectionHook));
    if (model.chapter2) sections.push(this.processChapterBase(model.chapter2, 'chapter2', this.convertTable, rkjmSectionHook));
    if (model.chapter3) sections.push(this.processChapterBase(model.chapter3, 'chapter3', this.convertTable, rkjmSectionHook));
    if (model.chapter4) sections.push(this.processChapterBase(model.chapter4, 'chapter4', this.convertTable, rkjmSectionHook));
    if (model.chapter5) sections.push(this.processChapterBase(model.chapter5, 'chapter5', this.convertTable, rkjmSectionHook));
    
    if (model.appendix) sections.push(this.processChapterBase(model.appendix, 'appendix', this.convertTable, rkjmSectionHook));
    
    return {
      id: uuidv4(),
      metadata: {
        documentId: 'rkjm',
        title: meta.title || "Dokumen RKJM",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        draftingTeam: []
      },
      sections
    };
  }

  private static createTargetTable(targets: any): TableBlock {
      const keys = ['Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4'];
      const vals = [
          targets.targetY1 ?? targets.y1 ?? '-',
          targets.targetY2 ?? targets.y2 ?? '-',
          targets.targetY3 ?? targets.y3 ?? '-',
          targets.targetY4 ?? targets.y4 ?? '-',
      ].map(v => typeof v === 'number' ? `${v}%` : String(v));
      
      return {
          id: uuidv4(),
          type: 'TABLE',
          columnStrategy: 'proportional',
          columnWidths: ['25%', '25%', '25%', '25%'],
          head: [{
              id: uuidv4(), type: 'TABLE_ROW', cells: keys.map(k => ({
                  id: uuidv4(), type: 'TABLE_CELL', nodes: [{ type: 'TEXT', id: uuidv4(), text: k }]
              }))
          }],
          body: [{
              id: uuidv4(), type: 'TABLE_ROW', cells: vals.map(v => ({
                  id: uuidv4(), type: 'TABLE_CELL', nodes: [{ type: 'TEXT', id: uuidv4(), text: v }]
              }))
          }]
      };
  }

  private static convertTable(t: any): DocumentBlock | null {
    if (t.type === 'signature_block') return null; // Handle signatures specifically if needed
    
    // RKJM Specific Program/Activity table (rendered as Divs in Legacy)
    if (t.program || (t.title && t.title.startsWith('Program:'))) {
        if (t.program) {
            return this.buildCardContainer(
                t.program,
                t.description,
                "Rencana Kegiatan:",
                t.activities || [],
                (data: any) => [
                    this.buildMetricsGrid([
                        { label: 'Output:', value: data.output || '' },
                        { label: 'Outcome:', value: data.outcome || '' },
                        { label: 'Impact:', value: data.impact || '' },
                        { label: 'Risk & Mitigation:', value: '- \u2192 -' }
                    ])
                ]
            );
        } else if (Array.isArray(t.data) && t.data.length > 0) {
            // Activities Table
            return RkjmDocumentAssembler.createGenericTable(t.data);
        }
    } else if (t.amount !== undefined) {
         return {
            id: uuidv4(),
            type: 'PARAGRAPH',
            nodes: [{ type: 'TEXT', id: uuidv4(), text: `${t.title}: Rp ${t.amount.toLocaleString('id-ID')}` }]
         };
    } else if (Array.isArray(t.data) && t.data.length > 0) {
         return RkjmDocumentAssembler.createGenericTable(t.data);
    }
    
    return null;
  }
}
