const { DocumentSynchronizationEngine } = require('./dist-test/DocumentSynchronizationEngine.js');
const settings = {
    analisis: {
        status: "Disetujui",
        data: {
            program: [{ id: 'prog-1', nama: 'Program 1' }],
            kegiatan: [{ id: 'keg-1', programId: 'prog-1', nama: 'Kegiatan A' }, { id: 'keg-2', programId: 'prog-1', nama: 'Kegiatan B' }]
        }
    }
};

const engine = new DocumentSynchronizationEngine();
const res = engine.synchronize(settings, {});

const annualPlans = res.relationalPlanning.annualPlans;
console.log('Object.keys(annualPlans):');
console.log(JSON.stringify(Object.keys(annualPlans), null, 2));

console.log('Y1.rkt.length:', annualPlans.Y1.rkt.length);
console.log('Y2.rkt.length:', annualPlans.Y2.rkt.length);
console.log('Y3.rkt.length:', annualPlans.Y3.rkt.length);
console.log('Y4.rkt.length:', annualPlans.Y4.rkt.length);
