const fs = require('fs');
const DocumentSynchronizationEngine = require('./dist-test/DocumentSynchronizationEngine.js').DocumentSynchronizationEngine;

const settings = {
    analisis: {
        status: "Disetujui",
        data: {
            program: [{ id: 'prog-1', nama: 'Program 1' }],
            kegiatan: [{ id: 'keg-1', programId: 'prog-1', nama: 'Kegiatan A' }, { id: 'keg-2', programId: 'prog-1', nama: 'Kegiatan B' }]
        }
    }
};

const result = new DocumentSynchronizationEngine().synchronize(settings, {});

// Validation 1: Orphans
const objectives = result.relationalPlanning.objectives;
const programs = result.relationalPlanning.programs;
const activities = result.relationalPlanning.activities;

let hasOrphans = false;
let orphanPrograms = 0;
let orphanActivities = 0;

programs.forEach(p => {
   if(!objectives.find(o => o.id === p.objectiveId || o.id === p.rkjmObjectiveId)) {
       orphanPrograms++;
   }
});

activities.forEach(a => {
   if(!programs.find(p => p.id === a.programId)) {
       orphanActivities++;
   }
});

console.log("orphanPrograms", orphanPrograms);
console.log("orphanActivities", orphanActivities);
