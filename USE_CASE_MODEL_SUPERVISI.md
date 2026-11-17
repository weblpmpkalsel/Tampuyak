# USE CASE MODEL: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.3 Use Case Model
**Status:** FINAL (Safe Mode)

Dokumen ini mendefinisikan seluruh kemampuan (Capabilities) Modul Supervisi Akademik menggunakan pendekatan Use Case Driven Design. Pendekatan ini berfokus pada kebutuhan pengguna tanpa mencampuradukkan detail teknis implementasi (seperti database atau API).

---

## 1. IDENTIFIKASI AKTOR

1. **Kepala Sekolah (KS)**
   Pemimpin satuan pendidikan yang memiliki wewenang penuh dalam merencanakan, melaksanakan, dan mengevaluasi program supervisi. (Dapat juga bertindak sebagai Asesor).
2. **Guru**
   Pendidik yang menjadi subjek (Auditee) dalam pelaksanaan supervisi akademik.
3. **Pengawas Sekolah**
   Pihak eksternal (Dinas Pendidikan) yang melakukan validasi atau pemantauan terhadap pelaksanaan program supervisi di sekolah.
4. **Operator Sekolah**
   Tenaga kependidikan yang bertugas membantu administrasi penjadwalan dan percetakan dokumen (namun tidak berhak menilai).

---

## 2. DAFTAR USE CASE PER AKTOR

### Kepala Sekolah (Sebagai Manajer & Asesor)
*   Create Supervision Plan (Membuat Program Supervisi)
*   Assign Supervisor (Menunjuk Asesor/Supervisor)
*   Schedule Supervision (Mengatur Jadwal Supervisi Guru)
*   Evaluate Pre-Observation (Menilai Kelengkapan Administrasi/Pra-Observasi)
*   Conduct Observation (Melaksanakan Observasi Kelas)
*   Conduct Coaching Session (Melaksanakan Coaching Pasca-Observasi)
*   Create Follow-Up Plan (Membuat RTL)
*   Generate Recommendation (Menghasilkan Rekomendasi RKT)
*   Print Supervision Report (Mencetak Laporan)

### Guru
*   Upload Teaching Module (Mengunggah RPP/Modul Ajar)
*   Submit Reflection (Mengisi Jurnal Refleksi Pasca-Observasi)
*   Acknowledge Coaching (Menyetujui Catatan Coaching)
*   View Action Plan (Melihat Rekomendasi/RTL Diri Sendiri)

### Operator Sekolah
*   Manage Schedule Draft (Mengatur Draf Jadwal)
*   Export Aggregate Data (Mengunduh Rekapitulasi Pelaksanaan)

### Pengawas Sekolah
*   View Supervision Dashboard (Melihat Dasbor Capaian Sekolah)
*   Validate School Recommendation (Mengevaluasi Rekomendasi Mutu Sekolah)

---

## 3. SPESIFIKASI USE CASE (DETAIL)

### UC01: Create Supervision Plan
*   **Nama:** Membuat Program Supervisi Semester
*   **Tujuan:** Menerbitkan program payung supervisi untuk satu semester.
*   **Aktor:** Kepala Sekolah
*   **Precondition:** Data Kalender Akademik dan RKT tersedia.
*   **Trigger:** Kepala Sekolah menekan tombol "Buat Program Baru".
*   **Main Flow:** 
    1. Sistem menampilkan form program.
    2. KS mengisi Judul, Deskripsi, dan memilih referensi Program RKT (jika ada).
    3. Sistem mengambil snapshot Kalender aktif.
    4. KS menyimpan sebagai Draf atau mempublikasikannya.
*   **Alternative Flow:** KS melanjutkan draf yang belum selesai.
*   **Exception:** Kalender Akademik belum diatur di sistem (Gagal membuat program).
*   **Output:** Dokumen `SupervisionPlan` berstatus 'Draft' atau 'Published'.

### UC02: Schedule Supervision
*   **Nama:** Menjadwalkan Supervisi Guru
*   **Tujuan:** Menentukan kapan dan siapa yang akan mengobservasi seorang guru.
*   **Aktor:** Kepala Sekolah (atau dibantu Operator)
*   **Precondition:** `SupervisionPlan` berstatus Published.
*   **Trigger:** Membuka menu Jadwal dan memilih guru.
*   **Main Flow:**
    1. Sistem menampilkan daftar Guru dari Profil Sekolah.
    2. KS memilih Guru dan Asesor.
    3. KS menentukan tanggal/waktu observasi.
    4. Sistem melakukan snapshot pada data Guru.
    5. Jadwal disimpan.
*   **Alternative Flow:** KS menjadwalkan secara masif (bulk).
*   **Exception:** Jadwal berbenturan dengan hari libur nasional di Kalender.
*   **Output:** Entitas `SupervisionSchedule` dengan status 'Dijadwalkan'.

### UC03: Upload Teaching Module
*   **Nama:** Mengunggah Modul Ajar (RPP)
*   **Tujuan:** Mengirimkan bahan ajar untuk dinilai pada fase Pra-Observasi.
*   **Aktor:** Guru
*   **Precondition:** Status jadwal guru bersangkutan adalah 'Dijadwalkan'.
*   **Trigger:** Guru membuka jadwal supervisinya.
*   **Main Flow:**
    1. Guru mengisi tautan Modul Ajar atau mengunggah lampiran.
    2. Guru menambahkan catatan singkat.
    3. Guru men-submit dokumen.
