import fs from 'fs';

// Read Tampuyak to parse KnowledgeBase
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// I will extract KnowledgeBase
const kbMatch = code.match(/const KnowledgeBase = \{[\s\S]*?Policies: \{[\s\S]*?\},[\s\S]*?\};/);
let policies = [];
if (kbMatch) {
    let kbCode = kbMatch[0].replace('const KnowledgeBase =', 'global.KnowledgeBase =');
    try {
        eval(kbCode);
        policies = global.KnowledgeBase.Policies.v2025;
    } catch(e) {
        console.error("Eval error", e);
    }
}

const DecisionEngine = {
  Rules: {
    MaxPrioritas: 3,
    MaxProgram: 5,
    MaxKegiatan: 10,
  }
};

let topPrioritas = [ { dimensi: "Kualitas Pembelajaran", gap: 10, target: 100 } ];
const topProgram: any[] = [];
const topKegiatan: any[] = [];

policies.forEach((policy: any) => {
  if (
    topProgram.length < DecisionEngine.Rules.MaxProgram &&
    (policy.kategori === "Pembelajaran" ||
      policy.kategori === "Karakter" ||
      policy.kategori === "Budaya Sekolah")
  ) {
    let progId = `prog-${Math.random()}`;
    topProgram.push({
      id: progId,
      nama: policy.programRekomendasi[0] || "Program Intervensi Spesifik",
      kebijakanId: policy.id,
      namaKebijakan: policy.nama,
      status: "Draf",
    });

    if (topKegiatan.length < DecisionEngine.Rules.MaxKegiatan) {
      topKegiatan.push({
        id: `keg-${Math.random()}`,
        nama: `Penerapan ${policy.programRekomendasi[0] || "Program"} di sekolah`,
        programId: progId,
        status: "Draf",
      });
      topKegiatan.push({
        id: `keg-${Math.random()}`,
        nama: `Evaluasi berkala pelaksanaan ${policy.programRekomendasi[0] || "Program"}`,
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

// Map to objectives (1:1 with programs as seen in Tampuyak)
const objectives = analysisData.program.map((prog: any, idx: number) => {
    return {
        id: `OBJ-IRB-${idx + 1}`,
        strategicObjective: prog.nama,
        originatingPriority: prog.kebijakanId
    };
});

// Output
console.log("=== RELATIONSHIP VERIFICATION ===");
objectives.forEach((obj: any, idx: number) => {
    const prog = analysisData.program[idx];
    const kegiatans = analysisData.kegiatan.filter(k => k.programId === prog.id);
    
    console.log(`\nObjective: ${obj.strategicObjective}`);
    console.log(`↓ Program ID: ${prog.id} | Name: ${prog.nama}`);
    kegiatans.forEach(keg => {
        console.log(`  ↓ Activity: ${keg.nama}`);
        // In the broken code, only ONE operational activity is created for the WHOLE objective!
        if (keg === kegiatans[0]) {
             console.log(`    ↓ Operational Activity: OP-RKT-Y1-${idx + 1}`);
        } else {
             console.log(`    ↓ Operational Activity: (MISSING DUE TO FLATTENING)`);
        }
    });
});

console.log("\n=== COUNT ===");
console.log("Total Strategic Objectives:", objectives.length);
console.log("Total Programs:", analysisData.program.length);
console.log("Total Activities:", analysisData.kegiatan.length);
console.log("Total Operational Activities:", objectives.length); // Because Tampuyak iterates on `objectives`

console.log("\n=== AUDIT RESULTS ===");
console.log("1. Total Objectives:", objectives.length);
console.log("2. Total Programs:", analysisData.program.length);
console.log("3. Total Activities:", analysisData.kegiatan.length);
console.log("4. Total AnnualPlanningActivities:", objectives.length);
console.log("5. Total OperationalPlanningActivities:", objectives.length);
console.log("6. Missing Activities:", analysisData.kegiatan.length - objectives.length);
console.log("7. Flattening Location: RelationalPlanningView around line 10044");
console.log("8. Responsible File: src/Tampuyak.tsx");
console.log("9. Responsible Function: RelationalPlanningView (memo block)");
console.log("10. Minimal Fix: Change `objectives.forEach` to `analysisData.kegiatan.forEach`. For each kegiatan, look up its `programId` to find the parent Program and Strategic Objective, then create one RKT (AnnualPlanningActivity) and one OperationalPlanningActivity per kegiatan.");

