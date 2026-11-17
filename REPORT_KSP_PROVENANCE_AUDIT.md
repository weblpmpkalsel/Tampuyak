# KSP GOLD 2.0 - SCIENTIFIC CONTRACT LOCK
## FIELD PROVENANCE AUDIT & ARCHITECTURE VALIDATION

### 1. FIELD PROVENANCE MATRIX

| Nama Field | Digunakan pada BAB | Digunakan oleh | Asal Data Seharusnya | Lokasi Source Saat Ini | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Identitas Sekolah (Cover & Pengesahan)** |
| School Name | Cover, Pengesahan, Bab 1 | Builder / Preview | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| NPSN | Cover, Pengesahan | Builder / Preview | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Alamat, Desa, Kecamatan, Kab/Kota, Provinsi | Cover, Bab 1 | Builder / Preview | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Tahun Pelajaran | Cover, Bab 1, Bab 3 | Builder / Preview | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Logo Sekolah & Pemerintah | Cover | Builder / Preview | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Tanggal Pengesahan | Pengesahan | Builder | Data KSP | `KspDocumentAssembler.ts` (Literal: '15 Juli 2023') | **HARDCODE** |
| Kepala Sekolah (Nama, NIP) | Pengesahan, Bab 1, Bab 3 | Builder | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Komite Sekolah (Nama) | Pengesahan | Builder | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Kepala Dinas (Nama, NIP, Jabatan) | Pengesahan | Builder | Settings | `EnterpriseConfigurationCenter.ts` | **HARDCODE** |
| Wakil Kepala Sekolah | Bab 1, Bab 3 | Builder | Settings | `KspDocumentAssembler.ts` (Literal: 'Bapak Wakil, S.Pd.') | **HARDCODE** |
| **BAB 1: Karakteristik Satuan Pendidikan** |
| Community (Orang Tua, Industri) | Bab 1 | Builder | Data KSP / Settings | `KspDocumentAssembler.ts` (Literal objek) | **HARDCODE** |
| Facilities (Kelas, Perpustakaan, Internet) | Bab 1 | Builder | Settings | `KspDocumentAssembler.ts` (Literal objek) | **HARDCODE** |
| Governance (Akreditasi) | Bab 1 | Builder | Settings | `KspDocumentAssembler.ts` (Literal objek) | **HARDCODE** |
| **BAB 2: Visi, Misi, dan Tujuan** |
| Visi | Bab 2 | Builder | Settings / Data KSP | `KspDocumentAssembler.ts` (Literal string) | **HARDCODE** |
| Misi | Bab 2 | Builder | Settings / Data KSP | `KspDocumentAssembler.ts` (Literal array) | **HARDCODE** |
| Tujuan | Bab 2 | Builder | Settings / Data KSP | `KspDocumentAssembler.ts` (Literal array) | **HARDCODE** |
| **BAB 3: Pengorganisasian Pembelajaran** |
| Waktu Efektif, Semester | Bab 3 | Builder | Data KSP / Gov Ref | `KspDocumentAssembler.ts` (Literal: 36, 'Ganjil') | **HARDCODE** |
| Fase & Jenjang (SMP/Fase D) | Bab 3 | Builder | Settings | `KspDocumentAssembler.ts` (Literal: 'SMP', 'Fase D') | **HARDCODE** |
| Intrakurikuler, Kokurikuler, Ekstrakurikuler | Bab 3 | Builder | Data KSP | `KspDocumentAssembler.ts` (Literal array/string) | **HARDCODE** |
| **BAB 4: Perencanaan Pembelajaran** |
| Prinsip, Pendekatan, Asesmen, Inklusi, Diferensiasi | Bab 4 | Builder | Gov Ref / Data KSP | `KspDocumentAssembler.ts` (Literal string/array) | **HARDCODE** |
| **BAB 5: Evaluasi & Pengembangan Profesional** |
| Mekanisme Evaluasi, Jadwal, Pihak Terlibat | Bab 5 | Builder | Gov Ref / Data KSP | `KspDocumentAssembler.ts` (Literal string/array) | **HARDCODE** |
| Penjaminan Mutu, Supervisi, Tindak Lanjut | Bab 5 | Builder | Gov Ref / Data KSP | `KspDocumentAssembler.ts` (Literal string/array) | **HARDCODE** |

### 2. OWNER MATRIX

