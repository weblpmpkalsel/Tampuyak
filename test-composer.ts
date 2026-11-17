
import { KnowledgeGraph } from './src/SPKG';
import { DocumentCompositionEngine } from './src/DocumentCompositionEngine/DocumentCompositionEngine';

const settings = {
  relationalPlanning: {
    objectives: [{ id: 'OBJ-1', objective: 'Obj 1', target: 'Target 1', risk: 'Risk 1' }],
    programs: [],
    activities: [],
    annualPlans: {
      'Y1': { rkt: [{id: 1, _assignedYear: 'Y1', activity: 'A1', subActivity: 'S1', target: 'T1', status: 'S1', rkjmObjectiveId: 'OBJ-1'}], rkas: [{id: 1, budgetItem: 'B1', amount: 100}], monitoring: [], evaluation: [], operationalActivities: [] },
      'Y2': { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
      'Y3': { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
      'Y4': { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }
    }
  }
};

const kg = KnowledgeGraph.getInstance();
const composer = new DocumentCompositionEngine();
const doc = composer.composeDocument(kg, settings);

const ch3 = doc.chapter3;
if (ch3 && ch3.sections) {
    let tCount = 0;
    for (const section of ch3.sections) {
        if (section.tables) {
            for (const item of section.tables) {
                console.log('Ch 3 Table Title:', item.title);
                console.log('Ch 3 Table Rows:', item.data.length);
                tCount++;
            }
        }
    }
    console.log('Ch 3 Tables:', tCount);
}

const ch4 = doc.chapter4;
if (ch4 && ch4.sections) {
    let tCount = 0;
    for (const section of ch4.sections) {
        if (section.tables) {
            for (const item of section.tables) {
                console.log('Ch 4 Table Title:', item.title);
                console.log('Ch 4 Table Rows:', item.data.length);
                tCount++;
            }
        }
    }
    console.log('Ch 4 Tables:', tCount);
}
