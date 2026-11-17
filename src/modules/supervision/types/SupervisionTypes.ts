/**
 * Tipe Data dan Antarmuka untuk Modul Supervisi Akademik.
 * PENTING: File ini HANYA berisi deklarasi tipe. Tidak ada logika bisnis.
 * Menerapkan Domain Driven Design (DDD) dan Read-Only Snapshots.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum SupervisionStatus {
  DRAFT = 'DRAFT',
  READY_FOR_SCHEDULING = 'READY_FOR_SCHEDULING',
  PLANNED = 'PLANNED',
  SCHEDULED = 'SCHEDULED',
  PRE_OBSERVATION = 'PRE_OBSERVATION',
  OBSERVATION = 'OBSERVATION',
  POST_OBSERVATION = 'POST_OBSERVATION',
  WAITING_FOR_FOLLOW_UP = 'WAITING_FOR_FOLLOW_UP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ObservationStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NEEDS_REVISION = 'NEEDS_REVISION'
}

export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum EvidenceType {
  DOCUMENT_LINK = 'DOCUMENT_LINK',
  IMAGE = 'IMAGE',
  VIDEO_LINK = 'VIDEO_LINK',
  TEXT_NOTE = 'TEXT_NOTE'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CoachingStatus {
  SCHEDULED = 'SCHEDULED',
  CONDUCTED = 'CONDUCTED',
  AGREED = 'AGREED'
}

export enum SupervisionScoreCategory {
  SANGAT_BAIK = 'SANGAT_BAIK',
  BAIK = 'BAIK',
  CUKUP = 'CUKUP',
  KURANG = 'KURANG'
}

// ============================================================================
// READ-ONLY SNAPSHOTS
// ============================================================================

/**
 * TeacherSnapshot
 * Deskripsi: Rekaman statis dari profil guru pada saat supervisi dimulai.
 * Tujuan: Membekukan data identitas guru agar laporan tidak berubah meski data asli diupdate.
 * Lifecycle: Dibuat saat jadwal ditetapkan, tidak pernah diupdate.
 * Ownership: Supervision Module
 * ReadOnly Source: OrganizationProfile (Guru)
 */
export interface TeacherSnapshot {
  readonly id: string;
  readonly nip: string;
  readonly name: string;
  readonly subject: string;
  readonly rank: string;
}

/**
 * Supervisor
 * Deskripsi: Informasi asesor atau supervisor yang ditugaskan.
 * Tujuan: Menyimpan siapa yang bertanggung jawab melakukan observasi.
 * Lifecycle: Ditetapkan saat jadwal dibuat.
 * Ownership: Supervision Module
 * ReadOnly Source: OrganizationProfile
 */
