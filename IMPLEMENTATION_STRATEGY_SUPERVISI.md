# IMPLEMENTATION STRATEGY: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Status Dokumen:** FINAL (Safe Mode / Incremental Delivery)
**Klasifikasi:** IMPLEMENTATION STRATEGY

Dokumen ini merinci peta jalan (*roadmap*) implementasi Modul Supervisi Akademik. Strategi yang digunakan adalah **Incremental Delivery** (pengiriman bertahap) dengan prinsip *Fail-Safe*. Setiap fase dirancang agar dapat diimplementasikan secara independen, aman, dan dapat di-*rollback* (dikembalikan) tanpa mengganggu fungsi modul inti (KSP, RKJM, RKT, RKAS) dari TAMPUYAK OS.

---

## DEPENDENCY MAP (Peta Ketergantungan Fase)

Implementasi harus berjalan berurutan pada fase awal, namun dapat diparalelkan pada fase akhir.

```text
[PHASE 1: Foundation]
         │
         ▼
[PHASE 2: Program Supervisi]
         │
         ▼
[PHASE 3: Jadwal & Penugasan]
         │
         ├──► [PHASE 4: Pra Observasi] ──► [PHASE 5: Observasi] ──► [PHASE 6: Pasca Obs] ──► [PHASE 7: RTL]
         │
         ├──► [PHASE 8: Dashboard] (Paralel)
         │
         └──► [PHASE 9: Document Export] (Paralel)
                                                                                                    │
                                                                                                    ▼
                                                                                         [PHASE 10: Integration]
```

---

## TAHAPAN IMPLEMENTASI (PHASE)

### PHASE 1: FOUNDATION (Kerangka Dasar & Tipe Data)
*   **Tujuan:** Membangun fondasi arsitektur, *types*, dan *React Context* yang terisolasi.
*   **Komponen Baru:** `SupervisionContext`, `SupervisionTypes.ts`, `SupervisionEngine.ts` (stub).
*   **Komponen Reuse:** `EventBus`.
*   **Data Digunakan:** None.
*   **Data Dibuat:** Definisi *Interface* dan *State Management* lokal (kosong).
*   **Kompleksitas:** Low.
*   **Risiko:** Konflik penamaan variabel global (Low).
*   **Cara Rollback:** Hapus direktori `/src/supervision` dan hapus impor *Context*. Modul lama tidak terpengaruh.
*   **Testing:** *Unit test* inisialisasi context.
*   **Definition of Done:** `SupervisionContext` berjalan di memori tanpa *error* konsol.
*   **Checkpoint:** **S5.1 LOCK**

### PHASE 2: PROGRAM SUPERVISI
*   **Tujuan:** Membuat antarmuka dan logika untuk inisialisasi Program Supervisi semester.
*   **Komponen Baru:** `ProgramSupervisiView`, `SupervisionStorageAdapter` (Firebase).
*   **Komponen Reuse:** `EnterpriseWorkspaceShell`, `SchoolProfileService`, `AcademicCalendarService`.
*   **Data Digunakan:** Identitas Sekolah, Kalender (Read-Only).
*   **Data Dibuat:** Koleksi `academic_supervisions` di Firestore.
*   **Kompleksitas:** Medium.
*   **Risiko:** Modifikasi tidak disengaja pada *CalendarService* (Medium).
*   **Cara Rollback:** Hapus komponen `ProgramSupervisiView`. Hapus akses ke *Firestore collection* baru.
*   **Testing:** Tes pembuatan dokumen program di Firestore.
*   **Definition of Done:** Kepala Sekolah dapat membuat draf program dengan judul dan periode waktu.
*   **Checkpoint:** **S5.2 LOCK**

### PHASE 3: JADWAL & PENUGASAN (Scheduling)
*   **Tujuan:** Menugaskan Asesor dan mendaftar guru yang akan disupervisi.
*   **Komponen Baru:** `JadwalSupervisiForm`, `AsesorSelector`.
*   **Komponen Reuse:** Data Master Pegawai/Guru, `RoleGuard`.
*   **Data Digunakan:** Daftar Guru dari `OrganizationProfile` (Read-Only).
*   **Data Dibuat:** Sub-koleksi `supervision_schedules` (Berisi: ID Guru, ID Asesor, Tanggal).
*   **Kompleksitas:** High.
*   **Risiko:** *Deep copy* gagal, mutasi nama guru (High).
*   **Cara Rollback:** Matikan fitur *routing* ke halaman jadwal. Modul RKT/Organisasi aman.
*   **Testing:** *Assign* guru ke asesor, validasi *RoleGuard* (hanya KS yang bisa *assign*).
*   **Definition of Done:** Tabel jadwal terisi dengan relasi Asesor dan Guru.
*   **Checkpoint:** **S5.3 LOCK**

