import { DocumentRouter } from './src/document/DocumentRouter';
import { WorkspaceController } from './src/rkas/controller/WorkspaceController';

function generateAppDocument(docId: string, kg: any, settings: any) {
  if (docId === 'rkas') {
    const controller = new WorkspaceController();
    const context = {
      workspaceId: settings?.workspaceId || 'default-workspace',
      userId: settings?.principal?.name || 'admin',
      role: 'ADMIN'
    };
    controller.execute({ action: 'INITIALIZE', context });
    const result = controller.execute({
      action: 'GENERATE_RKAS',
      context,
      payload: { kg, settings }
    });
    
    console.log("1. WorkspaceController Result documentModel exists:", !!result.documentModel);
    
    if (result.success && result.documentModel) {
      return result.documentModel;
    }
    throw new Error(result.errors?.join(", ") || "Failed to generate RKAS document");
  }
  return DocumentRouter.generate(docId, kg, settings);
}

const planning = {
  annualPlans: {
    "Y1": {
      rkt: [{
        id: "RKT-1",
        rkjmObjectiveId: "OBJ-1",
        programId: "prog-1",
        program: "Program Peningkatan Kualitas Pembelajaran",
        activity: "Pelatihan Guru",
        subActivity: "Pelatihan Implementasi Kurikulum Merdeka",
        outcome: "Meningkatnya pemahaman guru",
        successTarget: "100% guru paham",
        personResponsible: "Tim Kurikulum",
        evidence: "Sertifikat"
      }],
      rkas: [{
        id: "RKAS-1",
        rktActivityId: "RKT-1",
        budgetItem: "Biaya Pelaksanaan Pelatihan",
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft"
      }]
    }
  }
};

const settings = {
  planning,
  workspaceId: "test-workspace"
};

// Mock KG
const kg = {
  nodes: [],
  edges: []
};

console.log("Starting trace...");
const doc = generateAppDocument('rkas', kg, settings);

console.log("\n2. EnterpriseDocumentViewer Input Data:");
if (doc && doc.chapter2 && doc.chapter2.sections[0] && doc.chapter2.sections[0].tables) {
  console.log(JSON.stringify(doc.chapter2.sections[0].tables[0].data, null, 2));
} else {
  console.log("Document format unexpected:", Object.keys(doc || {}));
}

