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

export const uuidv4 = () => Math.random().toString(36).substring(2, 9);

export abstract class BaseDocumentAssembler {
  protected static generateTocBlocks(model: DocumentModel): DocumentBlock[] {
    const blocks: DocumentBlock[] = [];
    
    blocks.push({
      id: uuidv4(),
      type: 'HEADING',
      level: 1,
      layoutStyle: 'TOC_TITLE',
      nodes: [{ type: 'TEXT', id: uuidv4(), text: 'DAFTAR ISI' }]
    });

    const addTocItem = (title: string, level: number, refId: string) => {
       blocks.push({
          id: uuidv4(),
          type: 'PARAGRAPH',
          layoutStyle: level === 1 ? 'TOC_ITEM_LEVEL_1' : 'TOC_ITEM_LEVEL_2',
          nodes: [
            {
               id: uuidv4(),
               type: 'LINK',
               url: refId,
               nodes: [{ type: 'TEXT', id: uuidv4(), text: title }]
            }
          ]
       });
    };

    if (model.approval) addTocItem('LEMBAR PENGESAHAN', 1, 'APPROVAL');
    addTocItem('DAFTAR ISI', 1, 'TOC');

    const chapters = [
      { key: 'chapter1', ref: 'chapter1' },
      { key: 'chapter2', ref: 'chapter2' },
      { key: 'chapter3', ref: 'chapter3' },
      { key: 'chapter4', ref: 'chapter4' },
      { key: 'chapter5', ref: 'chapter5' },
      { key: 'appendix', ref: 'appendix' }
    ];

    chapters.forEach(c => {
      const chapter = (model as any)[c.key] as DocumentChapter;
      if (chapter) {
         addTocItem(chapter.title || 'BAB', 1, c.ref);
         if (chapter.sections) {
            chapter.sections.forEach((sec, idx) => {
               if (sec.title) addTocItem(sec.title, 2, `${c.ref}-sec${idx}`);
            });
         }
      }
    });

    return blocks;
  }

