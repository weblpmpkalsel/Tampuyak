import { KnowledgeGraph } from '../SPKG';
import { DocumentModel } from './DocumentModel';
import { CoverBuilder } from './builders/CoverBuilder';
import { ApprovalBuilder } from './builders/ApprovalBuilder';
import { TocBuilder } from './builders/TocBuilder';
import { Chapter1Builder } from './builders/Chapter1Builder';
import { Chapter2Builder } from './builders/Chapter2Builder';
import { Chapter3Builder } from './builders/Chapter3Builder';
import { Chapter4Builder } from './builders/Chapter4Builder';
import { Chapter5Builder } from './builders/Chapter5Builder';
import { AppendixBuilder } from './builders/AppendixBuilder';
import { KspMetadataAdapter } from '../ksp/KspMetadataAdapter';

export class DocumentCompositionEngine {
  private coverBuilder = new CoverBuilder();
  private approvalBuilder = new ApprovalBuilder();
  private tocBuilder = new TocBuilder();
  private chapter1Builder = new Chapter1Builder();
  private chapter2Builder = new Chapter2Builder();
  private chapter3Builder = new Chapter3Builder();
  private chapter4Builder = new Chapter4Builder();
  private chapter5Builder = new Chapter5Builder();
  private appendixBuilder = new AppendixBuilder();

  private runSanitizationLayer(doc: DocumentModel) {
    let leakageDetected = false;
    let instructionalRemoved = 0;
    let hyperlinksRemoved = 0;
    let templateRemoved = 0;

    const blacklisted = [
      '\\bcara 1\\b', '\\bcara 2\\b', '\\bcara pengisian\\b', '\\bklik\\b', 
      '\\bpanduan pengisian\\b', '\\bpanduan penggunaan\\b', '\\btutorial\\b', 
      '\\bworksheet\\b', '\\bworkbook\\b', '\\bsheet\\b', 
      '\\bgunakan lembar\\b', '\\blembar kerja\\b', '\\bpetunjuk pengisian\\b', 
      '\\bdownload\\b', '\\bunduh\\b', '\\breferensi pengisian\\b', 
      '\\blangkah pengisian\\b', '\\blangkah-langkah pengisian\\b',
      '\\bcontoh pengisian\\b', '\\bsebagai referensi\\b', '\\bdiisi dengan\\b',
      '\\bpertanyaan pemantik\\b', '\\bkumpulan materi\\b',
      '\\brencanakan upaya\\b', '\\brekomendasi keseluruhan\\b', '\\brekomendasi prioritas\\b',
      '\\banda dapat mengunduh\\b', '\\banda dapat melihat\\b', '\\banda dapat klik\\b', '\\banda dapat mengakses\\b', 
      '\\bsilakan klik\\b', '\\bsilakan unduh\\b', '\\bsilakan buka\\b',
      '\\[contoh\\]', 'https://', 'http://', 'guru\\.kemendikdasmen\\.go\\.id'
    ];
    const regexes = blacklisted.map(pattern => new RegExp(pattern, 'i'));

    const sanitizeString = (text: string): string => {
        if (!text) return text;
        let modified = false;

        let sanitized = text.replace(/https?:\/\/[^\s]+/g, () => {
            hyperlinksRemoved++;
            modified = true;
            return '[Tautan Dihapus]';
        });
        
        sanitized = sanitized.replace(/guru\.kemendikdasmen\.go\.id/gi, () => {
            hyperlinksRemoved++;
            modified = true;
            return '[Tautan Dihapus]';
        });

        let lines = sanitized.split('\n');
        lines = lines.map(line => {
            const sentences = line.split(/(?<=\.)\s+/);
            const cleanSentences = sentences.map(sentence => {
                if (regexes.some(regex => regex.test(sentence))) {
                    modified = true;
                    if (sentence.toLowerCase().includes('contoh') || sentence.toLowerCase().includes('template')) {
                        templateRemoved++;
                    } else {
                        instructionalRemoved++;
                    }
                    return '[Konten Disanitasi: Teks instruksional dihapus untuk keperluan dokumen resmi]';
                }
                return sentence;
            });
            return cleanSentences.join(' ');
        });

        if (modified) {
            leakageDetected = true;
        }

        return lines.join('\n');
    };

    const traverseAndSanitize = (obj: any) => {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (typeof item === 'string') {
                    obj[index] = sanitizeString(item);
                } else if (typeof item === 'object' && item !== null) {
                    traverseAndSanitize(item);
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                if (key === 'metadata' || key === 'id' || key === 'references') return;
                if (typeof obj[key] === 'string') {
                    obj[key] = sanitizeString(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverseAndSanitize(obj[key]);
                }
            });
        }
    };