export interface Supervisor {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

/**
 * Teacher
 * Deskripsi: Data singkat guru yang terkait.
 * Tujuan: Referensi cepat dalam daftar jadwal.
 * Lifecycle: Sama dengan TeacherSnapshot.
 * Ownership: Supervision Module
 * ReadOnly Source: OrganizationProfile
 */
export interface Teacher {
  readonly id: string;
  readonly name: string;
}

/**
 * TeachingModuleSnapshot
 * Deskripsi: Rekaman dari Perangkat Ajar/Modul Ajar (RPP) yang ditelaah.
 * Tujuan: Mengunci versi RPP yang dinilai saat observasi.
 * Lifecycle: Dibuat pada fase Pra-Observasi.
 * Ownership: Supervision Module
 * ReadOnly Source: KSP / Eksternal
 */
export interface TeachingModuleSnapshot {
  readonly title: string;
  readonly topic: string;
  readonly url: string;
  readonly version: string;
}

/**
 * RktProgramSnapshot
 * Deskripsi: Rekaman program RKT yang menjadi acuan supervisi.
 * Tujuan: Memastikan supervisi berakar pada program yang valid tanpa bergantung langsung ke database RKT.
 * Lifecycle: Disalin saat pembuatan Program Supervisi.
 * Ownership: Supervision Module
 * ReadOnly Source: Planning Engine (RKT)
 */
export interface RktProgramSnapshot {
  readonly programId: string;
  readonly programName: string;
  readonly year: string;
}

/**
 * AcademicCalendarSnapshot
 * Deskripsi: Rekaman semester dan tahun akademik aktif.
 * Tujuan: Referensi waktu pelaksanaan.
 * Lifecycle: Disalin saat inisialisasi program supervisi.
 * Ownership: Supervision Module
 * ReadOnly Source: Academic Calendar
 */
export interface AcademicCalendarSnapshot {
  readonly academicYear: string;
  readonly semester: string;
}

// ============================================================================
// CORE DOMAIN MODELS
// ============================================================================

/**
 * SupervisionPlan
 * Deskripsi: Program Supervisi keseluruhan untuk satu sekolah dalam satu periode.
 * Tujuan: Menjadi payung atau kontainer bagi seluruh jadwal supervisi guru.
 * Lifecycle: Dibuat (Draft) -> Disahkan (Published) -> Selesai di akhir semester (Completed).
 * Ownership: Supervision Module
 */
export interface SupervisionPlan {
  id: string;
  title: string;
  description: string;
  calendarSnapshot: AcademicCalendarSnapshot;
  rktReference?: RktProgramSnapshot;
  instrumentSnapshot?: SupervisionInstrument;
  status: SupervisionStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * SupervisionSchedule
 * Deskripsi: Penjadwalan spesifik untuk satu guru.
 * Tujuan: Menetapkan waktu, asesor, dan guru yang terlibat.
 * Lifecycle: Dibuat -> Dijadwalkan -> Selesai/Batal.
 * Ownership: Supervision Module
 */
export interface SupervisionSchedule {
  id: string;
  planId: string;
  teacherSnapshot: TeacherSnapshot;
  supervisor: Supervisor;
  scheduledDate: number;
  status: SupervisionStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * Supervision
 * Deskripsi: Aggregate root dari seluruh proses supervisi individu.
 * Tujuan: Mengumpulkan jadwal, observasi, coaching, dan RTL menjadi satu kesatuan.
 * Lifecycle: Mengikuti SupervisionSchedule, berujung pada RTL.
 * Ownership: Supervision Module
 */
export interface Supervision {
  id: string;
  scheduleId: string;
  status: SupervisionStatus;
  preObservationId?: string;
  observationId?: string;
  postObservationId?: string;
  followUpId?: string;
}

/**
 * PreObservation
 * Deskripsi: Data telaah administrasi dan perangkat ajar sebelum masuk kelas.
 * Tujuan: Mengevaluasi kelengkapan RPP/Modul Ajar.
 * Lifecycle: Dibuat -> Dinilai -> Disetujui (Selesai).
 * Ownership: Supervision Module
 */
export interface PreObservation {
  id: string;
  supervisionId: string;
  moduleSnapshot: TeachingModuleSnapshot;
  notes: string;
  isReadyForObservation: boolean;
  status: ObservationStatus;
  completedAt?: number;
}

/**
 * ObservationSession
 * Deskripsi: Informasi mengenai pelaksanaan observasi kelas.
 * Tujuan: Merekam konteks waktu, tempat, dan suasana saat observasi.
 * Lifecycle: Dibuat saat asesor masuk kelas -> Selesai saat observasi usai.
 * Ownership: Supervision Module
 */
export interface ObservationSession {
  id: string;
  supervisionId: string;
  teacherSnapshot: TeacherSnapshot;
  instrumentSnapshot: SupervisionInstrument;
  startTime: number;
  endTime?: number;
  className?: string;
  subjectName?: string;
  studentCount?: number;
}

/**
 * RubricCategory
 * Deskripsi: Kategori dalam rubrik penilaian (contoh: Pedagogik, Profesional, Manajerial Kelas).
 * Tujuan: Mengelompokkan item rubrik agar penilaian terstruktur.
 * Lifecycle: Statis per instrumen.
 * Ownership: Supervision Module
 */
export interface SupervisionInstrument {
  id: string;
  name: string;
  categories: RubricCategory[];
  items: RubricItem[];
  status: SupervisionStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * RubricCategory
 * Deskripsi: Kategori dalam rubrik penilaian (contoh: Pedagogik, Profesional, Manajerial Kelas).
 * Tujuan: Mengelompokkan item rubrik agar penilaian terstruktur.
 * Lifecycle: Statis per instrumen.
 * Ownership: Supervision Module
 */
export interface RubricCategory {
  id: string;
  name: string;
  weight: number; // Bobot penilaian (misal: 0.4 untuk 40%)
}

/**
 * RubricItem
 * Deskripsi: Indikator penilaian individual.
 * Tujuan: Menjadi alat ukur konkret (misal: "Guru menggunakan media interaktif").
 * Lifecycle: Statis per instrumen.
 * Ownership: Supervision Module
 */
export interface RubricItem {
  id: string;
  categoryId: string;
  description: string;
  maxScore: number;
}

/**
 * ObservationScore
 * Deskripsi: Skor yang diberikan asesor untuk satu item rubrik.
 * Tujuan: Merekam hasil evaluasi kuantitatif.
 * Lifecycle: Dibuat saat observasi -> Terkunci saat observasi selesai.
 * Ownership: Supervision Module
 */
export interface ObservationScore {
  rubricItemId: string;
  score: number;
}

/**
 * ObservationNote
 * Deskripsi: Catatan kualitatif spesifik yang dibuat asesor selama observasi.
 * Tujuan: Memberikan konteks pada skor yang diberikan.
 * Lifecycle: Dibuat selama observasi.
 * Ownership: Supervision Module
 */
export interface ObservationNote {
  id: string;
  observationId: string;
  content: string;
  timestamp: number;
}

/**
 * Evidence
 * Deskripsi: Bukti fisik/digital dari observasi.
 * Tujuan: Mendukung validitas penilaian (misal: foto papan tulis, link video).
 * Lifecycle: Diunggah selama pra-observasi atau observasi.
 * Ownership: Supervision Module
 */
export interface Evidence {
  id: string;
  type: EvidenceType;
  url: string;
  description: string;
}

/**
 * Observation
 * Deskripsi: Penggabungan sesi, skor, catatan, dan bukti dari pelaksanaan observasi di kelas.
 * Tujuan: Menyimpan seluruh hasil pemantauan.
 * Lifecycle: Draf selama observasi -> Terkunci setelah submit.
 * Ownership: Supervision Module
 */
export interface Observation {
  id: string;
  supervisionId: string;
  session: ObservationSession;
  scores: ObservationScore[];
  notes: ObservationNote[];
  evidences: Evidence[];
  finalScoreCategory: SupervisionScoreCategory | null;
  status: ObservationStatus;
  completedAt?: number;
}

/**
 * Reflection
 * Deskripsi: Refleksi diri dari guru setelah observasi.
 * Tujuan: Menggali perspektif guru mengenai kekurangannya sendiri.
 * Lifecycle: Dibuat pasca observasi, sebelum atau saat coaching.
 * Ownership: Supervision Module
 */
export interface Reflection {
  id: string;
  teacherId: string;
  content: string;
  submittedAt: number;
}

/**
 * CoachingSession
 * Deskripsi: Sesi diskusi dan bimbingan antara asesor dan guru.
 * Tujuan: Menyepakati langkah perbaikan.
 * Lifecycle: Dijadwalkan -> Dilaksanakan -> Disepakati.
 * Ownership: Supervision Module
 */
export interface CoachingSession {
  id: string;
  supervisionId: string;
  reflectionId?: string;
  assessorNotes: string;
  agreedCommitment: string;
  status: CoachingStatus;
  conductedAt?: number;
}

/**
 * PostObservation
 * Deskripsi: Keseluruhan proses pasca observasi.
 * Tujuan: Mengelompokkan refleksi dan coaching.
 * Lifecycle: Selesai setelah kesepakatan coaching ditandatangani.
 * Ownership: Supervision Module
 */
export interface PostObservation {
  id: string;
  supervisionId: string;
  coaching: CoachingSession;
  completedAt?: number;
}

/**
 * ActionPlan (RTL Item)
 * Deskripsi: Satu langkah konkret rencana tindak lanjut untuk guru.
 * Tujuan: Menetapkan target perbaikan (misal: ikut webinar).
 * Lifecycle: Diusulkan -> Disetujui -> Dijalankan.
 * Ownership: Supervision Module
 */
export enum ActionPlanStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  REVISION_NEEDED = 'REVISION_NEEDED',
  TRACKING_ACTIVE = 'TRACKING_ACTIVE',
  FOLLOW_UP_REVIEW = 'FOLLOW_UP_REVIEW',
  TRACKING_COMPLETED = 'TRACKING_COMPLETED'
}


export interface TrackingLog {
  id: string;
  date: number;
  type: 'SUPERVISOR_MONITORING' | 'TEACHER_PROGRESS';
  notes: string;
  evidenceUrl?: string;
  nextReviewDate?: number;
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  category?: string;
  target: string;
  targetDate: number;
  priority: RecommendationPriority;
  expectedEvidence?: string;
  status: ActionPlanStatus;
  teacherNotes?: string;
  verifierNotes?: string;
  evidences?: Evidence[];
  trackingLogs?: TrackingLog[];
}

/**
 * FollowUp (RTL)
 * Deskripsi: Koleksi seluruh rencana tindak lanjut dari sebuah supervisi.
 * Tujuan: Menjadi pedoman peningkatan kompetensi guru terkait.
 * Lifecycle: Dibuat pasca coaching -> Dimonitor hingga selesai.
 * Ownership: Supervision Module
 */
export interface FollowUp {
  id: string;
  supervisionId: string;
  actionPlans: ActionPlan[];
  createdAt: number;
}

/**
 * Recommendation
 * Deskripsi: Rekomendasi manajerial untuk Kepala Sekolah berdasarkan agregat supervisi.
 * Tujuan: Memberikan insight yang dapat disuntikkan ke RKT tahun berikutnya secara manual.
 * Lifecycle: Dihasilkan di akhir program -> Menunggu ditinjau -> Diterima/Ditolak.
 * Ownership: Supervision Module
 */
export interface Recommendation {
  id: string;
  planId: string;
  priority: RecommendationPriority;
  description: string;
  justification: string;
  isAcknowledged: boolean;
}

/**
 * Monitoring
 * Deskripsi: Data pelacakan pelaksanaan RTL.
 * Tujuan: Memastikan RTL benar-benar dikerjakan oleh guru.
 * Lifecycle: Dibuat saat RTL aktif -> Diupdate saat ada progres.
 * Ownership: Supervision Module
 */
export interface Monitoring {
  id: string;
  followUpId: string;
  notes: string;
  updatedAt: number;
}

/**
 * Approval
 * Deskripsi: Riwayat persetujuan dokumen oleh pihak berwenang.
 * Tujuan: Rekam jejak digital tanda tangan / persetujuan.
 * Lifecycle: Direquest -> Disetujui/Ditolak.
 * Ownership: Supervision Module
 */
export interface Approval {
  id: string;
  documentId: string; // Bisa merujuk ke Program atau Laporan Akhir
  approverId: string;
  status: ApprovalStatus;
  timestamp: number;
}

/**
 * AuditTrail
 * Deskripsi: Rekaman setiap perubahan status dalam modul supervisi.
 * Tujuan: Transparansi dan akuntabilitas proses.
 * Lifecycle: Immutable (hanya bisa ditambah, tidak bisa dihapus).
 * Ownership: Supervision Module
 */
export interface AuditTrail {
  id: string;
  entityId: string; // SupervisionId atau PlanId
  action: string;
  actorId: string;
  timestamp: number;
  metadata: Record<string, any>;
}

/**
 * DocumentReference
 * Deskripsi: Referensi ke dokumen eksternal atau laporan yang dihasilkan.
 * Tujuan: Memudahkan pencarian dokumen PDF hasil ekspor.
 * Lifecycle: Dibuat setelah PDF diekspor.
 * Ownership: Supervision Module
 */
export interface DocumentReference {
  id: string;
  title: string;
  url: string;
  generatedAt: number;
}