  protected static processCover(chapter: DocumentChapter, settings: any, meta: any, defaultTitle: string): CanonicalSection {
    const docTitle = meta.title || defaultTitle;
    
    return {
      id: `cover-${uuidv4()}`,
      chapterId: 'COVER',
      title: 'Sampul',
      blocks: [
        {
          id: `cover-container-group-${uuidv4()}`,
          type: 'CONTAINER',
          layoutStyle: 'COVER_MAIN',
          blocks: [
            {
              id: `cover-container-logos-${uuidv4()}`,
              type: 'CONTAINER',
              layoutStyle: 'COVER_LOGOS',
              blocks: [
                {
                  id: `cover-logo-${uuidv4()}`,
                  type: 'IMAGE',
                  url: settings.dinas?.logo || "https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg",
                  altText: "Logo"
                }
              ]
            },
            {
              id: `cover-title-group-${uuidv4()}`,
              type: 'CONTAINER',
              layoutStyle: 'COVER_MIDDLE',
              blocks: [
                {
                  id: uuidv4(),
                  type: 'HEADING',
                  level: 1,
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: docTitle.toUpperCase() }]
                },
                {
                  id: uuidv4(),
                  type: 'HEADING',
                  level: 2,
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: `Tahun ${meta.activeYear || new Date().getFullYear()}` }]
                }
              ]
            },
            {
              id: `cover-school-group-${uuidv4()}`,
              type: 'CONTAINER',
              layoutStyle: 'COVER_BOTTOM',
              blocks: [
                {
                  id: uuidv4(),
                  type: 'PARAGRAPH',
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: `Nama Sekolah: ${settings.school?.name || ''}` }]
                },
                {
                  id: uuidv4(),
                  type: 'PARAGRAPH',
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: `NPSN: ${settings.school?.npsn || ''}` }]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  protected static processApproval(chapter: DocumentChapter, settings: any, meta: any): CanonicalSection {
    const blocks: DocumentBlock[] = [];
    
    blocks.push({
      id: uuidv4(),
      type: 'HEADING',
      level: 1,
      nodes: [{ type: 'TEXT', id: uuidv4(), text: "LEMBAR PENGESAHAN" }]
    });
    
    for (const p of chapter.paragraphs || []) {
      blocks.push({
        id: uuidv4(),
        type: 'PARAGRAPH',
        nodes: [{ type: 'TEXT', id: uuidv4(), text: p }]
      });
    }

    blocks.push({
      id: `approval-signatures-${uuidv4()}`,
      type: 'CONTAINER',
      layoutStyle: 'SIGNATURE_GRID',
      blocks: [
        {
          id: uuidv4(),
          type: 'CONTAINER',
          layoutStyle: 'SIGNATURE_CELL',
          blocks: [
            {
              id: uuidv4(),
              type: 'PARAGRAPH',
              layoutStyle: 'SIGNATURE_ROLE',
              nodes: [{ type: 'TEXT', id: uuidv4(), text: 'Menyetujui,\nKetua Komite Sekolah' }]
            },
            {
              id: uuidv4(),
              type: 'PARAGRAPH',
              layoutStyle: 'SIGNATURE_NAME',
              nodes: [{ type: 'TEXT', id: uuidv4(), text: settings?.komite?.name || "Nama Ketua Komite" }]
            }
          ]
        },
        {
          id: uuidv4(),
          type: 'CONTAINER',
          layoutStyle: 'SIGNATURE_CELL',
          blocks: [
            {
              id: uuidv4(),
              type: 'PARAGRAPH',
              layoutStyle: 'SIGNATURE_ROLE',
              nodes: [{ type: 'TEXT', id: uuidv4(), text: 'Mengesahkan,\nKepala Sekolah' }]
            },
            {
              id: uuidv4(),
              type: 'PARAGRAPH',
              layoutStyle: 'SIGNATURE_NAME',
              nodes: [{ type: 'TEXT', id: uuidv4(), text: settings?.principal?.name || "Nama Kepala Sekolah" }]
            },
            {
              id: uuidv4(),
              type: 'PARAGRAPH',
              layoutStyle: 'SIGNATURE_NIP',
              nodes: [{ type: 'TEXT', id: uuidv4(), text: `NIP. ${settings?.principal?.nip || "-"}` }]
            }
          ]
        }
      ]
    });
    
    if (settings?.pengawas?.name) {
      blocks.push({
        id: `approval-signatures-pengawas-${uuidv4()}`,
        type: 'CONTAINER',
        layoutStyle: 'SIGNATURE_GRID',
        blocks: [
          {
            id: uuidv4(),
            type: 'CONTAINER',
            layoutStyle: 'SIGNATURE_CELL',
            blocks: [
              {
                id: uuidv4(),
                type: 'PARAGRAPH',
                layoutStyle: 'SIGNATURE_ROLE',
                nodes: [{ type: 'TEXT', id: uuidv4(), text: 'Mengetahui,\nPengawas Sekolah' }]
              },
              {
                id: uuidv4(),
                type: 'PARAGRAPH',
                layoutStyle: 'SIGNATURE_NAME',
                nodes: [{ type: 'TEXT', id: uuidv4(), text: settings?.pengawas?.name }]
              },
              {
                id: uuidv4(),
                type: 'PARAGRAPH',
                layoutStyle: 'SIGNATURE_NIP',
                nodes: [{ type: 'TEXT', id: uuidv4(), text: `NIP. ${settings?.pengawas?.nip || "-"}` }]
              }
            ]
          }
        ]
      });
    }

    return {
      id: `approval-${uuidv4()}`,
      chapterId: 'APPROVAL',
      title: 'Pengesahan',
      blocks
    };
  }

