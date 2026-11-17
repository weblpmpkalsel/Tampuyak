const fs = require('fs');
const engine = require('./dist-test/DocumentSynchronizationEngine.js').DocumentSynchronizationEngine;
const rp = require('./src/planning/PlanningDistributionService');

const settings = {
    analisis: {
        status: "Disetujui",
        data: {
            program: [{ id: 'prog-1', nama: 'Program 1' }],
            kegiatan: [{ id: 'keg-1', programId: 'prog-1', nama: 'Kegiatan A' }, { id: 'keg-2', programId: 'prog-1', nama: 'Kegiatan B' }]
        }
    }
};

const eng = new engine();
try {
  const result = eng.synchronize(settings, {});
  console.log("Sync success");
} catch(e) {
  console.log("Sync error", e.message);
}
