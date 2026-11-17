const fs = require('fs');
let file = fs.readFileSync('src/modules/supervision/persistence/firestore/UatSeeder.ts', 'utf8');

file = file.replace(/status: SupervisionStatus.IN_PROGRESS/g, "status: SupervisionStatus.COMPLETED");
file = file.replace(/status: ObservationStatus.SUBMITTED/g, "status: ObservationStatus.COMPLETED");
file = file.replace(
`  const planRepo = new FirestoreSupervisionRepository();
  const plan = {
    id: planId,
    title: "Program Supervisi Ganjil 2026",
    description: JSON.stringify({ periode: "Juli - Desember 2026", fokus: "Pembelajaran Berdiferensiasi", sasaran: "Seluruh Guru Kelas" }),
    calendarSnapshot: { academicYear: "2026/2027", semester: "Ganjil" },
    status: SupervisionStatus.COMPLETED,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await planRepo.create(plan);`,
`  const planRepo = new FirestoreSupervisionRepository();
  const plan = await planRepo.create({
    planId: planId,
    title: "Program Supervisi Ganjil 2026",
    academicYear: "2026/2027",
    semester: "Ganjil"
  });
  const planUpdate = { ...plan, description: JSON.stringify({ periode: "Juli - Desember 2026", fokus: "Pembelajaran Berdiferensiasi", sasaran: "Seluruh Guru Kelas" }), status: SupervisionStatus.COMPLETED };
  await planRepo.update(planId, planUpdate);`
);

file = file.replace(
`teacherSnapshot: { id: teacherId, name: "Guru A", nip: "198001012010011001", subject: "Matematika" }`,
`teacherSnapshot: { id: teacherId, name: "Guru A", nip: "198001012010011001", subject: "Matematika", rank: "Gol. III/b" }`
);

file = file.replace(
`teacherSnapshot: schedule.teacherSnapshot`,
`teacherSnapshot: { id: teacherId, name: "Guru A", nip: "198001012010011001", subject: "Matematika", rank: "Gol. III/b" }`
);

fs.writeFileSync('src/modules/supervision/persistence/firestore/UatSeeder.ts', file);