  protected static processChapterBase(chapter: DocumentChapter, chapterId: string, customConvertTable?: (t: any) => DocumentBlock | null, customSectionHook?: (section: any) => DocumentBlock[]): CanonicalSection {
    const blocks: DocumentBlock[] = [];
    
    if (chapter.title && chapterId !== 'TOC') {
      blocks.push({
        id: uuidv4(),
        type: 'HEADING',
        level: 1,
        nodes: [{ type: 'TEXT', id: uuidv4(), text: chapter.title }]
      });
    }
    
    if (chapter.subtitle && chapterId !== 'TOC') {
      blocks.push({
        id: uuidv4(),
        type: 'HEADING',
        level: 2,
        nodes: [{ type: 'TEXT', id: uuidv4(), text: chapter.subtitle }]
      });
    }
    
    for (const p of chapter.paragraphs || []) {
      blocks.push({
        id: uuidv4(),
        type: 'PARAGRAPH',
        nodes: [{ type: 'TEXT', id: uuidv4(), text: p }]
      });
    }
    
    for (const section of chapter.sections || []) {
      if (section.title) {
        blocks.push({
          id: uuidv4(),
          type: 'HEADING',
          level: 2,
          nodes: [{ type: 'TEXT', id: uuidv4(), text: section.title }]
        });
      }
      for (const p of section.paragraphs || []) {
        blocks.push({
          id: uuidv4(),
          type: 'PARAGRAPH',
          nodes: [{ type: 'TEXT', id: uuidv4(), text: p }]
        });
      }
      
      if (customSectionHook) {
         const customBlocks = customSectionHook(section);
         if (customBlocks && customBlocks.length > 0) {
            blocks.push(...customBlocks);
         }
      }
      
      for (const t of section.tables || []) {
         const tb = customConvertTable ? customConvertTable(t) : this.convertTableBase(t);
         if (tb) blocks.push(tb);
      }
    }
    
    for (const t of chapter.tables || []) {
       const tb = customConvertTable ? customConvertTable(t) : this.convertTableBase(t);
       if (tb) blocks.push(tb);
    }
    
    return {
      id: `${chapterId}-${uuidv4()}`,
      chapterId,
      title: chapter.title,
      blocks
    };
  }

  protected static convertTableBase(t: any): DocumentBlock | null {
    if (t.type === 'signature_block') return null;
    
    if (t.amount !== undefined) {
         return {
            id: uuidv4(),
            type: 'PARAGRAPH',
            nodes: [{ type: 'TEXT', id: uuidv4(), text: `${t.title}: Rp ${t.amount.toLocaleString('id-ID')}` }]
         };
    } else if (Array.isArray(t.data) && t.data.length > 0) {
         return this.createGenericTable(t.data);
    }
    
    return null;
  }

  protected static buildMetricsGrid(metrics: { label: string; value: string }[]): DocumentBlock {
      return {
          id: uuidv4(), 
          type: 'CONTAINER', 
          layoutStyle: 'METRICS_GRID',
          blocks: metrics.map(m => ({ 
              type: 'CONTAINER', layoutStyle: 'METRIC_ITEM', id: uuidv4(), blocks: [
                  { type: 'PARAGRAPH', layoutStyle: 'METRIC_LABEL', id: uuidv4(), nodes: [{ type: 'TEXT', id: uuidv4(), text: m.label }] },
                  { type: 'PARAGRAPH', layoutStyle: 'METRIC_VALUE', id: uuidv4(), nodes: [{ type: 'TEXT', id: uuidv4(), text: m.value }] }
              ]
          }))
      };
  }