### PHASE 4: PRA OBSERVASI
*   **Tujuan:** Memfasilitasi telaah RPP/Modul Ajar sebelum observasi kelas.
*   **Komponen Baru:** `InstrumenPraObservasi`, `UploadModulAjar`.
*   **Komponen Reuse:** *Button, Input, Form Engine*.
*   **Data Digunakan:** Data Jadwal (Read-Only).
*   **Data Dibuat:** Dokumen `pra_observation_results`.
*   **Kompleksitas:** Medium.
*   **Risiko:** Kebocoran akses antar guru (Medium).
*   **Cara Rollback:** Sembunyikan *tab* Pra-Observasi.
*   **Testing:** Guru mengunggah draf, Asesor memberi ceklis kelengkapan.
*   **Definition of Done:** Status berubah dari `Dijadwalkan` menjadi `Pra Observasi` selesai.
*   **Checkpoint:** **S5.4 LOCK**

### PHASE 5: OBSERVASI (Pelaksanaan Utama)
*   **Tujuan:** Pengisian rubrik observasi kelas oleh Asesor secara *real-time*.
*   **Komponen Baru:** `InstrumenObservasiKelas`, `SupervisionScoringEngine`.
*   **Komponen Reuse:** *Table Layouts, Alert/Toast Notifications*.
*   **Data Digunakan:** Konteks KSP/RKT (Referensi/Target).
*   **Data Dibuat:** Skor observasi, catatan deskriptif temuan.
*   **Kompleksitas:** High.
*   **Risiko:** Kompleksitas kalkulasi *scoring* membebani *browser* (Medium).
*   **Cara Rollback:** Hapus *render logic* observasi.
*   **Testing:** Validasi form kosong, kalkulasi skor total (Sangat Baik / Baik / Cukup).
*   **Definition of Done:** Asesor dapat men-*submit* hasil observasi dan status berubah.
*   **Checkpoint:** **S5.5 LOCK**

### PHASE 6: PASCA OBSERVASI & COACHING
*   **Tujuan:** Pencatatan refleksi dan umpan balik (Coaching).
*   **Komponen Baru:** `CoachingJournalView`, `ReflectionForm`.
*   **Komponen Reuse:** *Textarea, Modal Dialog*.
*   **Data Digunakan:** Hasil Observasi Fase 5 (Read-Only).
*   **Data Dibuat:** Kesepakatan pasca-observasi, tanda tangan digital (opsional/persetujuan).
*   **Kompleksitas:** Low.
*   **Risiko:** Tidak ada.
*   **Cara Rollback:** Hapus UI Pasca-Observasi.
*   **Testing:** Pengisian jurnal oleh asesor, konfirmasi (Acknowledge) oleh guru.
*   **Definition of Done:** Tersimpan dokumen *Coaching* per guru.
*   **Checkpoint:** **S5.6 LOCK**

### PHASE 7: RENCANA TINDAK LANJUT (RTL)
*   **Tujuan:** Merumuskan langkah perbaikan spesifik berdasarkan hasil observasi.
*   **Komponen Baru:** `RTLForm`, `RecommendationGenerator`.
*   **Komponen Reuse:** Tidak ada (logika baru murni).
*   **Data Digunakan:** Keseluruhan skor dan *Coaching Journal*.
*   **Data Dibuat:** Dokumen `follow_up_plans`. Rekomendasi (Draft).
*   **Kompleksitas:** Medium.
*   **Risiko:** Injeksi tidak sengaja ke Planning Engine/RKT (Critical).
*   **Cara Rollback:** Blokir *export* rekomendasi. Jangan hubungkan ke RKT.
*   **Testing:** Pastikan rekomendasi **TIDAK** menulis ke koleksi RKT di *database*.
*   **Definition of Done:** Kepala Sekolah dapat merilis RTL, Siklus Supervisi untuk guru tersebut berstatus `Selesai`.
*   **Checkpoint:** **S5.7 LOCK**

### PHASE 8: DASHBOARD (Analitik Eksekutif)
*   **Tujuan:** Menampilkan agregat dan statistik pelaksanaan supervisi.
*   **Komponen Baru:** `SupervisionDashboard`, Grafik pencapaian.
*   **Komponen Reuse:** `DashboardViewBuilder`, *Card Components*.
*   **Data Digunakan:** Rekap status dan skor seluruh guru (Read-Only).
*   **Data Dibuat:** None (Hanya agregasi tampilan).
*   **Kompleksitas:** Medium.
*   **Risiko:** Kueri lambat yang membekukan UI utama (High).
*   **Cara Rollback:** Matikan *route* `/dashboard/supervisi`.
*   **Testing:** Uji beban (load testing) rendering grafik dengan data 100 guru.
*   **Definition of Done:** Dasbor menampilkan metrik jumlah yang sudah/belum disupervisi dan rata-rata skor.
*   **Checkpoint:** **S5.8 LOCK**

