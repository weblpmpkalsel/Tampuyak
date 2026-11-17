# BLUEPRINT BUSINESS FLOW: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Status Dokumen:** FINAL (Safe Mode / Business Flow Design)
**Klasifikasi:** ENTERPRISE BUSINESS FLOW

Dokumen ini memetakan perjalanan pengguna (User Journey), proses bisnis, alur kerja (Workflow), dan siklus dokumen untuk Modul Supervisi Akademik dari sudut pandang **Kepala Sekolah** dan pemangku kepentingan manajerial.

---

## 1. USER JOURNEY (Perjalanan Pengguna Utama)

Berikut adalah skenario end-to-end bagaimana seorang Kepala Sekolah melakukan manajemen supervisi akademik di TAMPUYAK OS dalam satu semester:

1. **Akses Modul:** Kepala Sekolah login → Masuk ke Menu `Dasbor Utama` → Memilih menu `Mutu Pendidikan` → Memilih `Supervisi Akademik`.
2. **Perencanaan & Sinkronisasi:** Sistem menampilkan data otomatis dari *Profil Sekolah* (Daftar Guru) dan *Kalender Pendidikan*. Kepala Sekolah meninjau *Rapor Pendidikan* dan *RKT* (Read-Only) untuk menentukan area prioritas supervisi semester ini.
3. **Penyusunan Program & Jadwal:** Kepala Sekolah membuat "Program Supervisi Semester", menetapkan Asesor (Kepala Sekolah sendiri atau Guru Senior yang ditunjuk), dan menyusun *Jadwal Supervisi* untuk setiap guru.
4. **Pelaksanaan Pra-Observasi:** Sesuai jadwal, Asesor dan Guru melakukan pertemuan awal. Asesor mengisi instrumen Pra-Observasi (telaah RPP/Modul Ajar).
5. **Pelaksanaan Observasi:** Asesor masuk ke kelas (atau memantau secara daring) dan mengisi instrumen Observasi pelaksanaan pembelajaran di sistem.
6. **Pasca-Observasi & Coaching:** Asesor dan Guru berdiskusi. Asesor mencatat hasil refleksi guru dan memberikan *Coaching* di dalam *Coaching Journal*.
7. **Penyusunan RTL:** Berdasarkan hasil observasi, Kepala Sekolah menyusun Rencana Tindak Lanjut (RTL) untuk guru tersebut (misal: penugasan pelatihan, pendampingan teman sejawat).
8. **Monitoring & Laporan:** Di akhir semester, Kepala Sekolah mencetak *Laporan Supervisi Akademik Terpadu* yang memuat grafik nilai, daftar RTL, dan rekomendasi strategis.

---

## 2. BUSINESS PROCESS (Proses Bisnis Makro)

Proses bisnis terbagi menjadi 3 fase utama yang berjalan secara berurutan:

*   **Fase 1: Persiapan (Preparation)**
    *   Menarik data Guru, Kalender, dan target RKT (Read-Only).
    *   Membentuk Tim Supervisor / Asesor.
    *   Merilis Jadwal Resmi (SK Kepala Sekolah terkait Supervisi).
*   **Fase 2: Pelaksanaan (Execution)**
    *   Menjalankan siklus spesifik per guru (Pra-Observasi → Observasi → Pasca-Observasi).
    *   Pengisian instrumen berbasis rubrik secara real-time / offline draft.
*   **Fase 3: Tindak Lanjut (Follow-Up)**
    *   Merekap seluruh hasil observasi.
    *   Menyusun RTL individu dan klasikal.
    *   Menghasilkan rekomendasi untuk perencanaan RKT tahun berikutnya.

---

## 3. WORKFLOW STATUS (Siklus Status Supervisi)

Setiap sesi supervisi untuk satu guru memiliki *State Machine* (Status) yang ketat dan tidak boleh bertabrakan:

1. **`Draft`** : Jadwal dan nama asesor sedang disusun, belum dipublikasikan ke guru.
2. **`Direncanakan`** : Program telah disahkan (SK diterbitkan), namun jadwal pelaksanaan masih jauh.
3. **`Dijadwalkan`** : H-7 pelaksanaan. Guru sudah mendapat notifikasi untuk menyiapkan dokumen Pra-Observasi.
4. **`Pra Observasi`** : Sedang/Telah dilakukan telaah dokumen perencanaan pembelajaran (RPP/Modul Ajar).
5. **`Observasi`** : Sedang/Telah dilakukan pemantauan di dalam kelas. Instrumen inti diisi.
6. **`Pasca Observasi`** : Menunggu atau sedang dilakukan sesi refleksi dan pengisian catatan *coaching*.
7. **`Menunggu RTL`** : Seluruh instrumen selesai, menunggu Kepala Sekolah menetapkan Tindak Lanjut.
8. **`Selesai`** : Dokumen supervisi untuk guru bersangkutan ditutup, PDF ditandatangani dan diarsipkan.

---

## 4. ACTOR MATRIX (Matriks Hak Akses Pengguna)

| Peran (Role) | Hak Akses & Tanggung Jawab di Modul Supervisi |
| :--- | :--- |
| **Kepala Sekolah** | **Full Access.** Membuat Program, Menunjuk Asesor, Mengisi Instrumen, Memberi Coaching, Menetapkan RTL, dan Mencetak Laporan Akhir. |
| **Pengawas (Supervisor)** | **View & Evaluate.** Memantau seluruh pelaksanaan supervisi, memberi catatan pembinaan kepada Kepala Sekolah (jika ada fitur validasi eksternal). |
| **Asesor / Guru Senior**| **Assigned Execution.** Hanya dapat melihat dan mengisi instrumen Supervisi untuk guru yang *ditugaskan kepadanya* oleh Kepala Sekolah. |
| **Guru (Auditee)** | **Read-Only / Acknowledge.** Melihat jadwal supervisi dirinya, melihat hasil observasi, mengisi lembar *self-reflection*, dan menyetujui (Tanda Tangan) hasil akhir. |
| **Operator Sekolah** | **Administrative.** Membantu mencetak format kosong (PDF), mengatur data master (jika ada ketidaksesuaian nama guru dari profil), namun **TIDAK** bisa menilai instrumen. |

