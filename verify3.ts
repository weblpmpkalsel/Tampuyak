import { DocumentRouter } from './src/document/DocumentRouter';
import { KnowledgeGraph, seedInitialGraph } from './src/SPKG';

const kg = KnowledgeGraph.getInstance();
seedInitialGraph();

const settings = {
    school: { name: "SMA Negeri 1 Tampuyak" },
    planning: {
        rkt: [
            { id: "RKT-001", programId: "PROG-001", program: "Program Peningkatan Mutu", activity: "Pelatihan Guru", successTarget: "100% Tercapai", outcome: "Sangat Baik" }
        ],
        // Simulating the broken data previously saved in localStorage
        operationalActivities: [
            {
                operationalPlanningId: "OP-RKT-001",
                activityReferenceId: "RKT-001",
                programReferenceId: "PROG-001",
                planningYear: "Y1",
                semester: 1, quarter: 1, priority: "HIGH", sequence: 1,
                metadata: {
                    programName: "Unknown Program", // Broken!
                    activityName: "Unknown Activity" // Broken!
                    // missing target and performanceIndicator
                }
            }
        ]
    },
    relationalPlanning: {
        objectives: [],
        annualPlans: { Y1: { rkt: [], rkas: [], operationalActivities: [] } }
    }
};

const rktDoc = DocumentRouter.generate('rkt', kg, settings);
const section = rktDoc.chapters.find((c: any) => c.title.includes('BAB III'))?.sections[1];
console.log(JSON.stringify(section.tables, null, 2));
