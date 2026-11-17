# DOMAIN MODEL: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Fase:** S6.2 Domain Model & Type System
**Status:** FINAL (Safe Mode)

Dokumen ini menjelaskan struktur Domain Model yang digunakan pada Modul Supervisi Akademik TAMPUYAK OS berdasarkan prinsip Domain Driven Design (DDD). Domain Model ini mencerminkan bahasa proses bisnis pengawasan sekolah, bukan skema tabel database. Seluruh model ditulis menggunakan antarmuka (interface) TypeScript dan menghindari penggunaan *business logic* terintegrasi (Zero Logic Implementation).

---

## 1. STRATEGI SNAPSHOT & READ-ONLY CONTRACT

Mengingat Modul Supervisi Akademik bersifat *Sidecar* (berdiri sendiri), maka tidak diperbolehkan menyimpan *pointer* atau relasi referensial mutlak yang bisa merusak modul lama (KSP, RKJM, RKT). Setiap entitas luar yang diambil dari sistem utama (Planning Engine atau Profil Sekolah) wajib dibungkus dalam bentuk **Snapshot** (rekaman mati) menggunakan tipe TypeScript `Readonly<T>`.

**Snapshot yang Tersedia:**
- `TeacherSnapshot`: Membekukan data identitas guru (NIP, pangkat, nama) tepat pada hari jadwal ditetapkan. Ini memastikan riwayat laporan supervisi tidak akan cacat meski data guru aslinya berubah atau guru tersebut mutasi.
- `TeachingModuleSnapshot`: Membekukan referensi terhadap RPP/Modul Ajar yang digunakan saat observasi.
- `RktProgramSnapshot`: Rekaman referensi pada program RKT yang melandasi dilaksanakannya program supervisi.
- `AcademicCalendarSnapshot`: Rekaman semester/tahun aktif saat program supervisi dibuat.

---

## 2. AGGREGATE ROOTS & ENTITIES

Berikut adalah entitas utama (Entities) dan agregat (Aggregate Roots) yang membangun Domain Model Supervisi.

### A. Perencanaan & Penugasan
1. **`SupervisionPlan` (Aggregate Root)**
   - **Tujuan:** Bertindak sebagai kontainer utama (Program Supervisi) per semester untuk satu sekolah.
   - **Lifecycle:** Mulai dari Draft -> Disahkan (Published) -> Selesai.
   - **Ownership:** Supervision Module.
2. **`SupervisionSchedule`**
   - **Tujuan:** Memetakan siapa yang mengobservasi (Supervisor) dan siapa yang diobservasi (Teacher) pada waktu tertentu.
   - **Lifecycle:** Mengalir dari Draft -> Dijadwalkan -> Selesai.
   - **Ownership:** Supervision Module.

### B. Eksekusi Supervisi (The Supervision Aggregate)
3. **`Supervision` (Aggregate Root)**
   - **Tujuan:** Pengikat (binder) dari seluruh siklus (Pra-Observasi, Observasi, Pasca-Observasi, dan RTL) untuk satu orang guru pada satu jadwal.
   - **Lifecycle:** Sepanjang siklus jadwal hingga diterbitkannya RTL.
4. **`PreObservation`**
   - **Tujuan:** Menyimpan hasil telaah administrasi dokumen perangkat ajar sebelum masuk kelas.
5. **`ObservationSession` & `Observation`**
   - **Tujuan:** Merekam konteks, waktu, skor rubrik (`ObservationScore`), dan catatan (`ObservationNote`) saat asesor berada di kelas.
6. **`Evidence`**
   - **Tujuan:** Melampirkan bukti autentik (tautan Google Drive, foto, atau teks) sebagai pendukung nilai rubrik.

### C. Refleksi & Coaching
7. **`PostObservation`**
   - **Tujuan:** Membungkus seluruh aktivitas setelah observasi kelas selesai.
8. **`Reflection`**
   - **Tujuan:** Pandangan dan evaluasi diri dari guru yang diobservasi.
9. **`CoachingSession`**
   - **Tujuan:** Catatan bimbingan dari asesor dan kesepakatan langkah perbaikan.

### D. Rencana Tindak Lanjut (RTL) & Rekomendasi
10. **`FollowUp` & `ActionPlan`**
    - **Tujuan:** Daftar langkah konkret yang harus diambil guru ke depannya, dimonitor progresnya (`Monitoring`).
11. **`Recommendation`**
    - **Tujuan:** Memberikan umpan balik level sekolah (agregasi) untuk Kepala Sekolah, yang nantinya bisa disuntikkan secara manual ke RKT tahun berikutnya.

### E. Utilitas Transparansi
12. **`AuditTrail`**
    - **Tujuan:** Melacak siapa, mengubah status apa, pada jam berapa, di dalam modul supervisi (transparansi proses).
13. **`DocumentReference`**
    - **Tujuan:** Referensi ke laporan PDF yang telah diekspor oleh mesin penerbitan.

---

## 3. ENUMERASI (VALUE OBJECTS)

Domain Language juga dibakukan menggunakan sejumlah enumerasi (Enum):
- `SupervisionStatus`: Status siklus pengawasan (Draft, Dijadwalkan, Observasi, Dibatalkan, Selesai, dll).
- `ObservationStatus`: Progres sebuah lembar observasi.
- `SupervisionScoreCategory`: Predikat normatif (Sangat Baik, Baik, Cukup, Kurang).
- `CoachingStatus`: Fase dari sesi bimbingan.
- `ApprovalStatus`: Persetujuan dokumen secara digital (Pending, Approved, Rejected).

---

## 4. KESIMPULAN AUDIT

Model domain yang disusun sepenuhnya sesuai dengan instruksi *Zero Impact*. Seluruh definisi berfokus pada pemodelan relasi tipe TypeScript tanpa melibatkan fungsi reaktif, JSX, basis data, ataupun *hook*. Fondasi *type system* ini sudah solid dan siap menunjang implementasi UI dan Storage pada fase selanjutnya.
