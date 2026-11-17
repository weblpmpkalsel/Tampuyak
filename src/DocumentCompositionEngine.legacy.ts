import { CanonicalObject, KnowledgeGraph } from './SPKG';

export interface DocumentSection {
  id: string;
  title?: string;
  paragraphs: string[];
  tables?: any[];
  figures?: any[];
  references?: string[];
  metadata?: any;
}

export interface DocumentChapter {
  id: string;
  title: string;
  subtitle?: string;
  sections: DocumentSection[];
  paragraphs: string[];
  tables: any[];
  figures: any[];
  references: string[];
  metadata: any;
}

export interface DocumentModel {
  cover: DocumentChapter;
  approval: DocumentChapter;
  toc: DocumentChapter;
  chapter1: DocumentChapter;
  chapter2: DocumentChapter;
  chapter3: DocumentChapter;
  chapter4: DocumentChapter;
  chapter5: DocumentChapter;
  appendix: DocumentChapter;
}

export class DocumentCompositionEngine {
  private generateId(type: string): string {
    return `${type.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  public composeDocument(kg: KnowledgeGraph): DocumentModel {
    const schoolNodes = kg.getNodesByType('School');
    const visionNodes = kg.getNodesByType('Vision');
    const missionNodes = kg.getNodesByType('Mission');
    const legalNodes = kg.getNodesByType('LegalBasis');
    const bgNodes = kg.getNodesByType('Background');
    const planningNodes = kg.getNodesByType('PlanningMethodology');
    const purposeNodes = kg.getNodesByType('Purpose');
    const irbNodes = kg.getNodesByType('IRB');
    const priorityNodes = kg.getNodesByType('Priority');
    const objectiveNodes = kg.getNodesByType('StrategicObjective');
    const programNodes = kg.getNodesByType('StrategicProgram');
    const activityNodes = kg.getNodesByType('Activity');
    const budgetNodes = kg.getNodesByType('Budget');
    const reportNodes = kg.getNodesByType('EducationReport');

    const schoolIdentity = schoolNodes.length > 0 ? schoolNodes[0] : null;

    const cover: DocumentChapter = {
      id: this.generateId('DocumentCover'),
      title: 'Halaman Sampul',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };

    const approval: DocumentChapter = {
      id: this.generateId('DocumentApproval'),
      title: 'Lembar Pengesahan',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };

    const toc: DocumentChapter = {
      id: this.generateId('DocumentTOC'),
      title: 'Daftar Isi',
      sections: [],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [],
      metadata: { generated: true }
    };

    const chapter1: DocumentChapter = {
      id: this.generateId('DocumentChapter'),
      title: 'BAB I: Pendahuluan',
      sections: [
        {
          id: this.generateId('DocumentSection'),
          title: 'Latar Belakang',
          paragraphs: [
            ...bgNodes.map(n => n.description || ''),
            schoolIdentity ? schoolIdentity.description || '' : ''
          ],
          references: [...bgNodes.map(n => n.id), schoolIdentity ? schoolIdentity.id : '']
        },
        {
          id: this.generateId('DocumentSection'),
          title: 'Visi dan Misi',
          paragraphs: [
            ...visionNodes.map(n => n.description || ''),
            ...missionNodes.map(n => n.description || '')
          ],
          references: [...visionNodes.map(n => n.id), ...missionNodes.map(n => n.id)]
        },
        {
          id: this.generateId('DocumentSection'),
          title: 'Landasan Hukum',
          paragraphs: [
            ...legalNodes.map(n => n.description || '')
          ],
          references: [...legalNodes.map(n => n.id)]
        },
        {
          id: this.generateId('DocumentSection'),
          title: 'Metodologi Perencanaan dan Tujuan',
          paragraphs: [
            ...planningNodes.map(n => n.description || ''),
            ...purposeNodes.map(n => n.description || '')
          ],
          references: [...planningNodes.map(n => n.id), ...purposeNodes.map(n => n.id)]
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [
        schoolIdentity ? schoolIdentity.id : '',
        ...bgNodes.map(n => n.id),
        ...visionNodes.map(n => n.id),
        ...missionNodes.map(n => n.id),
        ...legalNodes.map(n => n.id),
        ...planningNodes.map(n => n.id),
        ...purposeNodes.map(n => n.id)
      ].filter(id => id !== ''),
      metadata: { generated: true }
    };

    const chapter2: DocumentChapter = {
      id: this.generateId('DocumentChapter'),
      title: 'BAB II: Analisis Kondisi Sekolah',
      sections: [
        {
          id: this.generateId('DocumentSection'),
          title: 'Hasil Rapor Pendidikan',
          paragraphs: reportNodes.map(n => n.description || ''),
          references: reportNodes.map(n => n.id)
        },
        {
          id: this.generateId('DocumentSection'),
          title: 'Matriks Identifikasi, Refleksi, Benahi (IRB)',
          paragraphs: [
            'Berikut adalah matriks Identifikasi, Refleksi, dan Benahi (IRB) yang disusun berdasarkan akar masalah dari rapor pendidikan.'
          ],
          tables: irbNodes.map(n => ({
             title: n.title,
             id: n.id,
             data: n.data
          })),
          references: irbNodes.map(n => n.id)
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [...reportNodes.map(n=>n.id), ...irbNodes.map(n=>n.id)],
      metadata: { generated: true }
    };

    const chapter3Sections: DocumentSection[] = [];
    objectiveNodes.forEach(obj => {
      const objPrograms = programNodes.filter(p => p.parentId === obj.id);
      chapter3Sections.push({
        id: this.generateId('DocumentSection'),
        title: obj.title,
        paragraphs: [obj.description || ''],
        metadata: {
           targets: obj.data?.targets || { y1: '-', y2: '-', y3: '-', y4: '-' }
        },
        tables: objPrograms.map(p => {
           const pActivities = activityNodes.filter(a => a.parentId === p.id);
           return {
             program: p.title,
             description: p.description,
             activities: pActivities.map(a => ({ 
                title: a.title, 
                description: a.description,
                data: a.data
             }))
           };
        }),
        references: [obj.id, ...objPrograms.map(p=>p.id)]
      });
    });

    const chapter3: DocumentChapter = {
      id: this.generateId('DocumentChapter'),
      title: 'BAB III: Program Strategis Jangka Menengah',
      sections: chapter3Sections,
      paragraphs: [],
      tables: [],
      figures: [],
      references: objectiveNodes.map(n=>n.id),
      metadata: { generated: true }
    };

    const chapter4: DocumentChapter = {
      id: this.generateId('DocumentChapter'),
      title: 'BAB IV: Rencana Pembiayaan',
      sections: [
        {
          id: this.generateId('DocumentSection'),
          title: 'Proyeksi Anggaran',
          paragraphs: [
            'Proyeksi anggaran disusun untuk mendukung pelaksanaan program strategis. Rincian alokasi anggaran disajikan pada tabel di bawah ini.'
          ],
          tables: budgetNodes.map(b => ({
            title: b.title,
            amount: b.data?.amount || 0
          })),
          references: budgetNodes.map(n=>n.id)
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: budgetNodes.map(n=>n.id),
      metadata: { generated: true }
    };

    const evalNodes = kg.getNodesByType('Evaluation');
    const monNodes = kg.getNodesByType('Monitoring');

    const chapter5: DocumentChapter = {
      id: this.generateId('DocumentChapter'),
      title: 'BAB V: Penutup',
      sections: [
        {
          id: this.generateId('DocumentSection'),
          title: 'Strategi Implementasi dan Evaluasi',
          paragraphs: [
            ...evalNodes.map(n => n.description || ''),
            ...monNodes.map(n => n.description || '')
          ],
          references: [...evalNodes.map(n => n.id), ...monNodes.map(n => n.id)]
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [...evalNodes.map(n => n.id), ...monNodes.map(n => n.id)],
      metadata: { generated: true }
    };

    const appendix: DocumentChapter = {
      id: this.generateId('DocumentAppendix'),
      title: 'Lampiran',
      sections: [
        {
          id: this.generateId('DocumentSection'),
          title: 'Daftar Referensi Silang (Knowledge Graph)',
          paragraphs: [
            'Berikut adalah daftar referensi node pada sistem Knowledge Graph yang digunakan dalam penyusunan dokumen ini.'
          ],
          tables: [
            {
               title: 'Node Referensi Rapor Pendidikan',
               data: reportNodes.map(n => ({ id: n.id, title: n.title, source: n.source }))
            },
            {
               title: 'Daftar Referensi Anggaran Dasar',
               data: budgetNodes.map(b => ({ id: b.id, amount: b.data?.amount }))
            }
          ]
        }
      ],
      paragraphs: [],
      tables: [],
      figures: [],
      references: [...reportNodes.map(n => n.id), ...budgetNodes.map(b => b.id)],
      metadata: { generated: true }
    };

    const documentModel: DocumentModel = {
      cover, approval, toc, chapter1, chapter2, chapter3, chapter4, chapter5, appendix
    };

    this.printReport(documentModel);

    return documentModel;
  }

  private printReport(model: DocumentModel) {
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
    (/* console.log removed */ (..._args: any[]) => {})("DOCUMENT MODEL AUDIT");
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
    const chapters = [
      { id: 'Cover', data: model.cover },
      { id: 'Approval', data: model.approval },
      { id: 'TOC', data: model.toc },
      { id: 'Chapter1', data: model.chapter1 },
      { id: 'Chapter2', data: model.chapter2 },
      { id: 'Chapter3', data: model.chapter3 },
      { id: 'Chapter4', data: model.chapter4 },
      { id: 'Chapter5', data: model.chapter5 },
      { id: 'Appendix', data: model.appendix },
    ];
    let totalParagraphs = 0;
    let totalTables = 0;
    let totalFigures = 0;
    let totalReferences = 0;

    chapters.forEach(ch => {
       (/* console.log removed */ (..._args: any[]) => {})(`\nDocumentModel -> ${ch.id}`);
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
         
         (/* console.log removed */ (..._args: any[]) => {})(`\n  Section Title : ${s.title}`);
         const contentLength = s.paragraphs.join('').length;
         (/* console.log removed */ (..._args: any[]) => {})(`  Content Length : ${contentLength}`);
         (/* console.log removed */ (..._args: any[]) => {})(`  Paragraph Count : ${s.paragraphs.length}`);
         (/* console.log removed */ (..._args: any[]) => {})(`  Generated By : DocumentCompositionEngine`);
         (/* console.log removed */ (..._args: any[]) => {})(`  Source Objects : ${s.references?.join(', ') || 'None'}`);
         
         if (contentLength === 0 && s.paragraphs.length > 0) {
           (/* console.log removed */ (..._args: any[]) => {})(`  DOCUMENT COMPOSITION FAILURE`);
         }
       });
       
       totalParagraphs += pCount;
       totalTables += tCount;
       totalFigures += fCount;
       totalReferences += rCount;
       
       (/* console.log removed */ (..._args: any[]) => {})(`\n  --- Chapter Summary ---`);
       (/* console.log removed */ (..._args: any[]) => {})(`  Paragraphs : ${pCount}`);
       (/* console.log removed */ (..._args: any[]) => {})(`  Tables : ${tCount}`);
       (/* console.log removed */ (..._args: any[]) => {})(`  Sections : ${sCount}`);
       (/* console.log removed */ (..._args: any[]) => {})(`  References : ${rCount}`);
       (/* console.log removed */ (..._args: any[]) => {})(`  Status : OK`);
       
       if (ch.id === 'Appendix') {
         (/* console.log removed */ (..._args: any[]) => {})(`\n  --- Appendix References ---`);
         ch.data.sections.forEach(s => {
           s.tables?.forEach(t => {
             (/* console.log removed */ (..._args: any[]) => {})(`  ${t.title} References Count: ${t.data ? t.data.length : 0}`);
           });
         });
       }
    });

    (/* console.log removed */ (..._args: any[]) => {})("\n==============================");
    (/* console.log removed */ (..._args: any[]) => {})(`Total Paragraphs ............. ${totalParagraphs}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total Tables ................. ${totalTables}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total Figures ................ ${totalFigures}`);
    (/* console.log removed */ (..._args: any[]) => {})(`Total References ............. ${totalReferences}`);
    (/* console.log removed */ (..._args: any[]) => {})("==============================");
  }
}

