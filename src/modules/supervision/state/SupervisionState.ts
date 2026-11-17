import {
  SupervisionPlan,
  SupervisionSchedule,
  Observation,
  Recommendation,
  Evidence,
  ActionPlan,
  FollowUp,
  CoachingSession,
  Reflection
} from '../types/SupervisionTypes';

// ============================================================================
// METADATA & UTILITIES (No React, Pure TypeScript)
// ============================================================================

/**
 * Keterangan Metadata State:
 * 
 * Deskripsi: Penjelasan fungsi dari state
 * Lifecycle: Kapan state dibuat dan dimusnahkan
 * Owner: Modul/Komponen yang bertanggung jawab atas state ini
 * Mutable/Immutable: Sifat modifikasi state
 * Reset Rule: Aturan kapan state harus dikembalikan ke nilai awal
 */

// ============================================================================
// 1. PERSISTENT STATE (Domain Data Cache)
// State yang merupakan salinan dari Storage/Database.
// Biasanya di-fetch sekali dan disinkronisasi ketika ada mutasi.
// ============================================================================

/**
 * Plan State
 * Deskripsi: Menyimpan daftar Program Supervisi yang aktif maupun lampau.
 * Lifecycle: Di-load saat aplikasi modul supervisi dibuka.
 * Owner: Supervision Module
 * Mutable/Immutable: Immutable (Replace on update).
 * Reset Rule: Direset (kosong) ketika ganti sekolah/organisasi atau user logout.
 */
export interface PlanState {
  readonly plans: readonly SupervisionPlan[];
  readonly currentActivePlanId: string | null;
}

/**
 * Schedule State
 * Deskripsi: Menyimpan daftar jadwal supervisi pada suatu Program aktif.
 * Lifecycle: Di-load ketika sebuah Supervision Plan dipilih.
 * Owner: Supervision Module
 * Mutable/Immutable: Immutable.
 * Reset Rule: Direset saat berpindah Supervision Plan.
 */
export interface ScheduleState {
  readonly schedules: readonly SupervisionSchedule[];
}

/**
 * Observation State
 * Deskripsi: Menyimpan data observasi, bukti, dan catatan dari suatu jadwal.
 * Lifecycle: Di-load saat masuk ke detail observasi (kelas).
 * Owner: Supervision Module
 * Mutable/Immutable: Immutable.
 * Reset Rule: Direset saat keluar dari sesi observasi atau berpindah jadwal.
 */
export interface ObservationState {
  readonly currentObservation: Observation | null;
  readonly relatedEvidences: readonly Evidence[];
  readonly reflection: Reflection | null;
  readonly coaching: CoachingSession | null;
}

/**
 * Recommendation & FollowUp State
 * Deskripsi: Menyimpan rekap rekomendasi dan RTL (Follow Up).
 * Lifecycle: Di-load saat mengakses Dasbor RTL atau Rekomendasi sekolah.
 * Owner: Supervision Module
 * Mutable/Immutable: Immutable.
 * Reset Rule: Direset saat berpindah Program Supervisi.
 */
export interface RecommendationState {
  readonly recommendations: readonly Recommendation[];
  readonly followUps: readonly FollowUp[];
}

// ============================================================================
// 2. TRANSIENT STATE (UI / Interaction State)
// State yang bersifat sementara dan tidak akan disimpan ke Database.
// ============================================================================

/**
 * Selection State
 * Deskripsi: State untuk menandai item apa yang sedang dipilih oleh user di UI.
 * Lifecycle: Dibuat saat user mengklik sesuatu, hancur saat di-deselect.
 * Owner: UI Layer / Presenter
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset saat navigasi antar menu atau aksi selesai.
 */
export interface SelectionState {
  selectedPlanId: string | null;
  selectedScheduleId: string | null;
  selectedRubricItemId: string | null;
}

/**
 * Loading State
 * Deskripsi: State untuk indikator proses asinkron (loading spinner).
 * Lifecycle: Hidup selama proses fetch/save berlangsung.
 * Owner: Application/UI Layer
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset menjadi false saat proses selesai (sukses/gagal).
 */
export interface LoadingState {
  isFetchingPlans: boolean;
  isFetchingSchedules: boolean;
  isSavingObservation: boolean;
  isExportingReport: boolean;
}

