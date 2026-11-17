import { DocumentRouter } from './src/document/DocumentRouter';
import { RkasGenerationService } from './src/rkas/service/RkasGenerationService';
import { KnowledgeGraph } from './src/SPKG';
import { PlanningContextService } from './src/planning/PlanningContextService';

const rktObj = {
  id: "RKT-Y1-1",
  rkjmObjectiveId: "OBJ-IRB-1",
  activity: "Program Pengembangan Kompetensi",
  subActivity: "Pelatihan Guru",
  target: "Semua Guru & Siswa",
  status: "synced"
};

const rkasObj = {
  id: "RKAS-GEN-0",
  rktActivityId: "RKT-Y1-1",
  budgetItem: "Honorarium & Konsumsi Pelatihan Guru",
  accountCode: "5.1.02.01",
  fundingSource: "BOS Reguler",
  amount: 2500000
};

const settings = {
  planning: {
    rkt: [rktObj],
    rkas: [rkasObj]
  }
};

PlanningContextService.getInstance().updateContext({ selectedPlanningYear: 'Y1' });
const kg = new KnowledgeGraph();
const doc = DocumentRouter.generate('rkas', kg, settings);
console.log(JSON.stringify(doc.sections, null, 2));
