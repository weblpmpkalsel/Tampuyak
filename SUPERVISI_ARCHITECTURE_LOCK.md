# ARCHITECTURE CONTRACT & LOCK: MODUL SUPERVISI AKADEMIK

**Tanggal Dokumen:** 26 Juli 2026
**Status Dokumen:** FINAL LOCK (No Implementation)
**Klasifikasi:** ARCHITECTURE CONTRACT

Dokumen ini mendefinisikan aturan mutlak, arsitektur, dan batasan implementasi untuk Modul Supervisi Akademik. Segala bentuk implementasi (UI, komponen, *state*, *database*) di masa mendatang **DIWAJIBKAN** untuk mematuhi kontrak ini tanpa pengecualian.

---

## A. FINAL ARCHITECTURE DIAGRAM

Modul Supervisi Akademik dirancang menggunakan pola **Sidecar Module**. Modul ini berjalan berdampingan dengan modul inti (*Core Modules*) namun tidak pernah mengintervensi alur kerja mereka.

```text
+-----------------------------------------------------------------------+
|                           TAMPUYAK OS                                 |
+-----------------------------------------------------------------------+
|       +-------------+       +-------------+       +-------------+     |
|       | ORG MODULE  |       |  PLANNING   |       |  KNOWLEDGE  |     |
|       | (Profile/   |       | (RKJM/RKT/  |       | (KSP/       |     |
|       |  Teachers)  |       |  Rapor)     |       |  Kalender)  |     |
|       +------+------+       +------+------+       +------+------+     |
|              ^                     ^                     ^            |
|              | (Read-Only)         | (Read-Only)         | (Read-Only)|
+--------------|---------------------|---------------------|------------+
|              v                     v                     v            |
| +-------------------------------------------------------------------+ |
| |                        SIDECAR MODULE                             | |
| |                     [SUPERVISI AKADEMIK]                          | |
| |                                                                   | |
| |   +-----------------------------------------------------------+   | |
| |   | Independent React Context & State Management              |   | |
| |   +-----------------------------------------------------------+   | |
| |   | • Jadwal & Program Supervisi                              |   | |
| |   | • Instrumen & Pra-Observasi                               |   | |
| |   | • Observasi Kelas                                         |   | |
| |   | • Pasca-Observasi (Refleksi & Coaching)                   |   | |
| |   | • Rencana Tindak Lanjut (RTL) & Rekomendasi               |   | |
| |   +-----------------------------------------------------------+   | |
| +----------------------------------+--------------------------------+ |
|                                    |                                  |
|                                    v                                  |
| +-------------------------------------------------------------------+ |
| |               INDEPENDENT SUPERVISION STORAGE                     | |
| |                 (Collections / Namespace Baru)                    | |
| +-------------------------------------------------------------------+ |
```

---

## B. DATA FLOW DIAGRAM

Modul Supervisi mengumpulkan data dengan teknik *Read-Only Projection*. Modul ini bertindak sebagai hilir (konsumen) dan menghasilkan data baru yang terisolasi.

```text
[Data Sources - TERKUNCI] 
 (OrganizationProfile) ----> [Projection] --+
 (AcademicCalendar) -------> [Projection] --+
 (RKT / Program) ----------> [Projection] --+---> [Supervision Context]
 (TeacherData) ------------> [Projection] --+             |
 (Rapor Pendidikan) -------> [Projection] --+             |
                                                          v
                                                 [Supervision Engine]
                                                          |
                                  +-----------------------+-----------------------+
                                  |                       |                       |
                                  v                       v                       v
                           (Create/Update)         (Create/Update)         (Create/Update)
                         [Program Supervisi]   [Instrumen & Observasi]    [Coaching & RTL]
                                  |                       |                       |
                                  +-----------------------+-----------------------+
                                                          |
                                                          v
                                            [SUPERVISION INDEPENDENT STORAGE]
```

---

## C. READ ONLY CONTRACT

Kontrak mutlak ini menjamin tidak ada mutasi data terhadap dokumen perencanaan dan profil sekolah.

