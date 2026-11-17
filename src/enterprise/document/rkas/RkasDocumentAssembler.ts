import { DocumentModel } from '../../../DocumentCompositionEngine/DocumentModel';
import { CanonicalDocument, DocumentSection as CanonicalSection } from '../CanonicalDocumentTypes';
import { BaseDocumentAssembler, uuidv4 } from '../adapters/BaseDocumentAssembler';

export class RkasDocumentAssembler extends BaseDocumentAssembler {
  static assemble(model: DocumentModel, settings: any, meta: any): CanonicalDocument {
    const sections: CanonicalSection[] = [];
    
    // 1. Cover
    if (model.cover) {
      sections.push(this.processCover(model.cover, settings, meta, "RENCANA KEGIATAN DAN ANGGARAN SEKOLAH (RKAS)"));
    }

    // 2. Approval
    if (model.approval) {
      sections.push(this.processApproval(model.approval, settings, meta));
    }

    // 3. Daftar Isi / TOC
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

    const rkasSectionHook = (section: any) => {
      // GAP: We can map specific RKAS metadata to Canonical Blocks here if needed.
      return [];
    };

    // 4. Chapters
    if (model.chapter1) sections.push(this.processChapterBase(model.chapter1, 'chapter1', undefined, rkasSectionHook));
    if (model.chapter2) sections.push(this.processChapterBase(model.chapter2, 'chapter2', undefined, rkasSectionHook));
    if (model.chapter3) sections.push(this.processChapterBase(model.chapter3, 'chapter3', undefined, rkasSectionHook));
    if (model.chapter4) sections.push(this.processChapterBase(model.chapter4, 'chapter4', undefined, rkasSectionHook));
    if (model.chapter5) sections.push(this.processChapterBase(model.chapter5, 'chapter5', undefined, rkasSectionHook));
    
    // 5. Appendix
    if (model.appendix) sections.push(this.processChapterBase(model.appendix, 'appendix', undefined, rkasSectionHook));

    return {
      id: uuidv4(),
      metadata: {
        documentId: 'rkas',
        title: meta.title || "Dokumen RKAS",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        draftingTeam: []
      },
      sections
    };
  }
}