| Entitas Data | Owner Seharusnya | Keterangan |
| :--- | :--- | :--- |
| Identitas Sekolah (Nama, NIP, Alamat, Tahun) | **Settings** (Global AppContext) | Identitas dasar yang berlaku lintas dokumen. |
| Karakteristik, Visi, Misi, Tujuan | **Settings** (`settings.identitas`, dll.) | Dimasukkan oleh user melalui menu Pengaturan. |
| Struktur Kurikulum (Intra, Koko, Ekstra) | **Data KSP** | Konten esensial yang spesifik untuk dokumen KSP. |
| Kebijakan Pembelajaran, Evaluasi | **Data KSP / Gov Ref** | Kebijakan spesifik sekolah yang mengacu pada panduan nasional. |
| Tanggal Pengesahan | **Data KSP** | Metadata dinamis dokumen. |

### 3. CONSUMER MATRIX

| Consumer | Komponen | Peran |
| :--- | :--- | :--- |
| **Dashboard** | `KSPDashboard.tsx` | Hanya membaca (Read-only view) metadata ringkas sekolah. |
| **Assembler** | `KspDocumentAssembler.ts` | Menggabungkan data mentah menjadi `CanonicalDocument`. Seharusnya murni pure function. |
| **Preview** | `KspPreviewWorkspace.tsx` | Me-render struktur AST dokumen tanpa manipulasi state asal. |

### 4. MISSING SOURCE REPORT
* **Struktur Kurikulum Lengkap (Muatan Pelajaran, Ekstrakurikuler):** Belum ada schema di dalam modul Settings ataupun KSP state khusus yang menampung beban JP dan mata pelajaran.
* **Tanggal Pengesahan:** Belum ada input form atau metadata di database untuk menyimpan kapan dokumen disahkan.
* **Kebijakan Pembelajaran (Bab 4 & 5):** Belum ada tempat penyimpanan (repository) untuk menyimpan kebijakan spesifik operasional sekolah.

### 5. HARDCODE REPORT
Terdapat **100% hardcode / mock injection** di dalam file `src/enterprise/document/ksp/KspDocumentAssembler.ts`.
Semua payload yang disalurkan ke `buildKspBab1Section` hingga `buildKspBab5Section` didefinisikan sebagai string literal, object literal, atau array literal di level Assembler. 
Selain itu, `EnterpriseConfigurationCenter.ts` murni berisi placeholder ("SMP Negeri 1 Contoh").

### 6. MULTIPLE SOURCE REPORT
Pelanggaran Single Source of Truth terjadi pada:
* `curriculumTeam`: Di-compose dari `EnterpriseConfigurationCenter` dan string literal manual `'Bapak Wakil, S.Pd.'`.
* Visi/Misi/Tujuan yang ada di global `Settings` diabaikan, dan Assembler membuat payload visinya sendiri.

### 7. ARCHITECTURE VALIDATION

| Prinsip | Status | Alasan |
| :--- | :--- | :--- |
| **Single Source of Truth** | **FAIL** | Data Settings ada, namun KSP Assembler membuat data dummy sendiri dan mem-bypass Settings. |
| **Separation of Concern** | **FAIL** | Assembler merangkap tugas sebagai penyedia data statis (Knowledge base hardcoded). |
| **Dependency Inversion** | **FAIL** | Assembler terikat secara kuat (tightly coupled) terhadap instance konfigurasi dummy `EnterpriseConfigurationCenter`. |
| **Anti-Corruption Layer** | **FAIL** | Tidak ada adapter; UI/Assembler langsung bergantung pada file konfigurasi lokal yang statis. |
| **Government Fidelity** | **PASS** (Structure), **FAIL** (Content) | Struktur BAB sesuai panduan (BAB 1-5), namun isi narasi menggunakan kalimat dummy yang sama untuk semua sekolah. |
| **Zero Shared Mutable State** | **PASS** | `EnterpriseConfigurationCenter` bersifat statis (tidak mutable pada runtime), tapi justru tidak bisa diedit. |

### 8. FINAL READINESS SCORE
**Score: 10/100 (CRITICAL FAULT)**
Modul KSP masih dalam tahap prototipe presentasi visual dan secara struktural sepenuhnya bergantung pada mock data, mem-bypass arsitektur state utama TAMPUYAK OS.

### 9. GO / NO GO
**NO GO**
Implementasi tidak boleh dilanjutkan dengan cara melakukan hardcoding terhadap `AppContext`.
Dibutuhkan penyelesaian **Metadata Adapter** dan injeksi dari **Settings** ke dalam `KspDocumentAssembler` sebelum KSP siap untuk dirender secara dinamis. Modul KSP harus diubah menjadi fungsi *pure* yang menerima parameter data yang jelas.
