# DESIGN REVIEW: PROGRAM CONFIGURATION

**Fase:** S7.4 (Program Configuration - Pre-Implementation Review)
**Tanggal Review:** 26 Juli 2026

## EVALUASI ALUR

**Alur Saat Ini:**
Program Supervisi -> Teacher Assignment -> Pilih Instrument Template -> Review Konfigurasi -> Konfirmasi -> Generate Instrument Snapshot -> Status = READY_FOR_SCHEDULING

### 1. Logika Urutan Langkah
Urutan langkah sudah sangat logis dan linier. Pendefinisian ruang lingkup (siapa yang akan disupervisi melalui *Teacher Assignment*) dan standar penilaian (instrumen apa yang akan digunakan) adalah prasyarat mutlak sebelum penjadwalan (*Scheduling*) dapat dilakukan.

### 2. Kebutuhan Halaman Review
**Sangat Diperlukan.** Mengubah status dari `DRAFT` menjadi `READY_FOR_SCHEDULING` merupakan sebuah *state transition* yang krusial karena memicu pembuatan *Snapshot*. Halaman atau modal *Review Konfigurasi* berfungsi sebagai *gatekeeper* untuk memastikan Kepala Sekolah sudah yakin dengan pilihannya sebelum sistem "mengunci" draf tersebut.

### 3. Kebutuhan Ringkasan (Summary)
Menampilkan ringkasan sebelum konfirmasi adalah praktik UX yang sangat baik. Ringkasan harus mencakup:
*   **Tahun Ajaran & Semester:** Memastikan program berada di periode yang benar.
*   **Guru Sasaran:** Menampilkan jumlah dan daftar singkat guru yang akan diobservasi.
*   **Template Instrumen:** Nama template yang dipilih.
*   **Detail Instrumen:** Jumlah Kategori Rubrik dan Jumlah Indikator (sebagai verifikasi bahwa template tidak kosong).

### 4. Terminologi Tombol Aksi
Tombol "Gunakan Template" kurang merepresentasikan dampak dari tindakan tersebut (karena terkesan hanya sekadar memilih).
**Rekomendasi:** Gunakan **"Selesaikan Konfigurasi"** atau **"Kunci & Siapkan Program"**. Terminologi ini memberikan *mental model* kepada pengguna bahwa tahap draf telah selesai dan program akan masuk ke tahap selanjutnya.

### 5. Aturan Penguncian (Locking Rules) pasca-Snapshot
Setelah status berubah menjadi `READY_FOR_SCHEDULING`:
*   **Instrumen (Snapshot):** **LOCKED (Terkunci Mutlak).** Tidak boleh diubah. Jika instrumen salah, pengguna harus mengembalikan status program ke `DRAFT` (dengan konsekuensi tertentu) atau membuat program baru.
*   **Teacher Assignment:** 
    *   *Tambah Guru:* Masih diperbolehkan (aman).
    *   *Hapus Guru:* Hanya diperbolehkan jika guru tersebut belum memiliki jadwal supervisi (`SupervisionSchedule`).
*   **Tahun Ajaran & Semester:** **LOCKED.**

### 6. Risiko Histori jika Template Berubah
**Risiko: NOL (Zero Risk).**
Karena arsitektur menggunakan sistem **Instrument Snapshot** (di mana *Template* disalin seluruh nilainya secara mendalam/ *deep copy* dan disimpan sebagai bagian dari *Program Supervisi* dengan ID tersendiri), maka perubahan apapun pada *Master Template* di masa depan (misal: ganti nama kategori, tambah indikator, ubah bobot) **TIDAK AKAN** mempengaruhi program yang sudah dikonfigurasi. Data observasi historis 100% aman dan terisolasi.

---

## KESIMPULAN

Alur secara bisnis dan sistem (Domain Driven Design) sudah sangat matang. Transisi state dan pembuatan *snapshot* memberikan fondasi yang sangat kuat dan *bulletproof* terhadap anomali data di masa depan. Perbaikan hanya minor di sisi UX (penambahan *Review Summary* dan perubahan teks tombol).

**READY FOR IMPLEMENTATION**