/**
 * Error State
 * Deskripsi: Menyimpan pesan error jika terjadi kegagalan operasi.
 * Lifecycle: Dibuat saat ada exception/error, hancur saat di-dismiss oleh user.
 * Owner: Application/UI Layer
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset (null) sebelum memulai operasi asinkron yang baru.
 */
export interface ErrorState {
  globalError: string | null;
  syncError: string | null;
  validationErrors: Record<string, string>; // misal: { "scores": "Skor belum lengkap" }
}

/**
 * Draft State
 * Deskripsi: Menyimpan data form yang belum disubmit (seperti draf observasi).
 * Lifecycle: Dibuat saat user mulai mengetik/mengubah form.
 * Owner: Form/UI Layer
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset setelah data sukses disubmit atau dibatalkan.
 */
export interface DraftState {
  observationDraft: Partial<Observation> | null;
  planDraft: Partial<SupervisionPlan> | null;
  instrumentDraft: Partial<import('../types/SupervisionTypes').SupervisionInstrument> | null;
}

/**
 * Attachment State
 * Deskripsi: Mengelola status unggahan file (progress, antrean).
 * Lifecycle: Selama proses upload berlangsung.
 * Owner: Application Layer
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset ketika upload berhasil dan evidence telah dikaitkan.
 */
export interface AttachmentState {
  uploadQueue: Array<{ fileId: string; progress: number; status: 'pending' | 'uploading' | 'done' | 'error' }>;
}

/**
 * Monitoring State
 * Deskripsi: State untuk mengontrol tampilan monitoring RTL (misalnya filter status RTL).
 * Lifecycle: Selama user berada di halaman Monitoring RTL.
 * Owner: UI Layer
 * Mutable/Immutable: Mutable.
 * Reset Rule: Direset ke filter default ("Semua") saat keluar halaman.
 */
export interface MonitoringState {
  filterStatus: 'ALL' | 'COMPLETED' | 'IN_PROGRESS';
  searchQuery: string;
}

// ============================================================================
// 3. DERIVED STATE (Computed State)
// State yang dikalkulasi dari Persistent State.
// ============================================================================

/**
 * Derived State
 * Deskripsi: Hasil komputasi dari state lain. Tidak disimpan.
 * Lifecycle: Dikalkulasi ulang (re-computed) setiap kali state sumbernya berubah.
 * Owner: Application Layer (Selectors)
 * Mutable/Immutable: Immutable.
 * Reset Rule: Akan secara otomatis kosong jika state sumbernya kosong.
 */
export interface DerivedSupervisionState {
  /**
   * Persentase ketercapaian penyelesaian supervisi pada suatu Plan aktif
   */
  readonly completionPercentage: number;
  
  /**
   * Status agregat apakah sekolah sudah layak untuk merekomendasikan RKT
   */
  readonly isReadyForRecommendation: boolean;

  /**
   * Jadwal yang akan datang dalam minggu ini
   */
  readonly upcomingSchedules: readonly SupervisionSchedule[];
}

// ============================================================================
// 4. ROOT STATE
// Gabungan dari seluruh state di atas.
// ============================================================================

/**
 * Root State
 * Deskripsi: Pohon state utama untuk Modul Supervisi Akademik.
 * Lifecycle: Terikat dengan siklus hidup aplikasi (App Session).
 * Owner: State Manager (Redux/Zustand/Context nantinya)
 * Mutable/Immutable: Tergantung slice (Persistent umumnya immutable, Transient mutable).
 * Reset Rule: Saat user logout atau berganti organisasi.
 */
export interface SupervisionRootState {
  // Persistent
  plans: PlanState;
  schedules: ScheduleState;
  observations: ObservationState;
  recommendations: RecommendationState;

  // Transient
  selection: SelectionState;
  loading: LoadingState;
  error: ErrorState;
  draft: DraftState;
  attachments: AttachmentState;
  monitoring: MonitoringState;

  // Catatan: Derived state biasanya tidak disimpan di dalam Root State 
  // secara eksplisit karena dihitung secara on-the-fly, namun bisa 
  // disimulasikan sebagai bagian dari Root State jika dibutuhkan.
}
