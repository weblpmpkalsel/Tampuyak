import fs from 'fs';

// Simulated data generation to match Tampuyak.tsx
let policies = [
  { id: "pol-1", kategori: "Pembelajaran", nama: "Kebijakan Literasi", programRekomendasi: ["Peningkatan Kompetensi Literasi"] },
  { id: "pol-2", kategori: "Pembelajaran", nama: "Kebijakan Numerasi", programRekomendasi: ["Peningkatan Kompetensi Numerasi"] },
  { id: "pol-3", kategori: "Karakter", nama: "Kebijakan Karakter", programRekomendasi: ["Penguatan Pendidikan Karakter"] },
  { id: "pol-4", kategori: "Budaya Sekolah", nama: "Kebijakan Inklusi", programRekomendasi: ["Pendidikan Inklusif"] },
];

let topPrioritas = [ 
  { id: "prio-1", dimensi: "A.1 Kemampuan Literasi", tujuan: "Meningkatkan Literasi" }
];
const topProgram: any[] = [];
const topKegiatan: any[] = [];

policies.forEach((policy: any) => {
  if (topProgram.length < 5) {
    let progId = `prog-${topProgram.length + 1}`;
    topProgram.push({
      id: progId,
      nama: policy.programRekomendasi[0] || "Program Intervensi Spesifik",
      kebijakanId: policy.id,
      namaKebijakan: policy.nama,
      status: "Draf",
    });

    if (topKegiatan.length < 10) {
      topKegiatan.push({
        id: `keg-${topKegiatan.length + 1}`,
        nama: `Penerapan ${policy.programRekomendasi[0]} di sekolah`,
        programId: progId,
        status: "Draf",
      });
      topKegiatan.push({
        id: `keg-${topKegiatan.length + 1}`,
        nama: `Evaluasi berkala pelaksanaan ${policy.programRekomendasi[0]}`,
        programId: progId,
        status: "Draf",
      });
    }
  }
});

const analysisData = {
    prioritas: topPrioritas,
    program: topProgram,
    kegiatan: topKegiatan
};

// Strategic Objectives are generated based on Prioritas or Program?
// In RelationalPlanningView: irb = analysisData.program -> objectives = irb.map(...)
const objectives = analysisData.program.map((prog: any, idx: number) => {
    return {
        id: `OBJ-IRB-${idx + 1}`,
        strategicObjective: prog.nama,
        originatingPriority: prog.kebijakanId
    };
});

// Output Verification:
console.log("=== RELATIONSHIP VERIFICATION ===");
analysisData.kegiatan.forEach((keg: any) => {
    const prog = analysisData.program.find(p => p.id === keg.programId);
    
    // In RelationalPlanningView, objective is mapped 1:1 with program (using idx)
    // So if prog is at index i, objective is at index i.
    const progIdx = analysisData.program.findIndex(p => p.id === keg.programId);
    const obj = progIdx >= 0 ? objectives[progIdx] : null;

    console.log(`\nActivity: ${keg.nama}`);
    console.log(`↓ Program ID: ${keg.programId}`);
    console.log(`↓ Program Name: ${prog?.nama || 'ORPHAN'}`);
    console.log(`↓ Strategic Objective ID: ${obj?.id || 'ORPHAN'}`);
    console.log(`↓ Strategic Objective Name: ${obj?.strategicObjective || 'ORPHAN'}`);
    
    if (!prog || !obj) {
        console.log("=> WARNING: ORPHAN ACTIVITY DETECTED");
    }
});

