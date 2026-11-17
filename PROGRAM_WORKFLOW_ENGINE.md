# PROGRAM WORKFLOW ENGINE

**Fase:** S7.4 (Program Configuration - Workflow Review)
**Tanggal Review:** 26 Juli 2026

Berikut adalah definisi Workflow Engine untuk Program Supervisi Akademik. Desain ini memastikan *state machine* berjalan secara linier, menjaga integritas data (tidak ada status yang terlampaui), dan memastikan transisi mengikuti *Business Flow* yang sesuai dengan prinsip Supervisi Akademik.

---

### 1. DRAFT
Status awal saat Program Supervisi baru dibuat.
*   **Allowed Action:** Mengedit detail program (Tahun Ajaran, Semester, Deskripsi), Menambah/menghapus Guru Sasaran (*Teacher Assignment*), dan Memilih Template Instrumen.
*   **Forbidden Action:** Penjadwalan (*Scheduling*), Pelaksanaan Supervisi, Pembuatan RTL, dan Export Laporan.
*   **Transition:** Ke **READY_FOR_SCHEDULING** (Aktif ketika Kepala Sekolah menekan tombol "Selesaikan Konfigurasi" yang memicu *Instrument Snapshot*).
*   **Rollback:** Tidak ada (Ini adalah *initial state*).

### 2. READY_FOR_SCHEDULING
Program telah dikonfigurasi dan memiliki *Snapshot* instrumen yang terkunci.
*   **Allowed Action:** Menetapkan Asesor dan waktu (*Date/Time*) supervisi untuk masing-masing guru, serta menambah Guru Sasaran baru (tanpa menghapus yang sudah ada).
*   **Forbidden Action:** Mengubah/mengganti *Instrument Snapshot*, mengubah Tahun Ajaran/Semester, dan memulai tahap Observasi.
*   **Transition:** Ke **SCHEDULED** (Aktif ketika jadwal/Asesor telah ditetapkan dan dikonfirmasi).
*   **Rollback:** Ke **DRAFT** (Akan menghapus *Instrument Snapshot* dan membatalkan status kesiapan, hanya bisa dilakukan jika belum ada jadwal yang dibuat).

### 3. SCHEDULED
Jadwal supervisi telah ditetapkan.
*   **Allowed Action:** Meninjau jadwal, melakukan *Reschedule* (mengubah tanggal/waktu sebelum hari-H), dan memulai Pra-Observasi.
*   **Forbidden Action:** Mengubah Instrumen, menghapus Guru dari program, dan melompati langsung ke tahap Observasi.
*   **Transition:** Ke **PRE_OBSERVATION** (Aktif ketika Asesor menekan tombol "Mulai Pra-Observasi").
*   **Rollback:** Ke **READY_FOR_SCHEDULING** (Jika jadwal dibatalkan atau dihapus).

### 4. PRE_OBSERVATION
Tahap wawancara awal dan telaah administrasi (RPP/Modul Ajar).
*   **Allowed Action:** Mengisi catatan Pra-Observasi, mereview kelengkapan perangkat ajar, dan menyimpan draf catatan.
*   **Forbidden Action:** Mengubah jadwal secara sepihak (harus melalui rollback), dan mengisi rubrik penilaian kelas.
*   **Transition:** Ke **OBSERVATION** (Aktif ketika catatan Pra-Observasi di-submit/diselesaikan secara final).
*   **Rollback:** Ke **SCHEDULED** (Jika Pra-Observasi dibatalkan/di-reset).

### 5. OBSERVATION
Tahap inti yaitu observasi langsung di dalam kelas.
*   **Allowed Action:** Memberikan skor pada Rubrik/Indikator (dari *Instrument Snapshot*), mencatat temuan kelas, dan menyimpan draf penilaian.
*   **Forbidden Action:** Mengubah catatan Pra-Observasi (karena sudah final), dan memberikan rekomendasi/RTL.
*   **Transition:** Ke **POST_OBSERVATION** (Aktif ketika seluruh indikator rubrik telah dinilai dan di-submit).
*   **Rollback:** Ke **PRE_OBSERVATION** (Memerlukan otorisasi khusus jika data observasi ingin di-reset).

### 6. POST_OBSERVATION
Tahap wawancara pasca-observasi dan *coaching*.
*   **Allowed Action:** Mengisi catatan *coaching*, umpan balik (feedback) dari guru, refleksi, dan mendiskusikan hasil skor.
*   **Forbidden Action:** Mengubah skor observasi yang sudah dikunci.
*   **Transition:** Ke **RTL** (Aktif ketika sesi *coaching* selesai dan disepakati).
*   **Rollback:** Ke **OBSERVATION** (Memerlukan otorisasi khusus untuk membuka kembali penilaian).

### 7. RTL (Rencana Tindak Lanjut)
Tahap perumusan langkah perbaikan ke depan.
*   **Allowed Action:** Menambahkan *Action Plan* (Rencana Aksi), menentukan prioritas rekomendasi, dan menetapkan tenggat waktu (*deadline*) perbaikan.
*   **Forbidden Action:** Mengubah catatan *coaching* atau skor observasi.
*   **Transition:** Ke **MONITORING** (Aktif ketika dokumen RTL disetujui dan ditandatangani secara digital oleh Asesor dan Guru).
*   **Rollback:** Ke **POST_OBSERVATION**.

### 8. MONITORING
Tahap pelaksanaan dan pemantauan perbaikan oleh Guru.
*   **Allowed Action:** Guru mengunggah bukti (*evidence*) perbaikan, Asesor memverifikasi progres perbaikan (*update progress*).
*   **Forbidden Action:** Mengubah rumusan RTL yang sudah disepakati.
*   **Transition:** Ke **CLOSED** (Aktif ketika seluruh *Action Plan* pada RTL telah diverifikasi dan dinyatakan selesai).
*   **Rollback:** Ke **RTL** (Hanya jika terjadi kesalahan fatal dalam perumusan awal).

### 9. CLOSED
Program Supervisi untuk guru tersebut (atau secara agregat untuk seluruh sekolah) telah selesai secara komprehensif.
*   **Allowed Action:** Melihat riwayat (*View Only*), mengunduh laporan PDF/Excel, dan mencetak dokumen final.
*   **Forbidden Action:** Segala bentuk perubahan data (*Immutable State*).
*   **Transition:** Tidak ada (Ini adalah *Terminal State*).
*   **Rollback:** Tidak ada (Data telah diarsipkan/dikunci secara permanen).

---

## KESIMPULAN

*Workflow Engine* telah dirancang dengan prinsip **Strict State Machine**. Tidak ada status yang dapat dilompati (*No Jump Bypassing*). Seluruh alur transisi dan *rollback* secara ketat mengikuti prosedur operasional standar (SOP) Supervisi Akademik di sekolah.

**READY FOR IMPLEMENTATION**
