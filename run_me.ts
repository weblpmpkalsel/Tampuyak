import { seedInitialGraph, KnowledgeGraph } from './src/SPKG';
import { PlanningDistributionService } from './src/planning/PlanningDistributionService';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService';
import { OperationalPlanningMapper } from './src/planning/OperationalPlanningMapper';
import { RKTProjectionEngine } from './src/rkt/RKTProjectionEngine';

seedInitialGraph();
const kg = KnowledgeGraph.getInstance();

const distributionService = new PlanningDistributionService();
const assignmentService = new PlanningAssignmentService();

const irb = [ { id: 'prog-1', nama: 'Program Literasi' } ];
const kegiatan = { id: 'keg-1', programId: 'prog-1', nama: 'Kegiatan Literasi' };
const obj = { id: 'tujuan-1', nama: 'Tujuan Literasi' };
const idx = 0;

const distYearStr = distributionService.assignYearToActivity('RKT-GEN-' + idx, idx);
const rktId = 'RKT-' + distYearStr + '-' + (idx + 1);

const distribution = {
    planningYear: parseInt(distYearStr.replace('Y', '')),
    activityReferenceId: rktId,
    priorityOrder: 1,
    dependencyReferences: [],
    recommendedQuarter: 1,
    recommendedSemester: 1,
    recommendedSequence: 1
};

const rktObj = {
    id: rktId,
    rkjmObjectiveId: obj.id,
    activity: irb[0].nama,
    subActivity: kegiatan.nama,
    target: 'Semua Guru & Siswa',
    status: 'synced'
};

const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
const opActivity = OperationalPlanningMapper.fromDistribution('OP-' + rktId, irb[0].id, distribution);
if (assignmentResult.success && assignmentResult.assignment) {
    opActivity.planningYear = assignmentResult.assignment.planningYear;
}

const flatPlanningAssignments = [{
    activityReferenceId: opActivity.activityReferenceId,
    planningYear: opActivity.planningYear
}];

const engine = new RKTProjectionEngine();
const result = engine.projectYear(1, [opActivity], flatPlanningAssignments as any, kg, '1.0', 'admin');

result.projections.forEach(p => {
    console.log('Activity ID: ' + p.activityId);
    console.log('Program ID: ' + p.programId);
    console.log('Strategic Objective ID: ' + p.strategicObjectiveId);
    
    console.log('
Lookup Activity (' + p.activityId + '):');
    const act = kg.getNode(p.activityId);
    if (act) {
        console.log('SUCCESS -> ' + act.title);
    } else {
        console.log('FAILED -> NULL');
    }

    console.log('
Lookup Program (' + p.programId + '):');
    const prog = kg.getNode(p.programId);
    if (prog) {
        console.log('SUCCESS -> ' + prog.title);
    } else {
        console.log('FAILED -> NULL');
    }
    
    console.log('
Missing Fields:');
    console.log('Program Name becomes Unknown Program because Program Lookup FAILED. Actual value in projection: ' + p.programName);
    console.log('Activity Name becomes Unknown Activity because Activity Lookup FAILED. Actual value in projection: ' + p.activityName);
    console.log('Strategic Objective becomes Unknown Strategic Objective because Program Lookup FAILED. Actual value in projection: ' + p.strategicObjectiveId);
});
