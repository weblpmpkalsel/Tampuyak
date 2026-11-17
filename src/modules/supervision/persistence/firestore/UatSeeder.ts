import { v4 as uuidv4 } from 'uuid';
import { FirestoreInstrumentRepository } from './FirestoreInstrumentRepository';
import { FirestoreSupervisionRepository } from './FirestoreSupervisionRepository';
import { FirestoreScheduleRepository } from './FirestoreScheduleRepository';
import { FirestoreObservationRepository } from './FirestoreObservationRepository';
import { FirestorePostObservationRepository } from './FirestorePostObservationRepository';
import { FirestoreFollowUpRepository } from './FirestoreFollowUpRepository';
import {
  SupervisionStatus,
  ObservationStatus,
  CoachingStatus,
  ActionPlanStatus,
  RecommendationPriority,
  SupervisionScoreCategory
} from '../../types/SupervisionTypes';

export async function seedUatScenario() {
  const planId = uuidv4();
  const scheduleId = uuidv4();
  const teacherId = uuidv4();
  
  // 1. Plan
  const planRepo = new FirestoreSupervisionRepository();
  const plan = await planRepo.create({
    planId: planId,
    title: "Program Supervisi Ganjil 2026",
    academicYear: "2026/2027",
    semester: "Ganjil"
  });
  const planUpdate = { ...plan, description: JSON.stringify({ periode: "Juli - Desember 2026", fokus: "Pembelajaran Berdiferensiasi", sasaran: "Seluruh Guru Kelas" }), status: SupervisionStatus.COMPLETED };
  await planRepo.update(planId, planUpdate);

  // 2. Instrument
  const instRepo = new FirestoreInstrumentRepository();
  const instruments = await instRepo.findAll();
  let instrumentId = instruments[0]?.id;
  if (!instrumentId) {
    // Need to seed instrument first
    instrumentId = uuidv4();
    await instRepo.create({
      id: instrumentId,
      name: "Instrumen Standar",
      status: SupervisionStatus.COMPLETED,
      categories: [{ id: "cat1", name: "Pedagogik", weight: 100 }],
      items: [{ id: "item1", categoryId: "cat1", description: "Guru menggunakan media interaktif", maxScore: 100 }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  // 3. Schedule
  const scheduleRepo = new FirestoreScheduleRepository();
  const schedule = {
    id: scheduleId,
    planId: planId,
    teacherSnapshot: { id: teacherId, name: "Guru A", nip: "198001012010011001", subject: "Guru Kelas V", rank: "Gol. III/b" },
    supervisor: { id: "sup1", name: "Ahmad Dahlan", role: "HEADMASTER" },
    scheduledDate: Date.now(),
    status: SupervisionStatus.COMPLETED,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await scheduleRepo.create(schedule);

  // 4. Observation
  const obsRepo = new FirestoreObservationRepository();
  const observation = {
    id: uuidv4(),
    supervisionId: scheduleId, // matches where('supervisionId', '==', scheduleId)
    session: {
      id: uuidv4(),
      supervisionId: scheduleId,
      teacherSnapshot: { id: teacherId, name: "Guru A", nip: "198001012010011001", subject: "Guru Kelas V", rank: "Gol. III/b" },
      instrumentSnapshot: instruments[0] || { id: instrumentId, name: "Instrumen Standar", categories: [], items: [], status: SupervisionStatus.COMPLETED, createdAt: Date.now(), updatedAt: Date.now() },
      startTime: Date.now(),
      className: "Kelas V",
      subjectName: "Guru Kelas V",
      studentCount: 30
    },
    scores: [{ rubricItemId: "item1", score: 85 }],
    notes: [{ id: uuidv4(), observationId: uuidv4(), content: "Guru menggunakan media dengan sangat baik.", timestamp: Date.now() }],
    evidences: [],
    finalScoreCategory: SupervisionScoreCategory.BAIK,
    status: ObservationStatus.COMPLETED,
    completedAt: Date.now()
  };
  await obsRepo.create(observation);

  // 5. Post Observation
  const poRepo = new FirestorePostObservationRepository();
  const po = {
    id: uuidv4(),
    supervisionId: scheduleId,
    coaching: {
      id: uuidv4(),
      supervisionId: scheduleId,
      assessorNotes: "Perlu peningkatan di manajemen waktu.",
      agreedCommitment: "Saya akan membuat RPP yang lebih realistis durasinya.",
      status: CoachingStatus.AGREED,
      conductedAt: Date.now()
    },
    completedAt: Date.now()
  };
  await poRepo.create(po);

  // 6. RTL (FollowUp)
  const fuRepo = new FirestoreFollowUpRepository();
  const fu = {
    id: uuidv4(),
    supervisionId: scheduleId,
    actionPlans: [
      {
        id: uuidv4(),
        title: "Mengikuti Pelatihan Manajemen Waktu",
        description: "Ikut webinar durasi 2 jam tentang manajemen kelas.",
        target: "Sertifikat",
        targetDate: Date.now() + 86400000 * 7, // 7 days from now
        priority: RecommendationPriority.MEDIUM,
        status: ActionPlanStatus.NOT_STARTED
      }
    ],
    createdAt: Date.now()
  };
  await fuRepo.create(fu);

  console.log("Seeding complete! planId:", planId, "scheduleId:", scheduleId);
  return { planId, scheduleId };
}