### PHASE 9: DOCUMENT EXPORT (Cetak Laporan)
*   **Tujuan:** Menghasilkan laporan berformat resmi (PDF) untuk diarsipkan.
*   **Komponen Baru:** `LaporanSupervisiPrintLayout`.
*   **Komponen Reuse:** `DocumentExportEngine`, `CanonicalRenderer`.
*   **Data Digunakan:** Keseluruhan agregat data supervisi satu semester.
*   **Data Dibuat:** Dokumen PDF.
*   **Kompleksitas:** High.
*   **Risiko:** *CSS conflicts* yang merusak tata letak cetak dokumen RKT/KSP (Critical).
*   **Cara Rollback:** Hapus *CSS scoping* dan *Template Builder* supervisi. 
*   **Testing:** Cetak PDF di browser berbeda, pastikan *page break* rapi dan modul lama mencetak normal.
*   **Definition of Done:** Kepala Sekolah bisa mengunduh Laporan Semester Supervisi dalam format PDF siap cetak.
*   **Checkpoint:** **S5.9 LOCK**

### PHASE 10: INTEGRATION (Penyatuan ke TAMPUYAK OS)
*   **Tujuan:** Mengaktifkan *entry point* (Menu Navigasi) agar modul dapat diakses oleh *end-user*.
*   **Komponen Baru:** *Router links, Sidebar Navigation entry*.
*   **Komponen Reuse:** `WorkspaceToolbar`, *App Routes*.
*   **Data Digunakan:** Hak akses pengguna.
*   **Data Dibuat:** Akses URL terbuka.
*   **Kompleksitas:** Low.
*   **Risiko:** *Uncaught exception* me- *crash*-kan seluruh aplikasi (Medium).
*   **Cara Rollback:** Hapus satu baris kode penambahan menu di `Sidebar` dan bungkus *Route* dalam *Feature Flag* (dinonaktifkan).
*   **Testing:** Uji navigasi bolak-balik antara KSP -> RKJM -> Supervisi.
*   **Definition of Done:** Menu "Supervisi Akademik" muncul dan berfungsi secara *seamless* bersama modul lain.
*   **Checkpoint:** **S5.10 FINAL LOCK**

---

## RISK MATRIX & MITIGASI

| Risiko (*Risk*) | Keparahan (*Severity*) | Fase Terkait | Strategi Mitigasi (*Mitigation*) |
| :--- | :---: | :--- | :--- |
| **Mutasi Data Referensi (Guru/RKT)** | **CRITICAL** | Fase 2, 3, 4 | Wajib menggunakan `structuredClone()` saat mengambil referensi dari `OrganizationProfile` atau `PlanningContext`. Gunakan *TypeScript `Readonly`*. |
| **Konflik CSS Print Engine** | **CRITICAL** | Fase 9 | Bungkus seluruh cetakan Laporan Supervisi di dalam div dengan id spesifik (contoh: `#supervisi-print-root`). Jangan gunakan kelas CSS global yang bisa bentrok. |
| ***Browser Crash* (Kueri Berat)** | **HIGH** | Fase 8 | Implementasi agregasi asinkron (menggunakan *loading states* atau *skeleton UI*). Jangan melakukan kalkulasi grafik pada saat *render* awal. |
| **Bocor Akses (Guru isi instrumen Asesor)**| **HIGH** | Fase 5 | Berlakukan `RoleGuard` tingkat komponen (bukan hanya tingkat halaman) pada komponen *Scoring Rubric*. |
| **Error Rendering *Sidecar*** | **MEDIUM** | Fase 10 | Bungkus seluruh rute Supervisi Akademik dengan `<ErrorBoundary>` independen, agar kegagalan UI supervisi tidak menyebabkan *blank screen* pada TAMPUYAK OS. |

---

## KESIMPULAN

**IMPLEMENTASI SIAP DIEKSEKUSI.** 
Pendekatan 10 fase ini sangat konklusif dan terisolasi. Jika pada Fase 5 terjadi *bug* kritis, fitur tersebut cukup disembunyikan (*hidden*) via Fase 10, tanpa perlu me-*revert* komit pada berkas KSP/RKAS/RKJM. Legacy TAMPUYAK OS sepenuhnya dilindungi dari anomali pengembangan fitur baru ini.