*   **Alternative Flow:** Guru hanya mengisi catatan karena modul ajar fisik diletakkan di meja asesor.
*   **Exception:** Melewati batas waktu (H-1 observasi).
*   **Output:** `PreObservation` ter-update dengan `Evidence`.

### UC04: Conduct Observation
*   **Nama:** Melaksanakan Observasi Kelas
*   **Tujuan:** Mengisi instrumen rubrik penilaian saat guru mengajar.
*   **Aktor:** Kepala Sekolah / Asesor
*   **Precondition:** Status jadwal 'PraObservasi' telah selesai (Approved).
*   **Trigger:** Asesor memulai sesi observasi di sistem.
*   **Main Flow:**
    1. Asesor mengisi detail sesi (nama mapel, jumlah siswa).
    2. Sistem menampilkan Rubrik Penilaian.
    3. Asesor mengisi skor (1-4) pada tiap indikator `RubricItem` dan menulis `ObservationNote`.
    4. Asesor mengakhiri sesi dan menyimpan hasil.
*   **Alternative Flow:** Asesor menyimpan sebagai draf sementara saat berada di kelas.
*   **Exception:** Sesi ditutup mendadak karena kondisi darurat kelas (Status menjadi Dibatalkan/Diulang).
*   **Output:** `Observation` terisi dengan agregasi nilai (Sangat Baik/Baik/Cukup/Kurang).

### UC05: Submit Reflection
*   **Nama:** Mengisi Jurnal Refleksi
*   **Tujuan:** Evaluasi diri guru setelah dinilai.
*   **Aktor:** Guru
*   **Precondition:** Observasi telah selesai.
*   **Trigger:** Guru membuka hasil observasinya.
*   **Main Flow:**
    1. Guru membaca skor dan catatan dari Asesor.
    2. Guru menulis pandangan pribadinya atas pembelajaran tadi.
    3. Guru men-submit jurnal.
*   **Alternative Flow:** -
*   **Exception:** -
*   **Output:** `Reflection` tersimpan.

### UC06: Conduct Coaching Session
*   **Nama:** Melaksanakan Coaching Pasca-Observasi
*   **Tujuan:** Diskusi perbaikan antara asesor dan guru.
*   **Aktor:** Kepala Sekolah / Asesor
*   **Precondition:** Jurnal Refleksi guru telah diisi.
*   **Trigger:** Membuka menu Pasca-Observasi.
*   **Main Flow:**
    1. Asesor membaca Refleksi guru.
    2. Asesor menulis catatan coaching/bimbingan.
    3. Asesor menulis kesepakatan komitmen perbaikan.
    4. Guru (melalui akunnya) menekan tombol "Setuju".
*   **Alternative Flow:** -
*   **Exception:** Guru tidak menyetujui hasil observasi (Dispute).
*   **Output:** `CoachingSession` berstatus 'Agreed'.

### UC07: Create Follow-Up Plan
*   **Nama:** Menyusun Rencana Tindak Lanjut (RTL)
*   **Tujuan:** Menugaskan langkah konkret bagi guru untuk berkembang.
*   **Aktor:** Kepala Sekolah
*   **Precondition:** Coaching Session selesai.
*   **Trigger:** KS membuka menu RTL.
*   **Main Flow:**
    1. Sistem menampilkan rangkuman kelemahan guru dari Observasi.
    2. KS menambahkan `ActionPlan` (misal: "Wajib ikut Diklat Pedagogik").
    3. KS menetapkan target tanggal penyelesaian.
    4. Sistem mengubah status siklus menjadi 'Selesai'.
*   **Alternative Flow:** KS memberikan rekomendasi kolektif untuk beberapa guru sekaligus.
*   **Exception:** -
*   **Output:** Entitas `FollowUp` dan `ActionPlan`.

### UC08: Generate Recommendation
*   **Nama:** Menghasilkan Rekomendasi RKT
*   **Tujuan:** Mengirimkan *insight* level sekolah sebagai pertimbangan RKT tahun depan.
*   **Aktor:** Kepala Sekolah
*   **Precondition:** Seluruh jadwal supervisi dalam satu Plan berstatus 'Selesai'.
*   **Trigger:** KS menutup `SupervisionPlan`.
*   **Main Flow:**
    1. Sistem mengagregasi skor (Misal: Rata-rata guru lemah di Metode Mengajar).
    2. Sistem merumuskan usulan draf Rekomendasi.
    3. KS meninjau, mengubah, dan mempublikasikan Rekomendasi.
*   **Alternative Flow:** -
*   **Exception:** Tidak ada data supervisi yang cukup.
*   **Output:** `Recommendation` yang siap dibaca (Read-Only) oleh perumus RKT kelak.

---

## 4. IDENTIFIKASI PRIORITAS USE CASE

### Mandatory Use Case (Kritis - Wajib Ada)
*   Create Supervision Plan
*   Schedule Supervision
*   Conduct Observation
*   Create Follow-Up Plan (RTL)
*   Print Supervision Report

### Optional Use Case (Nilai Tambah - Penting)
*   Upload Teaching Module (Guru)
*   Submit Reflection (Guru)
*   Conduct Coaching Session

### Future Use Case (Fase Pengembangan Lanjut)
*   Peer Supervision (Supervisi Teman Sejawat antar Guru)
*   AI Coaching Assistant (Rekomendasi tindakan dari LLM berdasarkan skor guru)
*   Pengawas Dashboard (Validasi eksternal tingkat Kabupaten/Kota)

---
*Dokumen Use Case Model ini mendefinisikan batas lingkup fungsional dari Modul Supervisi Akademik dan menjadi rujukan utama sebelum proses perancangan User Interface (UI).*
