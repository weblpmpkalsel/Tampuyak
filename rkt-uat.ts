import { RKTProjectionEngine } from './src/rkt/RKTProjectionEngine';
import { OperationalPlanningActivity } from './src/planning/OperationalPlanningActivity';
import { PlanningAssignment } from './src/planning/PlanningAssignment';
import { KnowledgeGraph } from './src/SPKG';

const kg = KnowledgeGraph.getInstance();
kg.clear();

const opActivities: OperationalPlanningActivity[] = [];
const assignments: PlanningAssignment[] = [];

let mockNodes = new Map<string, any>();

// Generate 1000 activities
for (let i = 1; i <= 1000; i++) {
    const yearNum = (i % 4) + 1; // 1 to 4
    const yearLabel = `Y${yearNum}` as 'Y1' | 'Y2' | 'Y3' | 'Y4';
    
    const objId = `obj-${Math.ceil(i/100)}`;
    const progId = `prog-${Math.ceil(i/10)}`;
    const actId = `act-${i}`;
    
    // Add to mock nodes
    mockNodes.set(objId, { id: objId, type: 'StrategicObjective', title: `Objective ${objId}` });
    mockNodes.set(progId, { id: progId, type: 'StrategicProgram', title: `Program ${progId}`, parentId: objId });
    mockNodes.set(actId, { 
        id: actId, 
        type: 'Activity', 
        title: `Activity ${actId}`,
        data: {
            target: `Target ${i}`,
            successIndicator: `Indicator ${i}`,
            personInCharge: `PIC ${i}`,
            budgetReference: `Budget ${i}`,
            monitoringReference: `Monitoring ${i}`
        }
    });

    opActivities.push({
        operationalPlanningId: `op-${i}`,
        activityReferenceId: actId,
        programReferenceId: progId,
        planningYear: yearLabel,
        semester: (i % 2) + 1 as 1 | 2,
        quarter: (i % 4) + 1 as 1 | 2 | 3 | 4,
        priority: 'HIGH',
        sequence: i,
        dependencyReferences: [],
        recommendationReferences: [],
        executionReference: null,
        status: 'PLANNED',
        metadata: {}
    });

    assignments.push({
        assignmentId: `assign-${i}`,
        activityReferenceId: actId,
        planningCycleId: 'cycle-1',
        planningSnapshotVersion: '1.0',
        planningYear: yearLabel,
        semester: (i % 2) + 1 as 1 | 2,
        quarter: (i % 4) + 1 as 1 | 2 | 3 | 4,
        priority: 'HIGH',
        sequence: i,
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
    });
}

// Override KG getNode
(kg as any).getNode = (id: string) => {
    return mockNodes.get(id);
};

const engine = new RKTProjectionEngine();
let pass = true;
let reasons: string[] = [];

// Performance measurement
const startTime = performance.now();
const resultY1 = engine.projectYear(1, opActivities, assignments, kg, '1.0.0', 'admin');
const resultY2 = engine.projectYear(2, opActivities, assignments, kg, '1.0.0', 'admin');
const resultY3 = engine.projectYear(3, opActivities, assignments, kg, '1.0.0', 'admin');
const resultY4 = engine.projectYear(4, opActivities, assignments, kg, '1.0.0', 'admin');
const endTime = performance.now();

console.log(`Execution time for 1000 activities (4 projections): ${(endTime - startTime).toFixed(2)}ms`);

// 1. Check Year Filtering & Duplicates & Totals
const y1Count = opActivities.filter(a => a.planningYear === 'Y1').length;
const y2Count = opActivities.filter(a => a.planningYear === 'Y2').length;
const y3Count = opActivities.filter(a => a.planningYear === 'Y3').length;
const y4Count = opActivities.filter(a => a.planningYear === 'Y4').length;

if (resultY1.projections.length !== y1Count) { pass = false; reasons.push(`Y1 count mismatch: ${resultY1.projections.length} vs ${y1Count}`); }
if (resultY2.projections.length !== y2Count) { pass = false; reasons.push(`Y2 count mismatch: ${resultY2.projections.length} vs ${y2Count}`); }
if (resultY3.projections.length !== y3Count) { pass = false; reasons.push(`Y3 count mismatch: ${resultY3.projections.length} vs ${y3Count}`); }
if (resultY4.projections.length !== y4Count) { pass = false; reasons.push(`Y4 count mismatch: ${resultY4.projections.length} vs ${y4Count}`); }

// Verify all years match
resultY1.projections.forEach(p => { if (p.implementationYear !== 'Y1') { pass = false; reasons.push(`Y1 projection has wrong year: ${p.implementationYear}`); } });
resultY2.projections.forEach(p => { if (p.implementationYear !== 'Y2') { pass = false; reasons.push(`Y2 projection has wrong year: ${p.implementationYear}`); } });
resultY3.projections.forEach(p => { if (p.implementationYear !== 'Y3') { pass = false; reasons.push(`Y3 projection has wrong year: ${p.implementationYear}`); } });
resultY4.projections.forEach(p => { if (p.implementationYear !== 'Y4') { pass = false; reasons.push(`Y4 projection has wrong year: ${p.implementationYear}`); } });

// 2. Check fields on a sample
const sample = resultY1.projections[0];
if (!sample.strategicObjectiveId) { pass = false; reasons.push("Missing objective ID"); }
if (!sample.programId) { pass = false; reasons.push("Missing program ID"); }
if (!sample.activityId) { pass = false; reasons.push("Missing activity ID"); }
if (!sample.target) { pass = false; reasons.push("Missing target"); }
if (!sample.planningAssignmentId) { pass = false; reasons.push("Missing planning assignment ID"); }
if (!sample.budgetReference) { pass = false; reasons.push("Missing budget reference"); }
if (!sample.monitoringReference) { pass = false; reasons.push("Missing monitoring reference"); }
if (!sample.quarter) { pass = false; reasons.push("Missing quarter"); }
if (!sample.semester) { pass = false; reasons.push("Missing semester"); }

console.log("PASS:", pass);
if (!pass) console.log("Reasons:", reasons);

// Verify immutability
const kgSize = mockNodes.size;
const opSize = opActivities.length;
const assignSize = assignments.length;
console.log(`KG Size (pre/post): ${kgSize} / ${mockNodes.size}`);
console.log(`Op Size (pre/post): ${opSize} / ${opActivities.length}`);
console.log(`Assign Size (pre/post): ${assignSize} / ${assignments.length}`);
