import { RKTProjectionEngine } from './src/rkt/RKTProjectionEngine';
import { OperationalPlanningActivity } from './src/planning/OperationalPlanningActivity';
import { PlanningAssignment } from './src/planning/PlanningAssignment';
import { KnowledgeGraph } from './src/SPKG';

const kg = KnowledgeGraph.getInstance();
kg.clear();

kg.getNode = (id: string) => {
    if (id === 'act-1') return { id: 'act-1', type: 'Activity', title: 'Test Activity 1', data: { target: '100%' }, description: '', evidence: [], source: '', createdBy: '', generatedBy: '', createdAt: 0, updatedAt: 0, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 };
    if (id === 'prog-1') return { id: 'prog-1', type: 'StrategicProgram', title: 'Test Program 1', data: { objectiveId: 'obj-1' }, description: '', evidence: [], source: '', createdBy: '', generatedBy: '', createdAt: 0, updatedAt: 0, childrenIds: [], confidenceScore: 100, status: 'Active', version: 1 };
    return undefined;
} as any;

const opActivities: OperationalPlanningActivity[] = [
    {
        operationalPlanningId: 'op-1',
        activityReferenceId: 'act-1',
        programReferenceId: 'prog-1',
        planningYear: 'Y1',
        semester: 1,
        quarter: 1,
        priority: 'HIGH',
        sequence: 1,
        dependencyReferences: [],
        recommendationReferences: [],
        executionReference: null,
        status: 'PLANNED',
        metadata: {}
    }
];

const assignments: PlanningAssignment[] = [
    {
        assignmentId: 'assign-1',
        activityReferenceId: 'act-1',
        planningCycleId: 'cycle-1',
        planningSnapshotVersion: '1.0',
        planningYear: 'Y1',
        semester: 2,
        quarter: 3,
        priority: 'HIGH',
        sequence: 1,
        dependencyReferences: [],
        recommendationReferences: [],
        assignmentStatus: 'APPROVED',
        assignmentSource: 'MANUAL',
        assignmentReason: '',
        createdAt: 0,
        createdBy: 'user-1',
        businessRuleVersion: '1.0',
        assignmentVersion: '1.0',
        schemaVersion: '1.0',
        metadata: {}
    }
];

const engine = new RKTProjectionEngine();
const result = engine.projectYear(1, opActivities, assignments, kg, '1.0.0', 'admin');

console.log(JSON.stringify(result, null, 2));