1. **NO MUTATION:** *Supervision Engine* tidak akan pernah mengimpor fungsi mutator seperti `saveRKT()`, `updateRKJM()`, `updateSchoolProfile()`, atau `saveKSP()`.
2. **DATA PROJECTION:** Jika modul supervisi membutuhkan daftar guru atau program RKT, data tersebut harus direpresentasikan sebagai tipe *Read-Only* di tingkat TypeScript (misal: `Readonly<TeacherData>`).
3. **NO SYNC-BACK:** Perubahan nama guru atau perubahan jadwal supervisi **TIDAK** menyinkronkan kembali datanya ke Profil Sekolah atau Kalender Pendidikan.

---

## D. OWNERSHIP MATRIX

Matriks ini menegaskan pemilik sah dari setiap ranah data. Sebuah modul hanya boleh memodifikasi data yang dimilikinya.

| Domain Data / Entitas | Modul Pemilik (Owner) | Akses oleh Modul Supervisi |
| :--- | :--- | :--- |
| Profil & Identitas Sekolah | Organization Module | **Read-Only** |
| Data Pegawai & Guru | Organization Module | **Read-Only** |
| Kalender Pendidikan | Calendar Module / Knowledge | **Read-Only** |
| Kurikulum Satuan Pendidikan (KSP)| Curriculum Hub (Knowledge) | **Read-Only** |
| Rapor Pendidikan | Evaluation Module / Planning | **Read-Only** |
| Rencana Kerja Jangka Menengah (RKJM)| Planning Engine | **Read-Only** |
| Rencana Kerja Tahunan (RKT) | Planning Engine | **Read-Only** |
| Rencana Kerja & Anggaran (RKAS)| Budgeting Engine | **Read-Only** |
| **Program & Jadwal Supervisi** | **Supervision Module** | **Read & Write (Full)** |
| **Instrumen Observasi Kelas** | **Supervision Module** | **Read & Write (Full)** |
| **Hasil Coaching & Refleksi** | **Supervision Module** | **Read & Write (Full)** |
| **RTL & Laporan Supervisi** | **Supervision Module** | **Read & Write (Full)** |

---

## E. BOUNDARY RULES

1. **Aturan Isolasi (*Sidecar*)**: Modul Supervisi Akademik berjalan dalam ruang lingkup (*namespace*) sendiri (contoh: `/src/supervision`). Tidak ada percampuran kode dengan `/src/planning` atau `/src/ksp`.
2. **Aturan State Mandiri**: Modul ini harus menginisialisasi `SupervisionContext` dan manajemen status (*state*) tersendiri, yang bebas dari pengontrol `WorkspaceContext` RKT/RKJM.
3. **Aturan Non-Otomatis (Non-Intrusive)**: Hasil analisis, evaluasi, dan Rencana Tindak Lanjut (RTL) yang lahir dari proses supervisi **TIDAK BOLEH** disuntikkan secara otomatis menjadi program baru di RKT atau RKJM. Rekomendasi tersebut murni berstatus sebagai lampiran referensi (sebagai *insight*) bagi Kepala Sekolah.
4. **Aturan Penyimpanan Eksekutif**: Segala data supervisi (berita acara observasi, skor pra-observasi, kesepakatan coaching) akan dienkapsulasi dan disimpan secara independen. 

---

## F. EVIDENCE FLOW (ALUR BUKTI & PELAKSANAAN)

Alur pelaksanaan supervisi bergerak secara sekuensial, dari analisis hingga keluaran rekomendasi, **tanpa memicu satu pun mutasi pada RKT/RKJM**. 

```text
[Rapor Pendidikan]
       ↓
   [Analisis]
       ↓
[Program Supervisi]
       ↓
   [Observasi]
       ↓
   [Refleksi]
       ↓
   [Coaching]
       ↓
     [RTL]
       ↓
 [Rekomendasi] (Bahan Pertimbangan KS, BUKAN inject otomatis ke RKT)
```

---
*Dokumen "Architecture Lock" ini menjamin skalabilitas sistem dan perlindungan integritas bagi seluruh komponen legacy TAMPUYAK OS. Segala tahap implementasi teknis berikutnya wajib merujuk pada ketentuan ini.*
