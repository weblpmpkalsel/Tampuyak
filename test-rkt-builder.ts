import { RKTProjectionEngine } from './src/rkt/RKTProjectionEngine';
import { RKTDocumentBuilder } from './src/RKTDocument/RKTDocumentBuilder';
import { OperationalPlanningActivity } from './src/planning/OperationalPlanningActivity';
import { PlanningAssignment } from './src/planning/PlanningAssignment';
import { KnowledgeGraph } from './src/SPKG';

const kg = KnowledgeGraph.getInstance();
kg.clear();

let mockNodes = new Map<string, any>();
(kg as any).getNode = (id: string) => mockNodes.get(id);

function runTest(numActivities: number) {
    mockNodes.clear();
    const opActivities: OperationalPlanningActivity[] = [];
    const assignments: PlanningAssignment[] = [];
    
    // Add real school identity
    const schoolIdentity = {
        name: 'SDN Nusantara 1',
        npsn: '12345678',
        address: 'Jl. Pendidikan No. 1'
    };

    for (let i = 1; i <= numActivities; i++) {
        const yearLabel = 'Y1';
        
        const objId = `obj-${Math.ceil(i/100)}`;
        const progId = `prog-${Math.ceil(i/10)}`;
        const actId = `act-${i}`;
        
        if (!mockNodes.has(objId)) {
            mockNodes.set(objId, { id: objId, type: 'StrategicObjective', title: `Objective ${objId}` });
        }
        if (!mockNodes.has(progId)) {
            mockNodes.set(progId, { id: progId, type: 'StrategicProgram', title: `Program ${progId}`, parentId: objId });
        }
        mockNodes.set(actId, { 
            id: actId, 
            type: 'Activity', 
            title: `Activity ${actId}`,
            data: {
                target: `Target ${i}`,
                successIndicator: `Indicator ${i}`,
                personInCharge: `PIC ${i}`,
                budgetReference: `Budget Ref ${i}`,
                monitoringReference: `Monitoring Ref ${i}`
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

    const preKgSize = mockNodes.size;
    const preOpSize = opActivities.length;
    const preAssignSize = assignments.length;

    const engine = new RKTProjectionEngine();
    const result = engine.projectYear(1, opActivities, assignments, kg, '1.0.0', 'admin');
    
    const builder = new RKTDocumentBuilder();
    
    const startTime = performance.now();
    const document = builder.buildDocument(result, schoolIdentity);
    const endTime = performance.now();
    
    const buildTime = endTime - startTime;
    
    let pass = true;
    let reasons: string[] = [];
    
    // 2. Document Structure
    if (!document.cover) { pass = false; reasons.push("Missing cover"); }
    if (!document.toc) { pass = false; reasons.push("Missing toc"); }
    if (!document.chapter1) { pass = false; reasons.push("Missing chapter 1"); }
    if (!document.chapter2) { pass = false; reasons.push("Missing chapter 2"); }
    if (!document.chapter3) { pass = false; reasons.push("Missing chapter 3"); }
    if (!document.chapter4) { pass = false; reasons.push("Missing chapter 4"); }
    if (!document.chapter5) { pass = false; reasons.push("Missing chapter 5"); }
    if (!document.appendix) { pass = false; reasons.push("Missing appendix"); }

    // 3. Activity Integrity
    const ch3Table = document.chapter3?.sections[0]?.tables?.[0]?.data || [];
    if (ch3Table.length !== numActivities) { pass = false; reasons.push(`Chapter 3 rows mismatch: ${ch3Table.length} vs ${numActivities}`); }
    const ch3Ids = new Set(ch3Table.map(r => r.Kegiatan));
    if (ch3Ids.size !== numActivities) { pass = false; reasons.push("Duplicates in Chapter 3"); }

    // 4. Budget Integrity
    const ch4Table = document.chapter4?.sections[0]?.tables?.[0]?.data || [];
    if (ch4Table.length !== numActivities) { pass = false; reasons.push(`Chapter 4 rows mismatch: ${ch4Table.length} vs ${numActivities}`); }
    
    // 5. Monitoring Integrity
    const ch5Table = document.chapter5?.sections[0]?.tables?.[0]?.data || [];
    if (ch5Table.length !== numActivities) { pass = false; reasons.push(`Chapter 5 rows mismatch: ${ch5Table.length} vs ${numActivities}`); }

    // 7. Placeholder Audit
    const jsonStr = JSON.stringify(document);
    const placeholders = ['Belum tersedia', 'Belum ditetapkan', 'Lorem Ipsum', 'TODO', 'Dummy', 'Sample'];
    for (const p of placeholders) {
        if (jsonStr.includes(p)) {
            pass = false; reasons.push(`Found placeholder: ${p}`);
        }
    }

    // 10. Immutability
    if (mockNodes.size !== preKgSize) { pass = false; reasons.push("KG modified"); }
    if (opActivities.length !== preOpSize) { pass = false; reasons.push("OpActivities modified"); }
    if (assignments.length !== preAssignSize) { pass = false; reasons.push("Assignments modified"); }

    return {
        numActivities,
        pass,
        reasons,
        buildTime
    };
}

const results = [
    runTest(100),
    runTest(500),
    runTest(1000)
];

console.log(JSON.stringify(results, null, 2));