---

## 5. DASHBOARD CONCEPT (Dasbor Eksekutif Kepala Sekolah)

Saat Kepala Sekolah membuka Modul Supervisi, UI akan menampilkan dasbor dengan metrik:

*   **Progress Pelaksanaan:**
    *   Total Guru: [X]
    *   Selesai Supervisi: [Y]
    *   Sedang Berjalan (Pra/Obs/Pasca): [Z]
    *   Belum Disupervisi: [W]
*   **Analisis Kualitas:**
    *   Rata-rata Skor Pedagogik & Profesional Sekolah.
    *   Persentase Guru Kategori "Sangat Baik", "Baik", "Cukup", "Kurang".
*   **Warning / Attention Needed:**
    *   Daftar guru yang *Perlu Coaching Lanjutan*.
    *   Daftar guru yang *Perlu Supervisi Ulang*.
*   **Grafik Tren & Keselarasan:**
    *   Grafik perbandingan capaian Supervisi Semester 1 vs Semester 2.
    *   Label teks: *"Fokus Supervisi tahun ini selaras dengan target RKT Program Peningkatan SDM."*

---

## 6. DOCUMENT LIFECYCLE (Siklus Dokumen Fisik/Digital)

Sistem akan memanfaatkan `DocumentExportEngine` untuk menghasilkan dokumen berstandar formal yang siap cetak:

1. **SK & Program Supervisi Akademik** (Awal Semester)
2. **Jadwal Pelaksanaan Supervisi** (Awal Semester)
3. **Instrumen Telaah Administrasi Pembelajaran / Pra-Observasi** (Per Guru)
4. **Instrumen Observasi Pembelajaran** (Per Guru)
5. **Lembar Catatan Pasca-Observasi & Coaching Journal** (Per Guru)
6. **Daftar Hadir & Berita Acara Supervisi** (Opsional/Administratif)
7. **Matriks Rencana Tindak Lanjut (RTL)** (Per Guru / Kolektif)
8. **Laporan Pelaksanaan Supervisi Akademik** (Laporan Komprehensif Akhir Semester/Tahun)

---

## 7. EVIDENCE FLOW & INTEGRASI READ-ONLY

Bagaimana Supervisi memanfaatkan data TAMPUYAK tanpa melakukan mutasi (Write):

*   **Profil & Guru:** Membaca `OrganizationProfile` untuk mengetahui nama guru, NIP, pangkat/golongan, dan mata pelajaran yang diampu.
*   **Kalender Pendidikan:** Membaca rentang hari efektif, masa ujian, dan hari libur agar jadwal supervisi tidak berbenturan.
*   **KSP (Kurikulum):** Membaca bab Pengorganisasian Pembelajaran untuk memastikan instrumen sejalan dengan paradigma kurikulum sekolah (misal: pembelajaran berdiferensiasi).
*   **Rapor Pendidikan:** Membaca skor "Kualitas Pembelajaran" (misal: indikator D.1) sebagai dasar argumen mengapa fokus supervisi diarahkan pada metode tertentu.
*   **RKT:** Membaca program kerja sekolah tahun ini. Jika di RKT ada "Pelatihan Manajemen Kelas", maka supervisi akan fokus menilai efektivitas manajemen kelas.

---

## 8. RECOMMENDATION FLOW (Pemisahan Perencanaan & Pengawasan)

Penting untuk menjaga integritas *Planning Engine*. Proses pemberian umpan balik dilakukan secara **manual-disetujui** (tidak otomatis).

1. **Evaluasi Modul:** Supervisi selesai. Sistem mengagregasi bahwa 40% guru lemah di "Pemanfaatan Media IT".
2. **Rekomendasi (Sistem):** Modul Supervisi memunculkan notifikasi/teks rekomendasi: *"Disarankan untuk memasukkan program In-House Training (IHT) Pemanfaatan Media IT pada penyusunan RKT berikutnya."*
3. **Tinjauan Kepala Sekolah:** Kepala Sekolah membaca rekomendasi ini di akhir laporan supervisi.
4. **Tindakan (Manual Action):** Saat tahun ajaran berganti dan Kepala Sekolah membuka Modul RKT, rekomendasi ini tampil sebagai **"Insight/Suggestion"**. Kepala Sekolah harus mengklik secara sadar untuk memasukkannya ke dalam *Draft* RKT.
5. **Konklusi:** Tidak pernah ada mutasi otomatis (insert/update) ke basis data RKT/RKJM tanpa intervensi dan persetujuan (approval) eksplisit dari manusia.

---

## 9. FUTURE EXPANSION (Pengembangan Masa Depan)

Blueprint ini dirancang untuk mudah diperluas pada fase berikutnya:
*   **Supervisi Sebaya (Peer Supervision):** Memberikan akses bagi sesama guru (dalam satu rumpun MGMP sekolah) untuk saling melakukan observasi silang.
*   **Analisis AI (Generative Coaching):** Memanfaatkan LLM untuk membaca teks *Coaching Journal* dan memberikan usulan referensi materi pelatihan yang spesifik dari PMM (Platform Merdeka Mengajar).
*   **Supervisi Manajerial:** Ekspansi dari ranah akademik (Guru) ke ranah manajerial (Tenaga Kependidikan/Tata Usaha, Perpustakaan, Laboratorium).
