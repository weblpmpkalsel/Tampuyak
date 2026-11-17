import { KnowledgeGraph } from '../SPKG';
import { DocumentModel } from '../DocumentCompositionEngine/DocumentModel';
import { DocumentCompositionEngine } from '../DocumentCompositionEngine/DocumentCompositionEngine';
import { RKTDocumentBuilder } from '../RKTDocument/RKTDocumentBuilder';
import { RKTProjectionEngine } from '../rkt/RKTProjectionEngine';
import { OperationalPlanningActivity } from '../planning/OperationalPlanningActivity';
import { PlanningAssignment } from '../planning/PlanningAssignment';
import { PlanningContextService } from '../planning/PlanningContextService';
import { RkasGenerationService } from '../rkas/service/RkasGenerationService';
import { RKASDocumentBuilder } from '../RKASDocument/RKASDocumentBuilder';
import { RkasGeneratorResult } from '../rkas/generator/RkasGeneratorResult';
import { assembleKspDocument } from '../enterprise/document/ksp/KspDocumentAssembler';
import { KspAdapter } from '../enterprise/document/adapter/ksp/KspAdapter';

export class DocumentRouter {
  public static generate(
    documentType: string,
    kg: KnowledgeGraph,
    settings: any = {}
  ): DocumentModel {
    const typeId = (documentType || 'rkjm').toLowerCase();
    const planningContext = PlanningContextService.getInstance().getContext();

    switch (typeId) {
      case 'rkas': {
        const rp = settings.relationalPlanning || {};
        const p = settings.planning || {};
        
        const selectedYearStr = planningContext.selectedPlanningYear || 'Y1';
        const yearMap: Record<string, number> = { 'Y1': 1, 'Y2': 2, 'Y3': 3, 'Y4': 4 };
        const targetYear = (yearMap[selectedYearStr] || 1) as 1 | 2 | 3 | 4;

        const authoritativeRkt = (p.rkt && p.rkt.length > 0) ? p.rkt : (p.annualPlans?.[selectedYearStr]?.rkt || rp.annualPlans?.[selectedYearStr]?.rkt || []);
        const authoritativeRkas = (p.rkas && p.rkas.length > 0) ? p.rkas : (p.annualPlans?.[selectedYearStr]?.rkas || rp.annualPlans?.[selectedYearStr]?.rkas || []);

        const planningActivities = authoritativeRkt.map((rktObj: any) => {
            const rkasObj = authoritativeRkas.find((r: any) => r.rktActivityId === rktObj.id) || {};
            return {
                ...rktObj,
                ...rkasObj,
                id: rktObj.id,
                kode: rktObj.kode || rktObj.id,
                accountCode: rkasObj.accountCode || rktObj.accountCode || '-',
                nama: rktObj.subActivity || rktObj.activityName || rktObj.activity
            };
        });

        const request = {
            planningActivities,
            year: targetYear,
            recommendationCandidates: settings.recommendations || [],
            context: {
                workspaceId: settings.school?.npsn ,
                userId: settings.principal?.name || 'admin',
                role: 'ADMIN',
                timestamp: Date.now()
            }
        };

        const response = RkasGenerationService.generate(request);
        
        const generatorResult: RkasGeneratorResult = {
            success: response.success,
            errors: response.errors,
            warnings: response.warnings,
            rkas: response.result,
            metadata: response.metadata
        };

        const builder = new RKASDocumentBuilder();
        return builder.buildDocument(generatorResult, settings);
      }
      case 'rkt': {
        const rp = settings.relationalPlanning || {};
        const p = settings.planning || {};
        
        // Use the centralized planning context
        const selectedYearStr = planningContext.selectedPlanningYear || 'Y1';
        const yearMap: Record<string, number> = { 'Y1': 1, 'Y2': 2, 'Y3': 3, 'Y4': 4 };
        const targetYear = (yearMap[selectedYearStr] || 1) as 1 | 2 | 3 | 4;

        let opActivities: OperationalPlanningActivity[] = rp.operationalActivities || [];
        if (opActivities.length === 0 && rp.annualPlans?.[selectedYearStr]?.operationalActivities) {
            opActivities = rp.annualPlans[selectedYearStr].operationalActivities;
        }
        if (opActivities.length === 0 && p.operationalActivities && p.operationalActivities.length > 0) {
            opActivities = p.operationalActivities;
        }
        if (opActivities.length === 0 && p.annualPlans?.[selectedYearStr]?.operationalActivities) {
            opActivities = p.annualPlans[selectedYearStr].operationalActivities;
        }

        // Hydrate or repair metadata from the authoritative RKT store if it's missing or Unknown
        const authoritativeRkt = (p.rkt && p.rkt.length > 0) ? p.rkt : (p.annualPlans?.[selectedYearStr]?.rkt || rp.annualPlans?.[selectedYearStr]?.rkt || []);
        if (authoritativeRkt.length > 0) {
            if (opActivities.length === 0) {
                opActivities = authoritativeRkt.map((rktObj: any, idx: number) => {
                    const q = (idx % 4) + 1;
                    const s = q <= 2 ? 1 : 2;
                    return {
                        operationalPlanningId: `OP-${rktObj.id || Math.random().toString(36).substring(7)}`,
                        activityReferenceId: rktObj.id || Math.random().toString(36).substring(7),
                        programReferenceId: rktObj.programId || 'UNKNOWN',
                        planningYear: selectedYearStr as any,
                        semester: s as 1 | 2,
                        quarter: q as 1 | 2 | 3 | 4,
                        priority: 'HIGH',
                        sequence: 1,
                        dependencyReferences: [],
                        recommendationReferences: [],
                        executionReference: null,
                        status: 'PLANNED',
                        metadata: {
                            programName: rktObj.program || rktObj.activity,
                            activityName: rktObj.subActivity || rktObj.activityName || rktObj.activity,
                            target: rktObj.successTarget || rktObj.target,
                            performanceIndicator: rktObj.outcome || rktObj.successIndicator,
                            personInCharge: rktObj.personResponsible || rktObj.personInCharge
                        }
                    };
                });
            } else {
                opActivities = opActivities.map(op => {
                    const sourceRkt = authoritativeRkt.find((r: any) => r.id === op.activityReferenceId);
                    if (sourceRkt) {
                        const m = op.metadata || {};
                        return {
                            ...op,
                            metadata: {
                                ...m,
                                programName: m.programName ? m.programName : (sourceRkt.program || sourceRkt.activity),
                                activityName: m.activityName ? m.activityName : (sourceRkt.subActivity || sourceRkt.activityName || sourceRkt.activity),
                                target: m.target || sourceRkt.successTarget || sourceRkt.target,
                                performanceIndicator: m.performanceIndicator || sourceRkt.outcome || sourceRkt.successIndicator,
                                personInCharge: m.personInCharge || sourceRkt.personResponsible || sourceRkt.personInCharge
                            }
                        };
                    }
                    return op;
                });
            }
        }

        let assignments: PlanningAssignment[] = rp.planningAssignments || [];
        if (assignments.length === 0 && p.planningAssignments && p.planningAssignments.length > 0) {
            assignments = p.planningAssignments;
        }

        const snapshotVersion = settings.rkjmSnapshotVersion || '1.0';
        const userId = settings.principal?.name || 'admin';

        const engine = new RKTProjectionEngine();
        const result = engine.projectYear(targetYear, opActivities, assignments, kg, snapshotVersion, userId);
        
        const builder = new RKTDocumentBuilder();
        return builder.buildDocument(result, settings);
      }
      case 'ksp': {
        const metadata = {
          schoolName: settings.schoolName || "Sekolah Dasar Negeri",
          schoolLevel: settings.schoolLevel || "SD",
          schoolStatus: settings.schoolStatus || "Negeri",
          npsn: settings.npsn || "12345678",
          principalName: settings.principalName || "Kepala Sekolah",
          principalNip: settings.principalNip || "198001012010011001",
          principalPosition: settings.principalPosition || "Kepala Sekolah",
          village: settings.village || "Desa",
          district: settings.district || "Kecamatan",
          regencyOrCity: settings.regencyOrCity || "Kabupaten",
          province: settings.province || "Provinsi",
          academicYear: settings.academicYear || "2026/2027",
          approvalDate: settings.approvalDate || new Date().toISOString(),
          provinceEducationOffice: settings.provinceEducationOffice || "Dinas Pendidikan Provinsi",
          regencyEducationOffice: settings.regencyEducationOffice || "Dinas Pendidikan Kabupaten/Kota",
          draftingTeam: settings.draftingTeam || []
        };
        
        const canonicalDoc = assembleKspDocument(metadata as any);
        const adapter = new KspAdapter();
        const artifact = adapter.adapt(canonicalDoc);
        
        // Convert CanonicalDocument sections to DocumentModel properties expected by EnterpriseDocumentViewer
        const sectionsArr = artifact.content.sections;
        
        // Helper to find a section by a substring of its title/id
        const findSec = (key: string) => sectionsArr.find((s: any) => (s.title && s.title.toLowerCase().includes(key)) || (s.id && s.id.toLowerCase().includes(key)));

        const convertBlocksToChapter = (canonicalSection: any): any => {
          if (!canonicalSection) return { id: 'fallback-id', title: '', paragraphs: [], sections: [] };
          const chapterTitle = canonicalSection.title || '';
          const sections: any[] = [];
          const topLevelParagraphs: string[] = [];
          let currentSection: any = null;

          const extractText = (nodes: any[]) => nodes?.map(n => n.text).join('') || '';

          const processBlock = (b: any) => {
            if (b.type === 'HEADING' && b.level === 2) {
              currentSection = {
                id: b.id,
                title: extractText(b.nodes),
                paragraphs: [],
                tables: [],
                figures: [],
                references: []
              };
              sections.push(currentSection);
            } else if (b.type === 'PARAGRAPH') {
              const text = extractText(b.nodes);
              if (currentSection) {
                currentSection.paragraphs.push(text);
              } else {
                topLevelParagraphs.push(text);
              }
            } else if (b.type === 'HEADING' && b.level === 3) {
                const text = extractText(b.nodes);
                if (currentSection) {
                  currentSection.paragraphs.push(`**${text}**`);
                } else {
                  topLevelParagraphs.push(`**${text}**`);
                }
            } else if (b.type === 'CONTAINER') {
              if (b.blocks) {
                b.blocks.forEach(processBlock);
              }
            } else if (b.type === 'LIST') {
               const listItems = b.items?.map((item: any) => `- ${extractText(item.nodes)}`).join('\n') || '';
               if (currentSection) {
                 currentSection.paragraphs.push(listItems);
               } else {
                 topLevelParagraphs.push(listItems);
               }
            } else if (b.type === 'TABLE') {
               const tableData: any[] = [];
               const headers = b.head?.[0]?.cells?.map((c: any) => extractText(c.nodes)) || [];
               
               b.body?.forEach((row: any) => {
                  const rowObj: any = {};
                  row.cells?.forEach((cell: any, i: number) => {
                     const key = headers[i] || `Col ${i+1}`;
                     rowObj[key] = extractText(cell.nodes);
                  });
                  tableData.push(rowObj);
               });
               
               const genericTable = {
                  type: 'generic',
                  data: tableData
               };
               
               if (currentSection) {
                 currentSection.tables.push(genericTable);
               }
            }
          };

          if (canonicalSection.blocks) {
            canonicalSection.blocks.forEach(processBlock);
          }

          return {
            id: canonicalSection.id || 'chap',
            title: chapterTitle,
            paragraphs: topLevelParagraphs,
            sections: sections,
            tables: [],
            figures: [],
            references: [],
            metadata: {}
          };
        };

        const mappedDocumentModel = {
          id: artifact.content.id,
          title: "Kurikulum Satuan Pendidikan",
          subtitle: `Tahun Pelajaran ${metadata.academicYear}`,
          metadata: {
            title: "Kurikulum Satuan Pendidikan",
            version: "1.0",
            schoolName: metadata.schoolName,
            npsn: metadata.npsn,
            academicYear: metadata.academicYear
          },
          cover: convertBlocksToChapter(findSec('cover')),
          approval: convertBlocksToChapter(findSec('approval')),
          toc: convertBlocksToChapter(findSec('toc')),
          chapter1: convertBlocksToChapter(findSec('bab1')),
          chapter2: convertBlocksToChapter(findSec('bab2')),
          chapter3: convertBlocksToChapter(findSec('bab3')),
          chapter4: convertBlocksToChapter(findSec('bab4')),
          chapter5: convertBlocksToChapter(findSec('bab5')),
          appendix: convertBlocksToChapter(findSec('appendix'))
        };
        
        return mappedDocumentModel as any;
      }
      case 'rkjm':
      default: {
        const composer = new DocumentCompositionEngine();
        return composer.composeDocument(kg, settings);
      }
    }
  }
}