  protected static buildCardContainer(
      title: string | undefined, 
      description: string | undefined, 
      sectionHeading: string | undefined, 
      items: any[], 
      metricsRenderer?: (itemData: any) => DocumentBlock[]
  ): DocumentBlock {
      const containerBlocks: DocumentBlock[] = [];
      if (title) {
          containerBlocks.push({ id: uuidv4(), type: 'HEADING', level: 4, layoutStyle: 'CARD_TITLE', nodes: [{ type: 'TEXT', id: uuidv4(), text: title }] });
      }
      if (description) {
          containerBlocks.push({ id: uuidv4(), type: 'PARAGRAPH', layoutStyle: 'CARD_DESC', nodes: [{ type: 'TEXT', id: uuidv4(), text: description }] });
      }
      if (items && items.length > 0) {
          if (sectionHeading) {
              containerBlocks.push({ id: uuidv4(), type: 'HEADING', level: 5, layoutStyle: 'CARD_SECTION_HEADING', nodes: [{ type: 'TEXT', id: uuidv4(), text: sectionHeading }] });
          }
          for (let j = 0; j < items.length; j++) {
              const item = items[j];
              const itemBlocks: DocumentBlock[] = [];
              itemBlocks.push({ id: uuidv4(), type: 'HEADING', level: 5, layoutStyle: 'CARD_ITEM_TITLE', nodes: [{ type: 'TEXT', id: uuidv4(), text: `${String.fromCharCode(97 + j)}. ${item.title}` }] });
              if (item.description) {
                  itemBlocks.push({ id: uuidv4(), type: 'PARAGRAPH', layoutStyle: 'CARD_ITEM_DESC', nodes: [{ type: 'TEXT', id: uuidv4(), text: item.description }] });
              }
              if (item.data && metricsRenderer) {
                   const metricsBlocks = metricsRenderer(item.data);
                   if (metricsBlocks && metricsBlocks.length > 0) {
                       itemBlocks.push(...metricsBlocks);
                   }
              }
              containerBlocks.push({ id: uuidv4(), type: 'CONTAINER', layoutStyle: 'CARD_ITEM_CONTAINER', blocks: itemBlocks });
          }
      }
      return { id: uuidv4(), type: 'CONTAINER', layoutStyle: 'CARD_CONTAINER', blocks: containerBlocks };
  }

  protected static createGenericTable(data: any[]): TableBlock {
      const keys = Object.keys(data[0]);
      
      const columnWidths = keys.map(key => {
            const k = key.toLowerCase();
            if (k === 'no' || k === 'no.') return "5%";
            if (k === 'semester' || k === 'kuartal' || k === 'fase') return "8%";
            if (k.includes('tahun')) return "12%";
            if (k === 'skor' || k === 'nilai' || k === 'jumlah' || k === 'volume' || k === 'satuan' || k === 'target') return "8%";
            if (k.includes('harga') || k.includes('biaya') || k.includes('sumber') || k.includes('anggaran') || k.includes('dana')) return "12%";
            if (k.includes('program') || k.includes('kegiatan') || k.includes('nama') || k.includes('sasaran')) return "20%";
            if (k.includes('uraian') || k.includes('deskripsi') || k.includes('analisis') || k.includes('strategi') || k.includes('indikator')) return "35%";
            if (k.includes('jadwal') || k.includes('waktu') || k.includes('bulan')) return "15%";
            if (k.includes('penanggung') || k.includes('pj') || k.includes('pihak')) return "12%";
            if (k.includes('status') || k.includes('prioritas')) return "10%";
            return "auto";
      });

      return {
          id: uuidv4(),
          type: 'TABLE',
          columnStrategy: 'proportional',
          columnWidths,
          head: [{
              id: uuidv4(),
              type: 'TABLE_ROW',
              cells: keys.map(k => ({
                  id: uuidv4(),
                  type: 'TABLE_CELL',
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: k }]
              }))
          }],
          body: data.map(row => ({
              id: uuidv4(),
              type: 'TABLE_ROW',
              cells: keys.map(k => ({
                  id: uuidv4(),
                  type: 'TABLE_CELL',
                  nodes: [{ type: 'TEXT', id: uuidv4(), text: row[k] == null || row[k] === '' ? '-' : String(row[k]) }]
              }))
          }))
      };
  }
}
