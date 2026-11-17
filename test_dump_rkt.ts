import fs from 'fs';
import { RKTProjectionEngine } from './src/rkt/RKTProjectionEngine';
import { KnowledgeGraph } from './src/SPKG';

const settingsStr = fs.readFileSync('settings.json', 'utf-8').trim();
if (!settingsStr) { console.log('no settings'); process.exit(0); }
const settings = JSON.parse(settingsStr);

const p = settings.planning || {};
const rp = settings.relationalPlanning || {};
let opActivities = rp.operationalActivities || [];
if (opActivities.length === 0 && p.operationalActivities && p.operationalActivities.length > 0) {
    opActivities = p.operationalActivities;
}
if (p.rkt && p.rkt.length > 0) {
    if (opActivities.length === 0) {
        opActivities = p.rkt.map((rktObj: any, idx: number) => {
            const q = (idx % 4) + 1;
            const s = q <= 2 ? 1 : 2;
            return {
                operationalPlanningId: `OP-${rktObj.id || Math.random().toString(36).substring(7)}`,
                activityReferenceId: rktObj.id || Math.random().toString(36).substring(7),
                programReferenceId: rktObj.programId || 'UNKNOWN',
                planningYear: 'Y1',
                semester: s as 1 | 2,
                quarter: q as 1 | 2 | 3 | 4,
                priority: 'HIGH',
                sequence: 1,
                dependencyReferences: [],
                recommendationReferences: [],
                executionReference: null,
                status: 'PLANNED',
                metadata: {
                    programName: rktObj.program,
                    activityName: rktObj.activity,
                    target: rktObj.successTarget || rktObj.target,
                    performanceIndicator: rktObj.outcome || rktObj.successIndicator,
                    personInCharge: rktObj.personResponsible || rktObj.personInCharge
                }
            };
        });
    }
}
const kg = KnowledgeGraph.getInstance();
const engine = new RKTProjectionEngine();
const result = engine.projectYear(1, opActivities, [], kg, '1.0', 'admin');
console.log(JSON.stringify(result.projections.slice(0, 3), null, 2));