    traverseAndSanitize(doc);

    return {
      leakageDetected,
      instructionalRemoved,
      hyperlinksRemoved,
      templateRemoved
    };
  }

  private runValidationLayer(doc: DocumentModel): number {
    const blacklisted = [
      '\\bcara 1\\b', '\\bcara 2\\b', '\\bcara pengisian\\b', '\\bklik\\b', 
      '\\bpanduan pengisian\\b', '\\bpanduan penggunaan\\b', '\\btutorial\\b', 
      '\\bworksheet\\b', '\\bworkbook\\b', '\\bsheet\\b', 
      '\\bgunakan lembar\\b', '\\blembar kerja\\b', '\\bpetunjuk pengisian\\b', 
      '\\bdownload\\b', '\\bunduh\\b', '\\breferensi pengisian\\b', 
      '\\blangkah pengisian\\b', '\\blangkah-langkah pengisian\\b',
      '\\bcontoh pengisian\\b', '\\bsebagai referensi\\b', '\\bdiisi dengan\\b',
      '\\bpertanyaan pemantik\\b', '\\bkumpulan materi\\b',
      '\\brencanakan upaya\\b', '\\brekomendasi keseluruhan\\b', '\\brekomendasi prioritas\\b',
      '\\banda dapat mengunduh\\b', '\\banda dapat melihat\\b', '\\banda dapat klik\\b', '\\banda dapat mengakses\\b', 
      '\\bsilakan klik\\b', '\\bsilakan unduh\\b', '\\bsilakan buka\\b',
      '\\[contoh\\]', 'https://', 'http://', 'guru\\.kemendikdasmen\\.go\\.id'
    ];
    const regexes = blacklisted.map(pattern => new RegExp(pattern, 'i'));

    let remainingFragments = 0;
    let matchCount = 0;

    const checkString = (text: string, path: string) => {
        if (!text) return;
        const matchedIdx = regexes.findIndex(regex => regex.test(text));
        if (matchedIdx !== -1) {
            remainingFragments++;
            if (matchCount < 20) {
               const match = regexes[matchedIdx].exec(text);
               (/* console.log removed */ (..._args: any[]) => {})("------------------------");
               (/* console.log removed */ (..._args: any[]) => {})("Object path");
               (/* console.log removed */ (..._args: any[]) => {})(path);
               (/* console.log removed */ (..._args: any[]) => {})("Property name");
               (/* console.log removed */ (..._args: any[]) => {})(path.split('.').pop());
               (/* console.log removed */ (..._args: any[]) => {})("Matched text");
               (/* console.log removed */ (..._args: any[]) => {})(match ? match[0] : '');
               (/* console.log removed */ (..._args: any[]) => {})("Visible to user?");
               (/* console.log removed */ (..._args: any[]) => {})("YES");
               matchCount++;
            }
        }
    };

    const traverseAndCheck = (obj: any, path: string) => {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (typeof item === 'string') {
                    checkString(item, `${path}[${index}]`);
                } else if (typeof item === 'object' && item !== null) {
                    traverseAndCheck(item, `${path}[${index}]`);
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => {
                if (key === 'metadata' || key === 'id' || key === 'references') return;
                if (typeof obj[key] === 'string') {
                    checkString(obj[key], `${path}.${key}`);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverseAndCheck(obj[key], `${path}.${key}`);
                }
            });
        }
    };

    traverseAndCheck(doc, 'DocumentModel');
    return remainingFragments;
  }

  public composeDocument(kg: KnowledgeGraph, settings: any = {}): DocumentModel {
    const kspMetadata = KspMetadataAdapter.adapt(settings);
    const metadata = { ...settings, ...kspMetadata };

    const cover = this.coverBuilder.build(kg);
    const approval = this.approvalBuilder.build(kg);
    const toc = this.tocBuilder.build(kg);
    const chapter1 = this.chapter1Builder.build(kg, metadata);
    const chapter2 = this.chapter2Builder.build(kg, settings);
    const chapter3 = this.chapter3Builder.build(kg, settings);
    const chapter4 = this.chapter4Builder.build(kg, settings);
    const chapter5 = this.chapter5Builder.build(kg, settings);
    const appendix = this.appendixBuilder.build(kg, settings);

    const documentModel: DocumentModel = {
      cover,
      approval,
      toc,
      chapter1,
      chapter2,
      chapter3,
      chapter4,
      chapter5,
      appendix,
      vision: settings?.identitas?.visi || '',
      mission: settings?.identitas?.misi || [],
      goals: settings?.identitas?.tujuan || []
    };

    let sanitizeResult = this.runSanitizationLayer(documentModel);
    let remaining = this.runValidationLayer(documentModel);

    if (remaining > 0) {
      sanitizeResult = this.runSanitizationLayer(documentModel);
      remaining = this.runValidationLayer(documentModel);
      
      if (remaining > 0) {
        throw new Error(`Validation Failed: Workbook leakage is STILL detected after second sanitization pass. Remaining fragments: ${remaining}`);
      }
    }

    (/* console.log removed */ (..._args: any[]) => {})("=====================================");
    (/* console.log removed */ (..._args: any[]) => {})("DOCUMENT SANITIZATION REPORT");
    (/* console.log removed */ (..._args: any[]) => {})("=====================================");
    (/* console.log removed */ (..._args: any[]) => {})(`Workbook instructional sentences removed: ${sanitizeResult.instructionalRemoved}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Hyperlinks removed: ${sanitizeResult.hyperlinksRemoved}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Template fragments removed: ${sanitizeResult.templateRemoved}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Remaining fragments: ${remaining}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Render: ${remaining === 0 ? 'YES' : 'NO'}`);
    (/* console.log removed */ (..._args: any[]) => {})("=====================================");

    this.printReport(documentModel);

    return documentModel;
  }

  private printReport(model: DocumentModel) {
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
    (/* console.log removed */ (..._args: any[]) => {})("DOCUMENT MODEL REPORT");
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
    const chapters = [
      { id: 'Cover', data: model.cover },
      { id: 'Approval', data: model.approval },
      { id: 'TOC', data: model.toc },
      { id: 'Chapter I', data: model.chapter1 },
      { id: 'Chapter II', data: model.chapter2 },
      { id: 'Chapter III', data: model.chapter3 },
      { id: 'Chapter IV', data: model.chapter4 },
      { id: 'Chapter V', data: model.chapter5 },
      { id: 'Appendix', data: model.appendix },
    ];
    let totalParagraphs = 0;
    let totalTables = 0;
    let totalFigures = 0;
    let totalReferences = 0;

    chapters.forEach(ch => {
       (/* console.log removed */ (..._args: any[]) => {})(`${ch.id}`);
       if (ch.id === 'Cover' || ch.id === 'Approval' || ch.id === 'TOC') {
         (/* console.log removed */ (..._args: any[]) => {})('OK');
       } else {
         let pCount = ch.data.paragraphs.length;
         let tCount = ch.data.tables.length;
         let fCount = ch.data.figures.length;
         let rCount = ch.data.references.length;
         let sCount = ch.data.sections.length;
         
         ch.data.sections.forEach(s => {
           pCount += s.paragraphs.length;
           tCount += (s.tables ? s.tables.length : 0);
           fCount += (s.figures ? s.figures.length : 0);
           rCount += (s.references ? s.references.length : 0);
         });
         
         totalParagraphs += pCount;
         totalTables += tCount;
         totalFigures += fCount;
         totalReferences += rCount;
         
         (/* console.log removed */ (..._args: any[]) => {})(`Paragraph Count`);
         (/* console.log removed */ (..._args: any[]) => {})(`${pCount}`);
         (/* console.log removed */ (..._args: any[]) => {})(`Section Count`);
         (/* console.log removed */ (..._args: any[]) => {})(`${sCount}`);
         (/* console.log removed */ (..._args: any[]) => {})(`Table Count`);
         (/* console.log removed */ (..._args: any[]) => {})(`${tCount}`);
         (/* console.log removed */ (..._args: any[]) => {})(`Reference Count`);
         (/* console.log removed */ (..._args: any[]) => {})(`${rCount}`);
       }
    });

    (/* console.log removed */ (..._args: any[]) => {})("\n==============================");
    (/* console.log removed */ (..._args: any[]) => {})(`Total Paragraphs: ${totalParagraphs}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total Tables: ${totalTables}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total Figures: ${totalFigures}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total References: ${totalReferences}`);
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
  }
}
