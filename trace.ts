import { RkasGenerationService } from './src/rkas/service/RkasGenerationService';
import { RkasGenerator } from './src/rkas/generator/RkasGenerator';
import { BudgetBuilder } from './src/budget/BudgetBuilder';

// Mock settings
const settings = {
  planning: {
    rkt: [ { id: 'A1', activity: 'Act 1' } ],
    rkas: [ { rktActivityId: 'A1', accountCode: '123' } ],
    planningAssignments: [ { activityReferenceId: 'A1' } ]
  }
};

const authoritativeRkt = settings.planning.rkt;
console.log("activity count after RKT:", authoritativeRkt.length);

const assignments = settings.planning.planningAssignments;
console.log("activity count after assignment:", assignments.length);

// How does DocumentRouter map this?
const planningActivities = authoritativeRkt.map((rktObj: any) => {
    const rkasObj = settings.planning.rkas.find((r: any) => r.rktActivityId === rktObj.id) || {};
    return {
        ...rktObj,
        ...rkasObj,
        id: rktObj.id,
        kode: rktObj.kode || rktObj.id,
        accountCode: rkasObj.accountCode || rktObj.accountCode || '-',
        nama: rktObj.subActivity || rktObj.activityName || rktObj.activity
    };
});

// Notice DocumentRouter does NOT filter by assignment.
console.log("budget item count input (planningActivities length):", planningActivities.length);

const request = {
    planningActivities,
    year: 1,
    recommendationCandidates: [],
    context: { workspaceId: 'w1' }
};

const response = RkasGenerationService.generate(request as any);
console.log("renderer input count (budget structures length):", response.result?.budgetStructures?.length);
