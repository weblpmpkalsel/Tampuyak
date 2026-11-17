# LAPORAN AUDIT & BLUEPRINT ARSITEKTUR: MODUL SUPERVISI AKADEMIK

**Tanggal Audit:** 26 Juli 2026
**Status Dokumen:** FINAL
**Klasifikasi:** READ-ONLY AUDIT (Tidak ada perubahan pada *source code*)

---

## RINGKASAN ANALISIS
Audit telah dilakukan terhadap struktur arsitektur *Tampuyak OS* saat ini. Sistem yang berjalan memiliki stabilitas tinggi pada modul inti (KSP, RKJM, RKT, RKAS). Untuk menjaga integritas sistem, Modul Supervisi Akademik dirancang sebagai entitas yang sepenuhnya mandiri (*independent module*) yang beroperasi dengan prinsip **Strict Read-Only** terhadap data historis dan perencanaan sekolah. Modul ini tidak akan mengubah satu baris pun logika dari modul yang di-*lock*.

---

## A. DATA YANG SUDAH TERSEDIA (POTENSI *REUSE*)
Berdasarkan hasil analisis terhadap *data models* dan *services*, berikut adalah data yang dapat dibaca (Read-Only) oleh Modul Supervisi Akademik:

1. **Profil & Identitas Sekolah** (`OrganizationProfile`, `SchoolProfile`)
   - Nama Sekolah, NPSN, Alamat, Status.
2. **Data Pimpinan & Organisasi** (`SchoolOrganization`)
   - Nama Kepala Sekolah, NIP, Tim Kurikulum.
3. **Data Tahun Ajaran & Kalender Pendidikan** (`AcademicYear`, `AcademicCalendarService`)
   - Tahun ajaran aktif, semester, jadwal akademik.
4. **Perencanaan Menengah & Tahunan** (RKJM & RKT)
   - Membaca program peningkatan kompetensi guru atau kegiatan supervisi yang telah direncanakan di RKT.
5. **Kurikulum Satuan Pendidikan** (KSP)
   - Karakteristik Pendidik, Pengorganisasian Pembelajaran.
6. **Rapor Pendidikan** (`EducationReportParser`)
   - Membaca skor indikator kinerja sekolah yang berkaitan dengan kualitas pembelajaran dan guru.

---

## B. DATA YANG HARUS DIBUAT BARU (DATA SPESIFIK SUPERVISI)
Sistem belum memiliki *schema* atau data untuk mengelola proses supervisi. Data berikut harus dibuat sebagai *collection* atau struktur objek baru secara terisolasi:

1. **Jadwal & Penugasan Supervisi**
   - Penetapan asesor/supervisor dan guru yang disupervisi (Pra-observasi, Observasi, Pasca-observasi).
2. **Instrumen & Rubrik Observasi**
   - Indikator Kinerja Guru, rubrik penilaian pedagogik dan profesional, serta daftar periksa kelengkapan administrasi mengajar (Modul Ajar/RPP).
3. **Catatan Pelaksanaan Supervisi (Observasi)**
   - Skor penilaian, temuan di kelas, dan catatan deskriptif.
4. **Jurnal Coaching & Refleksi**
   - Catatan pasca-observasi, umpan balik dari supervisor, dan respons guru.
5. **Rencana Tindak Lanjut (RTL)**
   - Rencana pelatihan lanjutan, mentoring, atau *focus group discussion* (FGD) berdasarkan hasil supervisi.

---

## C. HUBUNGAN ANTAR MODUL
Modul Supervisi Akademik beroperasi di bagian hilir (*downstream*) dari perencanaan strategis.

```text
[KSP] (Karakteristik & Visi Pembelajaran)
  │
  ▼
[RKJM] (Peta Jalan Peningkatan Mutu Guru)
  │
  ▼
[RKT] (Rencana Operasional Supervisi Tahun Berjalan)
  │
  ▼
[SUPERVISI AKADEMIK] (Pelaksanaan, Pengukuran, Observasi)  <-- [Modul Baru, Read Only ke Modul Atas]
  │
  ▼
[EVALUASI & COACHING]
  │
  ▼
[RTL] (Tindak Lanjut & Rekomendasi RKT Tahun Berikutnya)
```

**Penjelasan Relasi:**
- **Membaca (Read):** Modul Supervisi membaca target dari RKJM/RKT untuk memastikan pelaksanaan sejalan dengan rencana tahunan, serta membaca KSP untuk menyelaraskan penilaian dengan visi kurikulum sekolah.
- **Tindak Lanjut:** Output dari Supervisi (RTL) pada akhirnya akan menjadi masukan berharga (namun terpisah dari sistem saat ini) saat sekolah menyusun RKT di tahun ajaran berikutnya.

---

## D. POTENSI REUSE KOMPONEN (UI & SISTEM)
Untuk mempercepat pengembangan tanpa mengganggu kode lama, komponen berikut dapat langsung digunakan kembali (*imported*):

1. **Sistem Autentikasi & Role Guard** (`OrganizationGuard`, `PortalDashboardGuard`)
   - Memastikan hanya Kepala Sekolah, Pengawas, atau Asesor yang berhak melakukan supervisi.
2. **Print & Export Engine** (`DocumentExportEngine`, `pdf_export`)
   - Reusable untuk mengekspor Lembar Hasil Observasi dan Catatan Supervisi menjadi PDF yang siap ditandatangani.
3. **Enterprise UI Shell & Layouts** (`EnterpriseWorkspaceShell`, CSS Variables)
   - Memastikan UI Supervisi memiliki konsistensi visual (tipografi, warna, spacing) dengan *Tampuyak OS*.
4. **Event Bus / Notification System** (`EventBus`)
   - Memanfaatkan *event system* untuk memberi notifikasi kepada guru saat jadwal supervisi diterbitkan.

---

## E. RISIKO INTEGRASI & STRATEGI MITIGASI

| Risiko Integrasi | Dampak Potensial | Solusi & Strategi Pencegahan |
| :--- | :--- | :--- |
| **Konflik State Management** | Perubahan state Supervisi secara tidak sengaja memicu *Autosave* yang menimpa draf RKT/RKJM. | Isolasi Context. Modul Supervisi harus memiliki `SupervisionContext` sendiri dan tidak menyentuh `WorkspaceContext` milik perencanaan. |
| **Beban Database / Kueri** | Menarik data KSP/RKT yang sangat besar hanya untuk melihat nama program, menyebabkan *lag*. | Terapkan pola *Proyeksi* (Projection) atau baca secara asinkron (GraphQL/REST terpisah) hanya *field* yang relevan (seperti ID dan judul program). |
| **Mutasi Data Tak Disengaja** | Akses referensi objek dari modul lama termutasi saat diolah di modul supervisi. | Lakukan *Deep Copy* (`structuredClone` atau spread operator) pada data historis sebelum digunakan di UI Supervisi. |
| **Konflik Ekspor PDF** | Stylesheet print global (*print.css*) bentrok antara tabel RKT dan tabel Rubrik Supervisi. | Gunakan CSS Modules khusus atau pembungkus *namespace* (contoh: `.supervisi-print-container`) untuk mencetak dokumen supervisi. |

---

## F. REKOMENDASI ARSITEKTUR

1. **Paradigma "Observer / Sidecar"**
   - Bangun Supervisi Akademik sebagai modul *Sidecar* di dalam direktori tersendiri (misal: `/src/supervision/`). Modul ini hanya akan "mengamati" dan mengambil (fetch) identitas sekolah dan kalender tanpa berbagi state *mutator* dengan RKT.
2. **Pemisahan Database (Collection Baru)**
   - Buat *collection* Firestore mandiri: `academic_supervisions` dan `supervision_instruments`.
   - Gunakan `organizationId` dan `academicYear` sebagai *foreign keys* untuk menghubungkannya dengan konteks sekolah yang aktif.
3. **Pemisahan Logika Bisnis**
   - Buat `SupervisionEngine.ts` yang benar-benar lepas dari `OperationalPlanningEngine.ts` atau `DocumentCompositionEngine.ts`.
4. **Desain Read-Only Interfaces**
   - Dalam modul Supervisi, ketika mengambil tipe data RKT/RKJM, bungkus dengan utilitas TypeScript `Readonly<T>` untuk mencegah modifikasi secara lokal di level kompilasi.

**KESIMPULAN:**
Blueprint di atas menjamin tidak ada gangguan fungsional terhadap sistem lama, dengan batas-batas (*boundaries*) domain yang sangat tegas antara "Perencanaan" (RKJM/RKT) dan "Pengawasan" (Supervisi). Tahap implementasi siap dilakukan di fase selanjutnya sesuai blueprint ini.
